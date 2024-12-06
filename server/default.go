package server

import (
	"container/list"
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
	callback func()
	expiry   int64 // 到期时间（以tick为单位）
	circle   bool
}

// TimingWheel 表示时间轮
type TimingWheel struct {
	sync.Mutex
	buckets []*list.List  // 存储定时任务的槽
	current int           // 当前指针位置
	ticker  *time.Ticker  // 定时器，用于推动时间轮转动
	stop    chan struct{} // 停止信号
}

// NewTimingWheel 创建一个新的时间轮
func NewTimingWheel() *TimingWheel {
	tw := &TimingWheel{
		buckets: make([]*list.List, wheelSize),
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
func (tw *TimingWheel) AddTimer(duration time.Duration, circle bool, callback func()) {
	tw.Lock()
	defer tw.Unlock()

	// 计算到期时间（以tick为单位）
	expiry := (time.Now().UnixMilli() / int64(tickDuration)) + int64(duration/tickDuration)
	position := expiry % wheelSize
	ticksUntilExpiry := int(expiry/wheelSize) - (tw.current / wheelSize)
	if ticksUntilExpiry < 0 {
		ticksUntilExpiry += wheelSize
	}

	timer := &Timer{
		callback: callback,
		expiry:   expiry,
		circle:   circle,
	}

	// 将定时任务添加到对应槽的末尾
	tw.buckets[position].PushBack(timer)

	// 如果任务即将到期（在当前槽或下一个槽），则立即处理，否则等待时间轮转动到该槽
	//if ticksUntilExpiry <= 1 {
	//	go tw.processTimersAtPosition(position)
	//}
}

// run 推动时间轮转动
func (tw *TimingWheel) run() {
	for {
		select {
		case <-tw.ticker.C:
			tw.Lock()
			tw.current = (tw.current + 1) % wheelSize
			tw.processTimersAtPosition(tw.current)
			tw.Unlock()
		case <-tw.stop:
			return
		}
	}
}

// processTimersAtPosition 处理指定位置的定时任务
func (tw *TimingWheel) processTimersAtPosition(position int) {
	for e := tw.buckets[position].Front(); e != nil; {
		timer := e.Value.(*Timer)
		if time.Now().UnixNano()/int64(tickDuration) >= timer.expiry {
			go timer.callback() // 在新goroutine中执行回调，以避免阻塞时间轮
			next := e.Next()
			if timer.circle {
				tw.AddTimer(time.Duration(timer.expiry), timer.circle, timer.callback)
			} else {
				tw.buckets[position].Remove(e)
			}
			e = next
		} else {
			break // 如果当前时间还没到该任务的到期时间，则停止处理该槽的其他任务（因为它们是按序添加的）
		}
	}
}
