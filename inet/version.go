// go-qrcode
// Copyright 2014 Tom Harwood

package inet

import "log"

var (
	versions = []qrCodeVersion{
		{
			10,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					2,
					86,
					68,
				},
				{
					2,
					87,
					69,
				},
			},
			0,
		},
		{
			10,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					4,
					69,
					43,
				},
				{
					1,
					70,
					44,
				},
			},
			0,
		},
		{
			10,
			High,
			dataEncoderType10To26,
			[]block{
				{
					6,
					43,
					19,
				},
				{
					2,
					44,
					20,
				},
			},
			0,
		},
		{
			11,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					4,
					101,
					81,
				},
			},
			0,
		},
		{
			11,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					1,
					80,
					50,
				},
				{
					4,
					81,
					51,
				},
			},
			0,
		},
		{
			11,
			High,
			dataEncoderType10To26,
			[]block{
				{
					4,
					50,
					22,
				},
				{
					4,
					51,
					23,
				},
			},
			0,
		},
		{
			12,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					2,
					116,
					92,
				},
				{
					2,
					117,
					93,
				},
			},
			0,
		},
		{
			12,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					6,
					58,
					36,
				},
				{
					2,
					59,
					37,
				},
			},
			0,
		},
		{
			12,
			High,
			dataEncoderType10To26,
			[]block{
				{
					4,
					46,
					20,
				},
				{
					6,
					47,
					21,
				},
			},
			0,
		},
		{
			13,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					4,
					133,
					107,
				},
			},
			0,
		},
		{
			13,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					8,
					59,
					37,
				},
				{
					1,
					60,
					38,
				},
			},
			0,
		},
		{
			13,
			High,
			dataEncoderType10To26,
			[]block{
				{
					8,
					44,
					20,
				},
				{
					4,
					45,
					21,
				},
			},
			0,
		},
		{
			14,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					3,
					145,
					115,
				},
				{
					1,
					146,
					116,
				},
			},
			3,
		},
		{
			14,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					4,
					64,
					40,
				},
				{
					5,
					65,
					41,
				},
			},
			3,
		},
		{
			14,
			High,
			dataEncoderType10To26,
			[]block{
				{
					11,
					36,
					16,
				},
				{
					5,
					37,
					17,
				},
			},
			3,
		},
		{
			15,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					5,
					109,
					87,
				},
				{
					1,
					110,
					88,
				},
			},
			3,
		},
		{
			15,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					5,
					65,
					41,
				},
				{
					5,
					66,
					42,
				},
			},
			3,
		},
		{
			15,
			High,
			dataEncoderType10To26,
			[]block{
				{
					5,
					54,
					24,
				},
				{
					7,
					55,
					25,
				},
			},
			3,
		},
		{
			16,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					5,
					122,
					98,
				},
				{
					1,
					123,
					99,
				},
			},
			3,
		},
		{
			16,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					7,
					73,
					45,
				},
				{
					3,
					74,
					46,
				},
			},
			3,
		},
		{
			16,
			High,
			dataEncoderType10To26,
			[]block{
				{
					15,
					43,
					19,
				},
				{
					2,
					44,
					20,
				},
			},
			3,
		},
		{
			17,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					1,
					135,
					107,
				},
				{
					5,
					136,
					108,
				},
			},
			3,
		},
		{
			17,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					10,
					74,
					46,
				},
				{
					1,
					75,
					47,
				},
			},
			3,
		},
		{
			17,
			High,
			dataEncoderType10To26,
			[]block{
				{
					1,
					50,
					22,
				},
				{
					15,
					51,
					23,
				},
			},
			3,
		},
		{
			18,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					5,
					150,
					120,
				},
				{
					1,
					151,
					121,
				},
			},
			3,
		},
		{
			18,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					9,
					69,
					43,
				},
				{
					4,
					70,
					44,
				},
			},
			3,
		},
		{
			18,
			High,
			dataEncoderType10To26,
			[]block{
				{
					17,
					50,
					22,
				},
				{
					1,
					51,
					23,
				},
			},
			3,
		},
		{
			19,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					3,
					141,
					113,
				},
				{
					4,
					142,
					114,
				},
			},
			3,
		},
		{
			19,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					3,
					70,
					44,
				},
				{
					11,
					71,
					45,
				},
			},
			3,
		},
		{
			19,
			High,
			dataEncoderType10To26,
			[]block{
				{
					17,
					47,
					21,
				},
				{
					4,
					48,
					22,
				},
			},
			3,
		},
		{
			20,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					3,
					135,
					107,
				},
				{
					5,
					136,
					108,
				},
			},
			3,
		},
		{
			20,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					3,
					67,
					41,
				},
				{
					13,
					68,
					42,
				},
			},
			3,
		},
		{
			20,
			High,
			dataEncoderType10To26,
			[]block{
				{
					15,
					54,
					24,
				},
				{
					5,
					55,
					25,
				},
			},
			3,
		},
		{
			21,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					4,
					144,
					116,
				},
				{
					4,
					145,
					117,
				},
			},
			4,
		},
		{
			21,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					17,
					68,
					42,
				},
			},
			4,
		},
		{
			21,
			High,
			dataEncoderType10To26,
			[]block{
				{
					17,
					50,
					22,
				},
				{
					6,
					51,
					23,
				},
			},
			4,
		},
		{
			22,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					2,
					139,
					111,
				},
				{
					7,
					140,
					112,
				},
			},
			4,
		},
		{
			22,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					17,
					74,
					46,
				},
			},
			4,
		},
		{
			22,
			High,
			dataEncoderType10To26,
			[]block{
				{
					7,
					54,
					24,
				},
				{
					16,
					55,
					25,
				},
			},
			4,
		},
		{
			23,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					4,
					151,
					121,
				},
				{
					5,
					152,
					122,
				},
			},
			4,
		},
		{
			23,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					4,
					75,
					47,
				},
				{
					14,
					76,
					48,
				},
			},
			4,
		},
		{
			23,
			High,
			dataEncoderType10To26,
			[]block{
				{
					11,
					54,
					24,
				},
				{
					14,
					55,
					25,
				},
			},
			4,
		},
		{
			24,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					6,
					147,
					117,
				},
				{
					4,
					148,
					118,
				},
			},
			4,
		},
		{
			24,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					6,
					73,
					45,
				},
				{
					14,
					74,
					46,
				},
			},
			4,
		},
		{
			24,
			High,
			dataEncoderType10To26,
			[]block{
				{
					11,
					54,
					24,
				},
				{
					16,
					55,
					25,
				},
			},
			4,
		},
		{
			25,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					8,
					132,
					106,
				},
				{
					4,
					133,
					107,
				},
			},
			4,
		},
		{
			25,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					8,
					75,
					47,
				},
				{
					13,
					76,
					48,
				},
			},
			4,
		},
		{
			25,
			High,
			dataEncoderType10To26,
			[]block{
				{
					7,
					54,
					24,
				},
				{
					22,
					55,
					25,
				},
			},
			4,
		},
		{
			26,
			Low,
			dataEncoderType10To26,
			[]block{
				{
					10,
					142,
					114,
				},
				{
					2,
					143,
					115,
				},
			},
			4,
		},
		{
			26,
			Medium,
			dataEncoderType10To26,
			[]block{
				{
					19,
					74,
					46,
				},
				{
					4,
					75,
					47,
				},
			},
			4,
		},
		{
			26,
			High,
			dataEncoderType10To26,
			[]block{
				{
					28,
					50,
					22,
				},
				{
					6,
					51,
					23,
				},
			},
			4,
		},
	}
)

const (
	formatInfoLengthBits  = 15
	versionInfoLengthBits = 18
)

func (v qrCodeVersion) formatInfo(maskPattern int) *Bitset {
	formatID := 0
	switch v.level {
	case Low:
		formatID = 0x08 // 0b01000
	case Medium:
		formatID = 0x00 // 0b00000
	case High:
		formatID = 0x18 // 0b11000
	default:
		log.Panicf("Invalid level %d", v.level)
	}
	if maskPattern < 0 || maskPattern > 7 {
		log.Panicf("Invalid maskPattern %d", maskPattern)
	}
	formatID |= maskPattern & 0x7
	result := bNew()
	result.AppendUint32(formatBitSequence[formatID].regular, formatInfoLengthBits)

	return result
}

func (v qrCodeVersion) versionInfo() *Bitset {
	result := bNew()
	result.AppendUint32(versionBitSequence[v.version], 18)
	return result
}

func (v qrCodeVersion) numDataBits() int {
	numDataBits := 0
	for _, b := range v.block {
		numDataBits += 8 * b.numBlocks * b.numDataCodewords // 8 bits in a byte
	}
	return numDataBits
}

func chooseQRCodeVersion(level RecoveryLevel, encoder *dataEncoder, numDataBits int) *qrCodeVersion {
	var chosenVersion *qrCodeVersion

	for _, v := range versions {
		if v.level != level {
			continue
		} else if v.version < encoder.minVersion {
			continue
		} else if v.version > encoder.maxVersion {
			break
		}

		numFreeBits := v.numDataBits() - numDataBits

		if numFreeBits >= 0 {
			chosenVersion = &v
			break
		}
	}

	return chosenVersion
}

func (v qrCodeVersion) numBlocks() int {
	numBlocks := 0
	for _, b := range v.block {
		numBlocks += b.numBlocks
	}
	return numBlocks
}

func (v qrCodeVersion) numBitsToPadToCodeword(numDataBits int) int {
	if numDataBits == v.numDataBits() {
		return 0
	}
	return (8 - numDataBits%8) % 8
}

func (v qrCodeVersion) symbolSize() int {
	return 21 + (v.version-1)*4
}

func (v qrCodeVersion) quietZoneSize() int {
	return 4
}

var (
	formatBitSequence = []struct {
		regular uint32
		micro   uint32
	}{
		{0x5412, 0x4445},
		{0x5125, 0x4172},
		{0x5e7c, 0x4e2b},
		{0x5b4b, 0x4b1c},
		{0x45f9, 0x55ae},
		{0x40ce, 0x5099},
		{0x4f97, 0x5fc0},
		{0x4aa0, 0x5af7},
		{0x77c4, 0x6793},
		{0x72f3, 0x62a4},
		{0x7daa, 0x6dfd},
		{0x789d, 0x68ca},
		{0x662f, 0x7678},
		{0x6318, 0x734f},
		{0x6c41, 0x7c16},
		{0x6976, 0x7921},
		{0x1689, 0x06de},
		{0x13be, 0x03e9},
		{0x1ce7, 0x0cb0},
		{0x19d0, 0x0987},
		{0x0762, 0x1735},
		{0x0255, 0x1202},
		{0x0d0c, 0x1d5b},
		{0x083b, 0x186c},
		{0x355f, 0x2508},
		{0x3068, 0x203f},
		{0x3f31, 0x2f66},
		{0x3a06, 0x2a51},
		{0x24b4, 0x34e3},
		{0x2183, 0x31d4},
		{0x2eda, 0x3e8d},
		{0x2bed, 0x3bba},
	}

	versionBitSequence = []uint32{
		0x00000,
		0x00000,
		0x00000,
		0x00000,
		0x00000,
		0x00000,
		0x00000,
		0x07c94,
		0x085bc,
		0x09a99,
		0x0a4d3,
		0x0bbf6,
		0x0c762,
		0x0d847,
		0x0e60d,
		0x0f928,
		0x10b78,
		0x1145d,
		0x12a17,
		0x13532,
		0x149a6,
		0x15683,
		0x168c9,
		0x177ec,
		0x18ec4,
		0x191e1,
		0x1afab,
		0x1b08e,
		0x1cc1a,
		0x1d33f,
		0x1ed75,
		0x1f250,
		0x209d5,
		0x216f0,
		0x228ba,
		0x2379f,
		0x24b0b,
		0x2542e,
		0x26a64,
		0x27541,
		0x28c69,
	}
)
