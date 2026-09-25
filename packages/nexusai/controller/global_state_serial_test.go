package controller

import (
	"sync"
	"testing"
)

// 全局共享状态串行化：
//
// controller 包大量测试会把全局 model.DB / model.LOG_DB / common.RedisEnabled /
// common.IsMasterNode 等替换为自己的临时实例。并行测试同时替换全局 DB 会
// 导致 "SQL logic error: no such table: tsubmit_xxx_users" 之类的连锁失败。
//
// lockControllerGlobalState(t) 提供“按测试可重入”的互斥：
//   - 同一测试（含其 setup helper 链）内多次调用只加一次锁，不会死锁；
//   - 不同测试之间通过包级互斥串行执行。
//
// 用法：在会修改全局状态的测试函数或 setup helper 入口调用一次：
//
//	lockControllerGlobalState(t)
var (
	controllerGlobalStateMu    sync.Mutex // 保护 lockHolder 集合
	controllerGlobalStateHold  = map[string]bool{}
	controllerGlobalStateSerial sync.Mutex // 跨测试的真正互斥
)

func lockControllerGlobalState(t *testing.T) {
	t.Helper()
	controllerGlobalStateMu.Lock()
	if controllerGlobalStateHold[t.Name()] {
		// 本测试已在锁内（嵌套 setup 调用），直接放行，避免重入死锁
		controllerGlobalStateMu.Unlock()
		return
	}
	controllerGlobalStateHold[t.Name()] = true
	controllerGlobalStateMu.Unlock()

	controllerGlobalStateSerial.Lock()
	t.Cleanup(func() {
		controllerGlobalStateSerial.Unlock()
		controllerGlobalStateMu.Lock()
		delete(controllerGlobalStateHold, t.Name())
		controllerGlobalStateMu.Unlock()
	})
}
