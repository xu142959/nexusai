import { describe, it, expect, beforeEach } from 'vitest'
import { useChatStore } from '../store/chatStore'

describe('useChatStore', () => {
  beforeEach(() => {
    useChatStore.getState().clearAll()
    localStorage.clear()
  })

  it('creates a new conversation', () => {
    const id = useChatStore.getState().createConversation('test-model')
    const state = useChatStore.getState()
    expect(state.conversations).toHaveLength(1)
    expect(state.activeId).toBe(id)
    expect(state.conversations[0].model).toBe('test-model')
  })

  it('deletes a conversation', () => {
    const id1 = useChatStore.getState().createConversation()
    const id2 = useChatStore.getState().createConversation()
    useChatStore.getState().deleteConversation(id1)
    const state = useChatStore.getState()
    expect(state.conversations).toHaveLength(1)
    expect(state.conversations[0].id).toBe(id2)
  })

  it('adds a message to conversation', () => {
    const id = useChatStore.getState().createConversation()
    useChatStore.getState().addMessage(id, {
      role: 'user',
      content: 'Hello',
    })
    const conv = useChatStore.getState().conversations.find(c => c.id === id)
    expect(conv?.messages).toHaveLength(1)
    expect(conv?.messages[0].content).toBe('Hello')
    expect(conv?.messages[0].role).toBe('user')
  })

  it('updates a message', () => {
    const id = useChatStore.getState().createConversation()
    useChatStore.getState().addMessage(id, { role: 'assistant', content: 'Hi' })
    const msgId = useChatStore.getState().conversations[0].messages[0].id
    useChatStore.getState().updateMessage(id, msgId, 'Hello there!')
    const conv = useChatStore.getState().conversations.find(c => c.id === id)
    expect(conv?.messages[0].content).toBe('Hello there!')
  })

  it('sets conversation title from first user message', () => {
    const id = useChatStore.getState().createConversation()
    useChatStore.getState().addMessage(id, {
      role: 'user',
      content: 'This is a test message for title',
    })
    const conv = useChatStore.getState().conversations.find(c => c.id === id)
    expect(conv?.title).toBe('This is a test message for tit')
  })

  it('updates conversation settings', () => {
    const id = useChatStore.getState().createConversation()
    useChatStore.getState().updateConversation(id, {
      temperature: 0.5,
      systemPrompt: 'You are helpful',
    })
    const conv = useChatStore.getState().conversations.find(c => c.id === id)
    expect(conv?.temperature).toBe(0.5)
    expect(conv?.systemPrompt).toBe('You are helpful')
  })

  it('clears all conversations', () => {
    useChatStore.getState().createConversation()
    useChatStore.getState().createConversation()
    useChatStore.getState().clearAll()
    expect(useChatStore.getState().conversations).toHaveLength(0)
    expect(useChatStore.getState().activeId).toBeNull()
  })
})
