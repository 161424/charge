package server

import (
	"container/list"
	"fmt"
	"sync"
	"time"
)

const (
	// 时间轮的槽数（bucket数量），通常是一个2的幂，以便于位运算
	wheelSize = 1440 // 一天1440分钟
	// 每个槽的时间间隔，单位：毫秒
	tickDuration = time.Minute
)

// Timer 表示一个定时任务
type Timer struct {
	callback   func()
	expiry     int           //  circleTime的扩充，是实际运行时间（以tick为单位）
	isCircle   bool          //  循环类型 true循环
	circleTime time.Duration // 运行时间
	execTime   time.Duration // 循环时间
	desp       string        // 任务title
}

// TimingWheel 表示时间轮
type TimingWheel struct {
	sync.Mutex
	buckets []*list.List // 存储定时任务的槽
	cache   map[string]int
	current int           // 当前指针位置
	ticker  *time.Ticker  // 定时器，用于推动时间轮转动
	stop    chan struct{} // 停止信号

}

// NewTimingWheel 创建一个新的时间轮
func NewTimingWheel() *TimingWheel {
	tw := &TimingWheel{
		buckets: make([]*list.List, wheelSize),
		cache:   make(map[string]int, wheelSize),
		current: time.Now().Minute() + time.Now().Hour()*60,
		stop:    make(chan struct{}),
	}

	// 初始化槽
	for i := range tw.buckets {
		tw.buckets[i] = list.New()
	}

	// 启动定时器，推动时间轮转动
	tw.ticker = time.NewTicker(tickDuration)
	go tw.run()
	return tw
}

// Stop 停止时间轮
func (tw *TimingWheel) Stop() {
	close(tw.stop)
	tw.ticker.Stop()
}

// AddTimer 添加一个定时任务
// execType 0 表示将duration设置为绝对时间，当为1则设置为相对时间
func (tw *TimingWheel) AddTimer(duration, execTime time.Duration, isCircle bool, desp string, callback func()) {
	tw.Lock()
	defer tw.Unlock()
	var expiry, position int
	timer := &Timer{
		callback: callback, // 回调函数
		isCircle: isCircle, // 是否循环
		execTime: execTime, // 循环时间间隔
		desp:     desp,     // 函数文字描述
	}
	if _, ok := tw.cache[desp]; ok {
		expiry = int(duration / tickDuration)
	} else {
		tw.cache[desp] = tw.current
		ftimer := &Timer{
			callback: callback,
			desp:     desp,
			expiry:   tw.current,
		}
		tw.buckets[tw.current].PushBack(ftimer)
		tw.processTimersAtPosition(tw.current)
		expiry = int((duration + execTime) / tickDuration)
		if expiry < tw.current {
			d := int(duration.Minutes())
			e := int(execTime.Minutes())
			for i := 0; i < wheelSize; i++ {
				if d+e*i >= tw.current {
					expiry = d + e*i
					break
				}
			}
		}
	}
	if expiry > wheelSize {
		expiry -= wheelSize
	}
	position = expiry % wheelSize
	// 将定时任务添加到对应槽的末尾
	timer.expiry = expiry //   函数执行所在的格子
	timer.isCircle = isCircle
	timer.circleTime = duration % (24 * time.Hour) //
	fmt.Printf("任务[%s]已经添加到格子%d，可能在%d:%d执行\n", desp, position, position/60, position%60)
	tw.buckets[position].PushBack(timer)
	// 如果任务即将到期（在当前槽或下一个槽），则立即处理，否则等待时间轮转动到该槽

}

// run 推动时间轮转动
func (tw *TimingWheel) run() {
	for {
		select {
		case <-tw.ticker.C:
			tw.current = (tw.current + 1) % wheelSize
			tw.processTimersAtPosition(tw.current)
		case <-tw.stop:
			return
		}
	}
}

// processTimersAtPosition 处理指定位置的定时任务
func (tw *TimingWheel) processTimersAtPosition(position int) {
	lens := tw.buckets[position].Len()
	if lens != 0 {
		fmt.Printf("正在运行第%d个格子的任务\n", position)
	}
	if position == 0 {
		fmt.Printf("欢迎来到%s，又是充满希望的一天\n", time.Now().Format("2006-01-02"))
	}
	//fmt.Println(tw.buckets[position].Len())
	for e := tw.buckets[position].Front(); lens > 0 && e != nil; { // time.Now().Minute()+time.Now().Hour()*60 == position
		timer := e.Value.(*Timer)
		//fmt.Println(timer.desp, time.Now().Minute()+time.Now().Hour()*60+1, timer.expiry)
		if position == timer.expiry {
			go timer.callback() // 在新goroutine中执行回调，以避免阻塞时间轮
			next := e.Next()
			tw.buckets[position].Remove(e) // 从头部删除
			fmt.Printf("现在是 %s，当前正在执行任务【%s】", time.Now().Format(time.DateTime), timer.desp)
			if timer.isCircle { // 24小时一循环
				tw.AddTimer(timer.circleTime+timer.execTime, timer.execTime, timer.isCircle, timer.desp, timer.callback)
			}
			e = next

		} else {
			timer.expiry -= wheelSize
			continue // 如果当前时间还没到该任务的到期时间，后续的任务都需要减去wheelSize
		}
		lens--
	}
}
