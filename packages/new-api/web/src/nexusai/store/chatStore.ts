import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  model: string
  systemPrompt: string
  temperature: number
  maxTokens: number
  createdAt: number
  updatedAt: number
}

interface ChatState {
  conversations: ChatConversation[]
  activeId: string | null
  // actions
  createConversation: (model?: string) => string
  deleteConversation: (id: string) => void
  setActive: (id: string) => void
  addMessage: (convId: string, msg: Omit<ChatMessage, 'id' | 'createdAt'>) => void
  updateMessage: (convId: string, msgId: string, content: string) => void
  deleteMessage: (convId: string, msgId: string) => void
  updateConversation: (convId: string, patch: Partial<ChatConversation>) => void
  clearAll: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId: null,

      createConversation: (model?: string) => {
        const id = nanoid()
        const conv: ChatConversation = {
          id,
          title: '新对话',
          messages: [],
          model: model || '',
          systemPrompt: '',
          temperature: 0.7,
          maxTokens: 4096,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set(state => ({
          conversations: [conv, ...state.conversations],
          activeId: id,
        }))
        return id
      },

      deleteConversation: (id: string) => {
        set(state => {
          const conversations = state.conversations.filter(c => c.id !== id)
          const activeId = state.activeId === id
            ? conversations[0]?.id || null
            : state.activeId
          return { conversations, activeId }
        })
      },

      setActive: (id: string) => set({ activeId: id }),

      addMessage: (convId, msg) => {
        set(state => ({
          conversations: state.conversations.map(c => {
            if (c.id !== convId) return c
            const message: ChatMessage = {
              ...msg,
              id: nanoid(),
              createdAt: Date.now(),
            }
            const title = c.messages.length === 0 && msg.role === 'user'
              ? msg.content.slice(0, 30)
              : c.title
            return {
              ...c,
              messages: [...c.messages, message],
              title,
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      updateMessage: (convId, msgId, content) => {
        set(state => ({
          conversations: state.conversations.map(c => {
            if (c.id !== convId) return c
            return {
              ...c,
              messages: c.messages.map(m =>
                m.id === msgId ? { ...m, content } : m
              ),
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      updateConversation: (convId, patch) => {
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === convId ? { ...c, ...patch, updatedAt: Date.now() } : c
          ),
        }))
      },

      clearAll: () => set({ conversations: [], activeId: null }),
    }),
    {
      name: 'nexusai-chat',
    }
  )
)
