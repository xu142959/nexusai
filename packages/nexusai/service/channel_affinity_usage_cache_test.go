package service

import (
	"fmt"
	"net/http/httptest"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/relaykit/dto"
	"github.com/QuantumNous/new-api/relaykit/types"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

// usageCacheTestKeySeq guarantees a process-unique suffix for cache keys:
// on Windows time.Now().UnixNano() shares a coarse clock tick (~15.6ms), so
// repeated test rounds can collide and leak stats into the next round.
var usageCacheTestKeySeq atomic.Uint64

// usageCacheTestKey builds a collision-free rule/key fingerprint pair.
func usageCacheTestKey(t *testing.T) (string, string) {
	t.Helper()
	seq := usageCacheTestKeySeq.Add(1)
	ruleName := fmt.Sprintf("rule_%s_%d_%d", t.Name(), seq, time.Now().UnixNano())
	keyFP := fmt.Sprintf("fp_%s_%d_%d", t.Name(), seq, time.Now().UnixNano())
	return ruleName, keyFP
}

// channelAffinityUsageCacheTestMu serializes these tests against other tests
// in the same package that mutate the global RedisEnabled/RDB state
// (e.g. useIndependentAuthSessionRedis in auth_session_test.go). The
// HybridCache used by the channel-affinity usage cache switches between
// Redis and memory based on that global state; without serialization, a
// parallel flip can make an in-memory write invisible to the reader and
// produce flaky assertions.
var channelAffinityUsageCacheTestMu sync.Mutex

// isolateUsageCacheRedis pins Redis to disabled for the duration of the test
// so these assertions deterministically exercise the in-memory cache.
// HybridCache's redisOn() requires redis != nil AND RedisEnabled, so flipping
// only RedisEnabled is sufficient; RDB must not be touched because other
// tests in the package run in parallel and depend on it.
func isolateUsageCacheRedis(t *testing.T) {
	t.Helper()
	previousRedisEnabled := common.RedisEnabled
	common.RedisEnabled = false
	t.Cleanup(func() {
		common.RedisEnabled = previousRedisEnabled
	})
}

func buildChannelAffinityStatsContextForTest(ruleName, usingGroup, keyFP string) *gin.Context {
	rec := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(rec)
	setChannelAffinityContext(ctx, channelAffinityMeta{
		CacheKey:       fmt.Sprintf("test:%s:%s:%s", ruleName, usingGroup, keyFP),
		TTLSeconds:     600,
		RuleName:       ruleName,
		UsingGroup:     usingGroup,
		KeyFingerprint: keyFP,
	})
	return ctx
}

func TestObserveChannelAffinityUsageCacheByRelayFormat_ClaudeMode(t *testing.T) {
	channelAffinityUsageCacheTestMu.Lock()
	defer channelAffinityUsageCacheTestMu.Unlock()
	isolateUsageCacheRedis(t)
	ruleName, keyFP := usageCacheTestKey(t)
	usingGroup := "default"
	ctx := buildChannelAffinityStatsContextForTest(ruleName, usingGroup, keyFP)

	usage := &dto.Usage{
		PromptTokens:     100,
		CompletionTokens: 40,
		TotalTokens:      140,
		PromptTokensDetails: dto.InputTokenDetails{
			CachedTokens: 30,
		},
	}

	ObserveChannelAffinityUsageCacheByRelayFormat(ctx, usage, types.RelayFormatClaude)
	stats := GetChannelAffinityUsageCacheStats(ruleName, usingGroup, keyFP)

	require.EqualValues(t, 1, stats.Total)
	require.EqualValues(t, 1, stats.Hit)
	require.EqualValues(t, 100, stats.PromptTokens)
	require.EqualValues(t, 40, stats.CompletionTokens)
	require.EqualValues(t, 140, stats.TotalTokens)
	require.EqualValues(t, 30, stats.CachedTokens)
	require.Equal(t, cacheTokenRateModeCachedOverPromptPlusCached, stats.CachedTokenRateMode)
}

func TestObserveChannelAffinityUsageCacheByRelayFormat_MixedMode(t *testing.T) {
	channelAffinityUsageCacheTestMu.Lock()
	defer channelAffinityUsageCacheTestMu.Unlock()
	isolateUsageCacheRedis(t)
	ruleName, keyFP := usageCacheTestKey(t)
	usingGroup := "default"
	ctx := buildChannelAffinityStatsContextForTest(ruleName, usingGroup, keyFP)

	openAIUsage := &dto.Usage{
		PromptTokens: 100,
		PromptTokensDetails: dto.InputTokenDetails{
			CachedTokens: 10,
		},
	}
	claudeUsage := &dto.Usage{
		PromptTokens: 80,
		PromptTokensDetails: dto.InputTokenDetails{
			CachedTokens: 20,
		},
	}

	ObserveChannelAffinityUsageCacheByRelayFormat(ctx, openAIUsage, types.RelayFormatOpenAI)
	ObserveChannelAffinityUsageCacheByRelayFormat(ctx, claudeUsage, types.RelayFormatClaude)
	stats := GetChannelAffinityUsageCacheStats(ruleName, usingGroup, keyFP)

	require.EqualValues(t, 2, stats.Total)
	require.EqualValues(t, 2, stats.Hit)
	require.EqualValues(t, 180, stats.PromptTokens)
	require.EqualValues(t, 30, stats.CachedTokens)
	require.Equal(t, cacheTokenRateModeMixed, stats.CachedTokenRateMode)
}

func TestObserveChannelAffinityUsageCacheByRelayFormat_UnsupportedModeKeepsEmpty(t *testing.T) {
	channelAffinityUsageCacheTestMu.Lock()
	defer channelAffinityUsageCacheTestMu.Unlock()
	isolateUsageCacheRedis(t)
	ruleName, keyFP := usageCacheTestKey(t)
	usingGroup := "default"
	ctx := buildChannelAffinityStatsContextForTest(ruleName, usingGroup, keyFP)

	usage := &dto.Usage{
		PromptTokens: 100,
		PromptTokensDetails: dto.InputTokenDetails{
			CachedTokens: 25,
		},
	}

	ObserveChannelAffinityUsageCacheByRelayFormat(ctx, usage, types.RelayFormatGemini)
	stats := GetChannelAffinityUsageCacheStats(ruleName, usingGroup, keyFP)

	require.EqualValues(t, 1, stats.Total)
	require.EqualValues(t, 1, stats.Hit)
	require.EqualValues(t, 25, stats.CachedTokens)
	require.Equal(t, "", stats.CachedTokenRateMode)
}
