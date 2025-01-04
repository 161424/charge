package inet

import (
	"bytes"
	"errors"
	"image"
	"image/color"
	"image/png"
	"io"
	"log"
	"os"
)

type RecoveryLevel int
type dataEncoderType uint8

const (
	dataEncoderType1To9 dataEncoderType = iota
	dataEncoderType10To26
	dataEncoderType27To40
)

type QRCode struct {
	// Original content encoded.
	Content string

	// QR Code type.
	Level         RecoveryLevel
	VersionNumber int

	// User settable drawing options.
	ForegroundColor color.Color
	BackgroundColor color.Color

	encoder *dataEncoder
	version qrCodeVersion
	symbol  *symbol
	data    *Bitset
	mask    int
}

type symbol struct {
	module        [][]bool
	isUsed        [][]bool
	size          int
	symbolSize    int
	quietZoneSize int
}
type dataMode uint8

type segment struct {
	dataMode dataMode
	data     []byte
}

type dataEncoder struct {
	minVersion int
	maxVersion int

	numericModeIndicator      *Bitset
	alphanumericModeIndicator *Bitset
	byteModeIndicator         *Bitset

	numNumericCharCountBits      int
	numAlphanumericCharCountBits int
	numByteCharCountBits         int

	data []byte

	actual []segment

	optimised []segment
}

const (
	// Level L: 7% error recovery.
	Low RecoveryLevel = iota

	// Level M: 15% error recovery. Good default choice.
	Medium

	// Level Q: 25% error recovery.
	High

	// Level H: 30% error recovery.
	Highest
)

type Bitset struct {
	numBits int
	bits    []byte
}

type block struct {
	numBlocks        int
	numCodewords     int
	numDataCodewords int
}

type qrCodeVersion struct {
	// Version number (1-40 inclusive).
	version         int
	level           RecoveryLevel
	dataEncoderType dataEncoderType

	block            []block
	numRemainderBits int
}

func bNew(v ...bool) *Bitset {
	b := &Bitset{numBits: 0, bits: make([]byte, 0)}
	b.AppendBools(v...)
	return b
}

func (b *Bitset) AppendBools(bits ...bool) {
	b.ensureCapacity(len(bits))
	for _, v := range bits {
		if v {
			b.bits[b.numBits/8] |= 0x80 >> uint(b.numBits%8)
		}
		b.numBits++
	}
}

func (b *Bitset) ensureCapacity(numBits int) {
	numBits += b.numBits

	newNumBytes := numBits / 8
	if numBits%8 != 0 {
		newNumBytes++
	}

	if len(b.bits) >= newNumBytes {
		return
	}

	b.bits = append(b.bits, make([]byte, newNumBytes+2*len(b.bits))...)
}

const (
	b0 = false
	b1 = true
)

func newDataEncoder(t dataEncoderType) *dataEncoder {
	d := &dataEncoder{
		minVersion:                   10,
		maxVersion:                   26,
		numericModeIndicator:         bNew(b0, b0, b0, b1),
		alphanumericModeIndicator:    bNew(b0, b0, b1, b0),
		byteModeIndicator:            bNew(b0, b1, b0, b0),
		numNumericCharCountBits:      12,
		numAlphanumericCharCountBits: 11,
		numByteCharCountBits:         16,
	}

	return d
}

const (
	dataModeNone dataMode = 1 << iota
	dataModeNumeric
	dataModeAlphanumeric
	dataModeByte
)

func (d *dataEncoder) classifyDataModes() dataMode {
	var start int
	mode := dataModeNone
	highestRequiredMode := mode

	for i, v := range d.data {
		newMode := dataModeNone
		switch {
		case v >= 0x30 && v <= 0x39:
			newMode = dataModeNumeric
		case v == 0x20 || v == 0x24 || v == 0x25 || v == 0x2a || v == 0x2b || v ==
			0x2d || v == 0x2e || v == 0x2f || v == 0x3a || (v >= 0x41 && v <= 0x5a):
			newMode = dataModeAlphanumeric
		default:
			newMode = dataModeByte
		}

		if newMode != mode {
			if i > 0 {
				d.actual = append(d.actual, segment{dataMode: mode, data: d.data[start:i]})
				start = i
			}
			mode = newMode
		}
		if newMode > highestRequiredMode {
			highestRequiredMode = newMode
		}
	}
	d.actual = append(d.actual, segment{dataMode: mode, data: d.data[start:len(d.data)]})
	return highestRequiredMode
}

func (d *dataEncoder) modeIndicator(dataMode dataMode) *Bitset {
	switch dataMode {
	case dataModeNumeric:
		return d.numericModeIndicator
	case dataModeAlphanumeric:
		return d.alphanumericModeIndicator
	case dataModeByte:
		return d.byteModeIndicator
	default:
		log.Panic("Unknown data mode")
	}
	return nil
}

func (d *dataEncoder) charCountBits(dataMode dataMode) int {
	switch dataMode {
	case dataModeNumeric:
		return d.numNumericCharCountBits
	case dataModeAlphanumeric:
		return d.numAlphanumericCharCountBits
	case dataModeByte:
		return d.numByteCharCountBits
	default:
		log.Panic("Unknown data mode")
	}
	return 0
}

func (d *dataEncoder) encodedLength(dataMode dataMode, n int) (int, error) {
	modeIndicator := d.modeIndicator(dataMode)
	charCountBits := d.charCountBits(dataMode)

	if modeIndicator == nil {
		return 0, errors.New("mode not supported")
	}

	maxLength := (1 << uint8(charCountBits)) - 1
	if n > maxLength {
		return 0, errors.New("length too long to be represented")
	}

	length := modeIndicator.Len() + charCountBits
	switch dataMode {
	case dataModeNumeric:
		length += 10 * (n / 3)
		if n%3 != 0 {
			length += 1 + 3*(n%3)
		}
	case dataModeAlphanumeric:
		length += 11 * (n / 2)
		length += 6 * (n % 2)
	case dataModeByte:
		length += 8 * n

	}

	return length, nil
}

func (d *dataEncoder) optimiseDataModes() error {
	for i := 0; i < len(d.actual); {
		mode := d.actual[i].dataMode
		numChars := len(d.actual[i].data)

		j := i + 1
		for j < len(d.actual) {
			nextNumChars := len(d.actual[j].data)
			nextMode := d.actual[j].dataMode

			if nextMode > mode {
				break
			}

			coalescedLength, err := d.encodedLength(mode, numChars+nextNumChars)
			if err != nil {
				return err
			}

			seperateLength1, err := d.encodedLength(mode, numChars)
			if err != nil {
				return err
			}

			seperateLength2, err := d.encodedLength(nextMode, nextNumChars)
			if err != nil {
				return err
			}

			if coalescedLength < seperateLength1+seperateLength2 {
				j++
				numChars += nextNumChars
			} else {
				break
			}
		}

		optimised := segment{dataMode: mode, data: make([]byte, 0, numChars)}

		for k := i; k < j; k++ {
			optimised.data = append(optimised.data, d.actual[k].data...)
		}
		d.optimised = append(d.optimised, optimised)
		i = j
	}
	return nil
}
func (b *Bitset) Len() int {
	return b.numBits
}
func (b *Bitset) At(index int) bool {
	if index >= b.numBits {
		log.Panicf("Index %d out of range", index)
	}
	return (b.bits[index/8] & (0x80 >> byte(index%8))) != 0
}
func (b *Bitset) Append(other *Bitset) {
	b.ensureCapacity(other.numBits)
	for i := 0; i < other.numBits; i++ {
		if other.At(i) {
			b.bits[b.numBits/8] |= 0x80 >> uint(b.numBits%8)
		}
		b.numBits++
	}
}

func (b *Bitset) AppendUint32(value uint32, numBits int) {
	b.ensureCapacity(numBits)

	if numBits > 32 {
		log.Panicf("numBits %d out of range 0-32", numBits)
	}

	for i := numBits - 1; i >= 0; i-- {
		if value&(1<<uint(i)) != 0 {
			b.bits[b.numBits/8] |= 0x80 >> uint(b.numBits%8)
		}
		b.numBits++
	}
}
func (d *dataEncoder) encodeDataRaw(data []byte, dataMode dataMode, encoded *Bitset) {
	modeIndicator := d.modeIndicator(dataMode)
	charCountBits := d.charCountBits(dataMode)

	// Append mode indicator.
	encoded.Append(modeIndicator)

	// Append character count.
	encoded.AppendUint32(uint32(len(data)), charCountBits)
	var value uint32
	switch dataMode {
	case dataModeNumeric:
		for i := 0; i < len(data); i += 3 {
			charsRemaining := len(data) - i
			bitsUsed := 1

			for j := 0; j < charsRemaining && j < 3; j++ {
				value *= 10
				value += uint32(data[i+j] - 0x30)
				bitsUsed += 3
			}
			encoded.AppendUint32(value, bitsUsed)
		}
	case dataModeAlphanumeric:
		for i := 0; i < len(data); i += 2 {
			charsRemaining := len(data) - i

			for j := 0; j < charsRemaining && j < 2; j++ {
				value *= 45
				value += encodeAlphanumericCharacter(data[i+j])
			}

			bitsUsed := 6
			if charsRemaining > 1 {
				bitsUsed = 11
			}

			encoded.AppendUint32(value, bitsUsed)
		}
	case dataModeByte:
		for _, b := range data {
			encoded.AppendByte(b, 8)
		}

	}
}

func encodeAlphanumericCharacter(v byte) uint32 {
	c := uint32(v)

	switch {
	case c >= '0' && c <= '9':
		// 0-9 encoded as 0-9.
		return c - '0'
	case c >= 'A' && c <= 'Z':
		// A-Z encoded as 10-35.
		return c - 'A' + 10
	case c == ' ':
		return 36
	case c == '$':
		return 37
	case c == '%':
		return 38
	case c == '*':
		return 39
	case c == '+':
		return 40
	case c == '-':
		return 41
	case c == '.':
		return 42
	case c == '/':
		return 43
	case c == ':':
		return 44
	default:
		log.Panicf("encodeAlphanumericCharacter() with non alphanumeric char %v.", v)
	}

	return 0
}

func (d *dataEncoder) encode(data []byte) (*Bitset, error) {
	d.data = data
	d.actual = nil
	d.optimised = nil

	if len(data) == 0 {
		return nil, errors.New("no data to encode")
	}

	highestRequiredMode := d.classifyDataModes()

	err := d.optimiseDataModes()
	if err != nil {
		return nil, err
	}

	optimizedLength := 0
	for _, s := range d.optimised {
		length, err := d.encodedLength(s.dataMode, len(s.data))
		if err != nil {
			return nil, err
		}
		optimizedLength += length
	}

	singleByteSegmentLength, err := d.encodedLength(highestRequiredMode, len(d.data))
	if err != nil {
		return nil, err
	}

	if singleByteSegmentLength <= optimizedLength {
		d.optimised = []segment{{dataMode: highestRequiredMode, data: d.data}}
	}

	// Encode data.
	encoded := bNew()
	for _, s := range d.optimised {
		d.encodeDataRaw(s.data, s.dataMode, encoded)
	}

	return encoded, nil
}

func New(content string, level RecoveryLevel) (*QRCode, error) {
	encoders := dataEncoderType10To26

	var encoder *dataEncoder
	var encoded *Bitset
	var chosenVersion *qrCodeVersion
	var err error

	encoder = newDataEncoder(encoders)
	encoded, err = encoder.encode([]byte(content))
	chosenVersion = chooseQRCodeVersion(level, encoder, encoded.Len())

	if err != nil {
		return nil, err
	} else if chosenVersion == nil {
		return nil, errors.New("content too long to encode")
	}

	q := &QRCode{
		Content: content,

		Level:         level,
		VersionNumber: chosenVersion.version,

		ForegroundColor: color.Black,
		BackgroundColor: color.White,

		encoder: encoder,
		data:    encoded,
		version: *chosenVersion,
	}

	return q, nil
}

func (q *QRCode) Write(out io.Writer) error {
	var png []byte
	size := 64
	png, err := q.PNG(size)

	if err != nil {
		return err
	}
	_, err = out.Write(png)
	return err
}

func (q *QRCode) WriteFile(filename string) error {
	var png []byte
	size := 64
	png, err := q.PNG(size)

	if err != nil {
		return err
	}

	return os.WriteFile(filename, png, os.FileMode(0644))
}

func (q *QRCode) PNG(size int) ([]byte, error) {
	img := q.Image(size)

	encoder := png.Encoder{CompressionLevel: png.BestCompression}

	var b bytes.Buffer
	err := encoder.Encode(&b, img)

	if err != nil {
		return nil, err
	}

	return b.Bytes(), nil
}

func (m *symbol) bitmap() [][]bool {
	module := make([][]bool, len(m.module))
	for i := range m.module {
		module[i] = m.module[i][:]
	}

	return module
}

func (q *QRCode) Image(size int) image.Image {
	// Build QR code.
	q.encode()

	realSize := q.symbol.size

	if size < 0 {
		size = size * -1 * realSize
	}

	if size < realSize {
		size = realSize
	}

	// Output image.
	rect := image.Rectangle{Min: image.Point{0, 0}, Max: image.Point{size, size}}

	p := color.Palette([]color.Color{q.BackgroundColor, q.ForegroundColor})
	img := image.NewPaletted(rect, p)
	fgClr := uint8(img.Palette.Index(q.ForegroundColor))

	// QR code bitmap.
	bitmap := q.symbol.bitmap()

	// Map each image pixel to the nearest QR code module.
	modulesPerPixel := float64(realSize) / float64(size)
	for y := 0; y < size; y++ {
		y2 := int(float64(y) * modulesPerPixel)
		for x := 0; x < size; x++ {
			x2 := int(float64(x) * modulesPerPixel)
			v := bitmap[y2][x2]
			if v {
				pos := img.PixOffset(x, y)
				img.Pix[pos] = fgClr
			}
		}
	}

	return img
}

func (b *Bitset) AppendNumBools(num int, value bool) {
	for i := 0; i < num; i++ {
		b.AppendBools(value)
	}
}

func (q *QRCode) addPadding() {
	numDataBits := q.version.numDataBits()
	if q.data.Len() == numDataBits {
		return
	}

	// Pad to the nearest codeword boundary.
	q.data.AppendNumBools(q.version.numBitsToPadToCodeword(q.data.Len()), false)

	// Pad codewords 0b11101100 and 0b00010001.
	padding := [2]*Bitset{
		bNew(true, true, true, false, true, true, false, false),
		bNew(false, false, false, true, false, false, false, true),
	}

	// Insert pad codewords alternately.
	i := 0
	for numDataBits-q.data.Len() >= 8 {
		q.data.Append(padding[i])
		i = 1 - i // Alternate between 0 and 1.
	}

	if q.data.Len() != numDataBits {
		log.Panicf("BUG: got len %d, expected %d", q.data.Len(), numDataBits)
	}
}

type regularSymbol struct {
	version qrCodeVersion
	mask    int
	data    *Bitset
	symbol  *symbol
	size    int
}

func newSymbol(size int, quietZoneSize int) *symbol {
	var m symbol

	m.module = make([][]bool, size+2*quietZoneSize)
	m.isUsed = make([][]bool, size+2*quietZoneSize)

	for i := range m.module {
		m.module[i] = make([]bool, size+2*quietZoneSize)
		m.isUsed[i] = make([]bool, size+2*quietZoneSize)
	}

	m.size = size + 2*quietZoneSize
	m.symbolSize = size
	m.quietZoneSize = quietZoneSize

	return &m
}
func buildRegularSymbol(version qrCodeVersion, mask int, data *Bitset) (*symbol, error) {

	quietZoneSize := version.quietZoneSize()
	m := &regularSymbol{
		version: version,
		mask:    mask,
		data:    data,

		symbol: newSymbol(version.symbolSize(), quietZoneSize),
		size:   version.symbolSize(),
	}

	m.addFinderPatterns()
	m.addAlignmentPatterns()
	m.addTimingPatterns()
	m.addFormatInfo()
	m.addVersionInfo()

	ok, err := m.addData()
	if !ok {
		return nil, err
	}

	return m.symbol, nil
}

type direction uint8

const (
	up direction = iota
	down
)

func (m *symbol) set(x int, y int, v bool) {
	m.module[y+m.quietZoneSize][x+m.quietZoneSize] = v
	m.isUsed[y+m.quietZoneSize][x+m.quietZoneSize] = true
}

func (m *regularSymbol) addData() (bool, error) {
	xOffset := 1
	dir := up

	x := m.size - 2
	y := m.size - 1

	for i := 0; i < m.data.Len(); i++ {
		var mask bool
		switch m.mask {
		case 0:
			mask = (y+x+xOffset)%2 == 0
		case 1:
			mask = y%2 == 0
		case 2:
			mask = (x+xOffset)%3 == 0
		case 3:
			mask = (y+x+xOffset)%3 == 0
		case 4:
			mask = (y/2+(x+xOffset)/3)%2 == 0
		case 5:
			mask = (y*(x+xOffset))%2+(y*(x+xOffset))%3 == 0
		case 6:
			mask = ((y*(x+xOffset))%2+((y*(x+xOffset))%3))%2 == 0
		case 7:
			mask = ((y+x+xOffset)%2+((y*(x+xOffset))%3))%2 == 0
		}

		// != is equivalent to XOR.
		m.symbol.set(x+xOffset, y, mask != m.data.At(i))

		if i == m.data.Len()-1 {
			break
		}

		// Find next free bit in the symbol.
		for {
			if xOffset == 1 {
				xOffset = 0
			} else {
				xOffset = 1
				if dir == up {
					if y > 0 {
						y--
					} else {
						dir = down
						x -= 2
					}
				} else {
					if y < m.size-1 {
						y++
					} else {
						dir = up
						x -= 2
					}
				}
			}

			if x == 5 {
				x--
			}

			if m.symbol.empty(x+xOffset, y) {
				break
			}
		}
	}

	return true, nil
}

func (m *symbol) empty(x int, y int) bool {
	return !m.isUsed[y+m.quietZoneSize][x+m.quietZoneSize]
}

func (m *symbol) numEmptyModules() int {
	var count int
	for y := 0; y < m.symbolSize; y++ {
		for x := 0; x < m.symbolSize; x++ {
			if !m.isUsed[y+m.quietZoneSize][x+m.quietZoneSize] {
				count++
			}
		}
	}

	return count
}
func (m *symbol) penaltyScore() int {
	return m.penalty1() + m.penalty2() + m.penalty3() + m.penalty4()
}
func (q *QRCode) encode() {
	q.data.AppendNumBools(4, false)
	q.addPadding()

	encoded := q.encodeBlocks()

	const numMasks int = 8
	penalty := 0
	var s *symbol
	var err error
	for mask := 0; mask < numMasks; mask++ {
		s, err = buildRegularSymbol(q.version, mask, encoded)
		if err != nil {
			log.Panic(err.Error())
		}

		numEmptyModules := s.numEmptyModules()
		if numEmptyModules != 0 {
			log.Panicf("bug: numEmptyModules is %d (expected 0) (version=%d)",
				numEmptyModules, q.VersionNumber)
		}

		p := s.penaltyScore()

		if q.symbol == nil || p < penalty {
			q.symbol = s
			q.mask = mask
			penalty = p
		}
	}
}

type gfPoly struct {
	term []gfElement
}

func newGFPolyFromData(data *Bitset) gfPoly {
	numTotalBytes := data.Len() / 8
	if data.Len()%8 != 0 {
		numTotalBytes++
	}

	result := gfPoly{term: make([]gfElement, numTotalBytes)}

	i := numTotalBytes - 1
	for j := 0; j < data.Len(); j += 8 {
		result.term[i] = gfElement(data.ByteAt(j))
		i--
	}

	return result
}
func (b *Bitset) ByteAt(index int) byte {
	if index < 0 || index >= b.numBits {
		log.Panicf("Index %d out of range", index)
	}

	var result byte

	for i := index; i < index+8 && i < b.numBits; i++ {
		result <<= 1
		if b.At(i) {
			result |= 1
		}
	}

	return result
}

type gfElement uint8

func gfPolyMultiply(a, b gfPoly) gfPoly {
	numATerms := a.numTerms()
	numBTerms := b.numTerms()

	result := gfPoly{term: make([]gfElement, numATerms+numBTerms)}

	for i := 0; i < numATerms; i++ {
		for j := 0; j < numBTerms; j++ {
			if a.term[i] != 0 && b.term[j] != 0 {
				monomial := gfPoly{term: make([]gfElement, i+j+1)}
				monomial.term[i+j] = gfMultiply(a.term[i], b.term[j])
				result = gfPolyAdd(result, monomial)
			}
		}
	}

	return result.normalised()
}

func (e gfPoly) normalised() gfPoly {
	numTerms := e.numTerms()
	maxNonzeroTerm := numTerms - 1

	for i := numTerms - 1; i >= 0; i-- {
		if e.term[i] != 0 {
			break
		}
		maxNonzeroTerm = i - 1
	}

	if maxNonzeroTerm < 0 {
		return gfPoly{}
	} else if maxNonzeroTerm < numTerms-1 {
		e.term = e.term[0 : maxNonzeroTerm+1]
	}

	return e
}
func gfAdd(a, b gfElement) gfElement {
	return a ^ b
}

func gfPolyAdd(a, b gfPoly) gfPoly {
	numATerms := a.numTerms()
	numBTerms := b.numTerms()

	numTerms := numATerms
	if numBTerms > numTerms {
		numTerms = numBTerms
	}

	result := gfPoly{term: make([]gfElement, numTerms)}

	for i := 0; i < numTerms; i++ {
		switch {
		case numATerms > i && numBTerms > i:
			result.term[i] = gfAdd(a.term[i], b.term[i])
		case numATerms > i:
			result.term[i] = a.term[i]
		default:
			result.term[i] = b.term[i]
		}
	}

	return result.normalised()
}

// gfSub returns a - b.
//
// Note addition is equivalent to subtraction in GF(2).
const (
	gfZero = gfElement(0)
	gfOne  = gfElement(1)
)

// gfMultiply returns a * b.
func gfMultiply(a, b gfElement) gfElement {
	if a == gfZero || b == gfZero {
		return gfZero
	}

	return gfExpTable[(gfLogTable[a]+gfLogTable[b])%255]
}
func (e gfPoly) numTerms() int {
	return len(e.term)
}
func newGFPolyMonomial(term gfElement, degree int) gfPoly {
	if term == gfZero {
		return gfPoly{}
	}

	result := gfPoly{term: make([]gfElement, degree+1)}
	result.term[degree] = term
	return result
}

func rsGeneratorPoly(degree int) gfPoly {
	if degree < 2 {
		log.Panic("degree < 2")
	}

	generator := gfPoly{term: []gfElement{1}}
	for i := 0; i < degree; i++ {
		nextPoly := gfPoly{term: []gfElement{gfExpTable[i], 1}}
		generator = gfPolyMultiply(generator, nextPoly)
	}

	return generator
}

func (e gfPoly) equals(other gfPoly) bool {
	var minecPoly *gfPoly
	var maxecPoly *gfPoly

	if e.numTerms() > other.numTerms() {
		minecPoly = &other
		maxecPoly = &e
	} else {
		minecPoly = &e
		maxecPoly = &other
	}

	numMinTerms := minecPoly.numTerms()
	numMaxTerms := maxecPoly.numTerms()

	for i := 0; i < numMinTerms; i++ {
		if e.term[i] != other.term[i] {
			return false
		}
	}

	for i := numMinTerms; i < numMaxTerms; i++ {
		if maxecPoly.term[i] != 0 {
			return false
		}
	}

	return true
}

func gfInverse(a gfElement) gfElement {
	if a == gfZero {
		log.Panicln("No multiplicative inverse of 0")
	}
	return gfExpTable[255-gfLogTable[a]]
}

func gfDivide(a, b gfElement) gfElement {
	if a == gfZero {
		return gfZero
	} else if b == gfZero {
		log.Panicln("Divide by zero")
	}
	return gfMultiply(a, gfInverse(b))
}

func gfPolyRemainder(numerator, denominator gfPoly) gfPoly {
	if denominator.equals(gfPoly{}) {
		log.Panicln("Remainder by zero")
	}

	remainder := numerator
	for remainder.numTerms() >= denominator.numTerms() {
		degree := remainder.numTerms() - denominator.numTerms()
		coefficient := gfDivide(remainder.term[remainder.numTerms()-1],
			denominator.term[denominator.numTerms()-1])

		divisor := gfPolyMultiply(denominator,
			newGFPolyMonomial(coefficient, degree))

		remainder = gfPolyAdd(remainder, divisor)
	}

	return remainder.normalised()
}

func Encode(data *Bitset, numECBytes int) *Bitset {

	ecpoly := newGFPolyFromData(data)
	ecpoly = gfPolyMultiply(ecpoly, newGFPolyMonomial(gfOne, numECBytes))
	generator := rsGeneratorPoly(numECBytes)
	remainder := gfPolyRemainder(ecpoly, generator)
	result := Clone(data)
	result.AppendBytes(remainder.data(numECBytes))

	return result
}

func (e gfPoly) data(numTerms int) []byte {
	result := make([]byte, numTerms)

	i := numTerms - len(e.term)
	for j := len(e.term) - 1; j >= 0; j-- {
		result[i] = byte(e.term[j])
		i++
	}

	return result
}

func (b *Bitset) AppendByte(value byte, numBits int) {
	b.ensureCapacity(numBits)
	if numBits > 8 {
		log.Panicf("numBits %d out of range 0-8", numBits)
	}

	for i := numBits - 1; i >= 0; i-- {
		if value&(1<<uint(i)) != 0 {
			b.bits[b.numBits/8] |= 0x80 >> uint(b.numBits%8)
		}
		b.numBits++
	}
}

func (b *Bitset) AppendBytes(data []byte) {
	for _, d := range data {
		b.AppendByte(d, 8)
	}
}

func Clone(from *Bitset) *Bitset {
	return &Bitset{numBits: from.numBits, bits: from.bits[:]}
}

func (b *Bitset) Substr(start int, end int) *Bitset {
	if start > end || end > b.numBits {
		log.Panicf("Out of range start=%d end=%d numBits=%d", start, end, b.numBits)
	}

	result := bNew()
	result.ensureCapacity(end - start)

	for i := start; i < end; i++ {
		if b.At(i) {
			result.bits[result.numBits/8] |= 0x80 >> uint(result.numBits%8)
		}
		result.numBits++
	}
	return result
}

func (q *QRCode) encodeBlocks() *Bitset {
	// Split into blocks.
	type dataBlock struct {
		data          *Bitset
		ecStartOffset int
	}
	block := make([]dataBlock, q.version.numBlocks())
	start := 0
	end := 0
	blockID := 0
	for _, b := range q.version.block {
		for j := 0; j < b.numBlocks; j++ {
			start = end
			end = start + b.numDataCodewords*8

			// Apply error correction to each block.
			numErrorCodewords := b.numCodewords - b.numDataCodewords
			block[blockID].data = Encode(q.data.Substr(start, end), numErrorCodewords)
			block[blockID].ecStartOffset = end - start

			blockID++
		}
	}

	result := bNew()

	// Combine data blocks.
	working := true
	for i := 0; working; i += 8 {
		working = false
		for j, b := range block {
			if i >= block[j].ecStartOffset {
				continue
			}
			result.Append(b.data.Substr(i, i+8))
			working = true
		}
	}

	// Combine error correction blocks.
	working = true
	for i := 0; working; i += 8 {
		working = false

		for j, b := range block {
			offset := i + block[j].ecStartOffset
			if offset >= block[j].data.Len() {
				continue
			}

			result.Append(b.data.Substr(offset, offset+8))

			working = true
		}
	}

	// Append remainder bits.
	result.AppendNumBools(q.version.numRemainderBits, false)

	return result
}

func (m *symbol) set2dPattern(x int, y int, v [][]bool) {
	for j, row := range v {
		for i, value := range row {
			m.set(x+i, y+j, value)
		}
	}
}

func (m *regularSymbol) addFinderPatterns() {
	fpSize := finderPatternSize
	fp := finderPattern
	fpHBorder := finderPatternHorizontalBorder
	fpVBorder := finderPatternVerticalBorder

	// Top left Finder Pattern.
	m.symbol.set2dPattern(0, 0, fp)
	m.symbol.set2dPattern(0, fpSize, fpHBorder)
	m.symbol.set2dPattern(fpSize, 0, fpVBorder)

	// Top right Finder Pattern.
	m.symbol.set2dPattern(m.size-fpSize, 0, fp)
	m.symbol.set2dPattern(m.size-fpSize-1, fpSize, fpHBorder)
	m.symbol.set2dPattern(m.size-fpSize-1, 0, fpVBorder)

	// Bottom left Finder Pattern.
	m.symbol.set2dPattern(0, m.size-fpSize, fp)
	m.symbol.set2dPattern(0, m.size-fpSize-1, fpHBorder)
	m.symbol.set2dPattern(fpSize, m.size-fpSize-1, fpVBorder)
}

func (m *regularSymbol) addAlignmentPatterns() {
	for _, x := range alignmentPatternCenter[m.version.version] {
		for _, y := range alignmentPatternCenter[m.version.version] {
			if !m.symbol.empty(x, y) {
				continue
			}

			m.symbol.set2dPattern(x-2, y-2, alignmentPattern)
		}
	}
}

func (m *regularSymbol) addTimingPatterns() {
	value := true

	for i := finderPatternSize + 1; i < m.size-finderPatternSize; i++ {
		m.symbol.set(i, finderPatternSize-1, value)
		m.symbol.set(finderPatternSize-1, i, value)

		value = !value
	}
}

func (m *regularSymbol) addFormatInfo() {
	fpSize := finderPatternSize
	l := formatInfoLengthBits - 1

	f := m.version.formatInfo(m.mask)

	// Bits 0-7, under the top right finder pattern.
	for i := 0; i <= 7; i++ {
		m.symbol.set(m.size-i-1, fpSize+1, f.At(l-i))
	}

	// Bits 0-5, right of the top left finder pattern.
	for i := 0; i <= 5; i++ {
		m.symbol.set(fpSize+1, i, f.At(l-i))
	}

	// Bits 6-8 on the corner of the top left finder pattern.
	m.symbol.set(fpSize+1, fpSize, f.At(l-6))
	m.symbol.set(fpSize+1, fpSize+1, f.At(l-7))
	m.symbol.set(fpSize, fpSize+1, f.At(l-8))

	// Bits 9-14 on the underside of the top left finder pattern.
	for i := 9; i <= 14; i++ {
		m.symbol.set(14-i, fpSize+1, f.At(l-i))
	}

	// Bits 8-14 on the right side of the bottom left finder pattern.
	for i := 8; i <= 14; i++ {
		m.symbol.set(fpSize+1, m.size-fpSize+i-8, f.At(l-i))
	}

	// Always dark symbol.
	m.symbol.set(fpSize+1, m.size-fpSize-1, true)
}

func (m *regularSymbol) addVersionInfo() {
	fpSize := finderPatternSize

	v := m.version.versionInfo()
	l := versionInfoLengthBits - 1

	for i := 0; i < v.Len(); i++ {
		m.symbol.set(i/3, m.size-fpSize-4+i%3, v.At(l-i))
		m.symbol.set(m.size-fpSize-4+i%3, i/3, v.At(l-i))
	}
}
func (m *symbol) get(x int, y int) (v bool) {
	v = m.module[y+m.quietZoneSize][x+m.quietZoneSize]
	return
}

const (
	penaltyWeight1 = 3
	penaltyWeight2 = 3
	penaltyWeight3 = 40
	penaltyWeight4 = 10
)

func (m *symbol) penalty1() int {
	penalty := 0

	for x := 0; x < m.symbolSize; x++ {
		lastValue := m.get(x, 0)
		count := 1
		for y := 1; y < m.symbolSize; y++ {
			v := m.get(x, y)

			if v != lastValue {
				count = 1
				lastValue = v
			} else {
				count++
				if count == 6 {
					penalty += penaltyWeight1 + 1
				} else if count > 6 {
					penalty++
				}
			}
		}
	}

	for y := 0; y < m.symbolSize; y++ {
		lastValue := m.get(0, y)
		count := 1

		for x := 1; x < m.symbolSize; x++ {
			v := m.get(x, y)

			if v != lastValue {
				count = 1
				lastValue = v
			} else {
				count++
				if count == 6 {
					penalty += penaltyWeight1 + 1
				} else if count > 6 {
					penalty++
				}
			}
		}
	}

	return penalty
}

// penalty2 returns the penalty score for "block of modules in the same colour".
//
// m*n: score = penaltyWeight2 * (m-1) * (n-1).
func (m *symbol) penalty2() int {
	penalty := 0

	for y := 1; y < m.symbolSize; y++ {
		for x := 1; x < m.symbolSize; x++ {
			topLeft := m.get(x-1, y-1)
			above := m.get(x, y-1)
			left := m.get(x-1, y)
			current := m.get(x, y)

			if current == left && current == above && current == topLeft {
				penalty++
			}
		}
	}

	return penalty * penaltyWeight2
}

// penalty3 returns the penalty score for "1:1:3:1:1 ratio
// (dark:light:dark:light:dark) pattern in row/column, preceded or followed by
// light area 4 modules wide".
//
// Existence of the pattern scores penaltyWeight3.
func (m *symbol) penalty3() int {
	penalty := 0

	for y := 0; y < m.symbolSize; y++ {
		var bitBuffer int16 = 0x00

		for x := 0; x < m.symbolSize; x++ {
			bitBuffer <<= 1
			if v := m.get(x, y); v {
				bitBuffer |= 1
			}

			switch bitBuffer & 0x7ff {
			// 0b000 0101 1101 or 0b10111010000
			// 0x05d           or 0x5d0
			case 0x05d, 0x5d0:
				penalty += penaltyWeight3
				bitBuffer = 0xFF
			default:
				if x == m.symbolSize-1 && (bitBuffer&0x7f) == 0x5d {
					penalty += penaltyWeight3
					bitBuffer = 0xFF
				}
			}
		}
	}

	for x := 0; x < m.symbolSize; x++ {
		var bitBuffer int16 = 0x00

		for y := 0; y < m.symbolSize; y++ {
			bitBuffer <<= 1
			if v := m.get(x, y); v {
				bitBuffer |= 1
			}

			switch bitBuffer & 0x7ff {
			// 0b000 0101 1101 or 0b10111010000
			// 0x05d           or 0x5d0
			case 0x05d, 0x5d0:
				penalty += penaltyWeight3
				bitBuffer = 0xFF
			default:
				if y == m.symbolSize-1 && (bitBuffer&0x7f) == 0x5d {
					penalty += penaltyWeight3
					bitBuffer = 0xFF
				}
			}
		}
	}

	return penalty
}

// penalty4 returns the penalty score...
func (m *symbol) penalty4() int {
	numModules := m.symbolSize * m.symbolSize
	numDarkModules := 0

	for x := 0; x < m.symbolSize; x++ {
		for y := 0; y < m.symbolSize; y++ {
			if v := m.get(x, y); v {
				numDarkModules++
			}
		}
	}

	numDarkModuleDeviation := numModules/2 - numDarkModules
	if numDarkModuleDeviation < 0 {
		numDarkModuleDeviation *= -1
	}

	return penaltyWeight4 * (numDarkModuleDeviation / (numModules / 20))
}

var (
	gfExpTable = [256]gfElement{
		/*   0 -   9 */ 1, 2, 4, 8, 16, 32, 64, 128, 29, 58,
		/*  10 -  19 */ 116, 232, 205, 135, 19, 38, 76, 152, 45, 90,
		/*  20 -  29 */ 180, 117, 234, 201, 143, 3, 6, 12, 24, 48,
		/*  30 -  39 */ 96, 192, 157, 39, 78, 156, 37, 74, 148, 53,
		/*  40 -  49 */ 106, 212, 181, 119, 238, 193, 159, 35, 70, 140,
		/*  50 -  59 */ 5, 10, 20, 40, 80, 160, 93, 186, 105, 210,
		/*  60 -  69 */ 185, 111, 222, 161, 95, 190, 97, 194, 153, 47,
		/*  70 -  79 */ 94, 188, 101, 202, 137, 15, 30, 60, 120, 240,
		/*  80 -  89 */ 253, 231, 211, 187, 107, 214, 177, 127, 254, 225,
		/*  90 -  99 */ 223, 163, 91, 182, 113, 226, 217, 175, 67, 134,
		/* 100 - 109 */ 17, 34, 68, 136, 13, 26, 52, 104, 208, 189,
		/* 110 - 119 */ 103, 206, 129, 31, 62, 124, 248, 237, 199, 147,
		/* 120 - 129 */ 59, 118, 236, 197, 151, 51, 102, 204, 133, 23,
		/* 130 - 139 */ 46, 92, 184, 109, 218, 169, 79, 158, 33, 66,
		/* 140 - 149 */ 132, 21, 42, 84, 168, 77, 154, 41, 82, 164,
		/* 150 - 159 */ 85, 170, 73, 146, 57, 114, 228, 213, 183, 115,
		/* 160 - 169 */ 230, 209, 191, 99, 198, 145, 63, 126, 252, 229,
		/* 170 - 179 */ 215, 179, 123, 246, 241, 255, 227, 219, 171, 75,
		/* 180 - 189 */ 150, 49, 98, 196, 149, 55, 110, 220, 165, 87,
		/* 190 - 199 */ 174, 65, 130, 25, 50, 100, 200, 141, 7, 14,
		/* 200 - 209 */ 28, 56, 112, 224, 221, 167, 83, 166, 81, 162,
		/* 210 - 219 */ 89, 178, 121, 242, 249, 239, 195, 155, 43, 86,
		/* 220 - 229 */ 172, 69, 138, 9, 18, 36, 72, 144, 61, 122,
		/* 230 - 239 */ 244, 245, 247, 243, 251, 235, 203, 139, 11, 22,
		/* 240 - 249 */ 44, 88, 176, 125, 250, 233, 207, 131, 27, 54,
		/* 250 - 255 */ 108, 216, 173, 71, 142, 1}

	gfLogTable = [256]int{
		/*   0 -   9 */ -1, 0, 1, 25, 2, 50, 26, 198, 3, 223,
		/*  10 -  19 */ 51, 238, 27, 104, 199, 75, 4, 100, 224, 14,
		/*  20 -  29 */ 52, 141, 239, 129, 28, 193, 105, 248, 200, 8,
		/*  30 -  39 */ 76, 113, 5, 138, 101, 47, 225, 36, 15, 33,
		/*  40 -  49 */ 53, 147, 142, 218, 240, 18, 130, 69, 29, 181,
		/*  50 -  59 */ 194, 125, 106, 39, 249, 185, 201, 154, 9, 120,
		/*  60 -  69 */ 77, 228, 114, 166, 6, 191, 139, 98, 102, 221,
		/*  70 -  79 */ 48, 253, 226, 152, 37, 179, 16, 145, 34, 136,
		/*  80 -  89 */ 54, 208, 148, 206, 143, 150, 219, 189, 241, 210,
		/*  90 -  99 */ 19, 92, 131, 56, 70, 64, 30, 66, 182, 163,
		/* 100 - 109 */ 195, 72, 126, 110, 107, 58, 40, 84, 250, 133,
		/* 110 - 119 */ 186, 61, 202, 94, 155, 159, 10, 21, 121, 43,
		/* 120 - 129 */ 78, 212, 229, 172, 115, 243, 167, 87, 7, 112,
		/* 130 - 139 */ 192, 247, 140, 128, 99, 13, 103, 74, 222, 237,
		/* 140 - 149 */ 49, 197, 254, 24, 227, 165, 153, 119, 38, 184,
		/* 150 - 159 */ 180, 124, 17, 68, 146, 217, 35, 32, 137, 46,
		/* 160 - 169 */ 55, 63, 209, 91, 149, 188, 207, 205, 144, 135,
		/* 170 - 179 */ 151, 178, 220, 252, 190, 97, 242, 86, 211, 171,
		/* 180 - 189 */ 20, 42, 93, 158, 132, 60, 57, 83, 71, 109,
		/* 190 - 199 */ 65, 162, 31, 45, 67, 216, 183, 123, 164, 118,
		/* 200 - 209 */ 196, 23, 73, 236, 127, 12, 111, 246, 108, 161,
		/* 210 - 219 */ 59, 82, 41, 157, 85, 170, 251, 96, 134, 177,
		/* 220 - 229 */ 187, 204, 62, 90, 203, 89, 95, 176, 156, 169,
		/* 230 - 239 */ 160, 81, 11, 245, 22, 235, 122, 117, 44, 215,
		/* 240 - 249 */ 79, 174, 213, 233, 230, 231, 173, 232, 116, 214,
		/* 250 - 255 */ 244, 234, 168, 80, 88, 175}
)
var (
	alignmentPatternCenter = [][]int{
		{}, // Version 0 doesn't exist.
		{}, // Version 1 doesn't use alignment patterns.
		{6, 18},
		{6, 22},
		{6, 26},
		{6, 30},
		{6, 34},
		{6, 22, 38},
		{6, 24, 42},
		{6, 26, 46},
		{6, 28, 50},
		{6, 30, 54},
		{6, 32, 58},
		{6, 34, 62},
		{6, 26, 46, 66},
		{6, 26, 48, 70},
		{6, 26, 50, 74},
		{6, 30, 54, 78},
		{6, 30, 56, 82},
		{6, 30, 58, 86},
		{6, 34, 62, 90},
		{6, 28, 50, 72, 94},
		{6, 26, 50, 74, 98},
		{6, 30, 54, 78, 102},
		{6, 28, 54, 80, 106},
		{6, 32, 58, 84, 110},
		{6, 30, 58, 86, 114},
		{6, 34, 62, 90, 118},
		{6, 26, 50, 74, 98, 122},
		{6, 30, 54, 78, 102, 126},
		{6, 26, 52, 78, 104, 130},
		{6, 30, 56, 82, 108, 134},
		{6, 34, 60, 86, 112, 138},
		{6, 30, 58, 86, 114, 142},
		{6, 34, 62, 90, 118, 146},
		{6, 30, 54, 78, 102, 126, 150},
		{6, 24, 50, 76, 102, 128, 154},
		{6, 28, 54, 80, 106, 132, 158},
		{6, 32, 58, 84, 110, 136, 162},
		{6, 26, 54, 82, 110, 138, 166},
		{6, 30, 58, 86, 114, 142, 170},
	}

	finderPattern = [][]bool{
		{b1, b1, b1, b1, b1, b1, b1},
		{b1, b0, b0, b0, b0, b0, b1},
		{b1, b0, b1, b1, b1, b0, b1},
		{b1, b0, b1, b1, b1, b0, b1},
		{b1, b0, b1, b1, b1, b0, b1},
		{b1, b0, b0, b0, b0, b0, b1},
		{b1, b1, b1, b1, b1, b1, b1},
	}

	finderPatternSize = 7

	finderPatternHorizontalBorder = [][]bool{
		{b0, b0, b0, b0, b0, b0, b0, b0},
	}

	finderPatternVerticalBorder = [][]bool{
		{b0},
		{b0},
		{b0},
		{b0},
		{b0},
		{b0},
		{b0},
		{b0},
	}

	alignmentPattern = [][]bool{
		{b1, b1, b1, b1, b1},
		{b1, b0, b0, b0, b1},
		{b1, b0, b1, b0, b1},
		{b1, b0, b0, b0, b1},
		{b1, b1, b1, b1, b1},
	}
)
