import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { nanoid } from 'nanoid'

// Debounced storage: zustand persist fires write on every state change.
// During SSE streaming, that means hundreds of synchronous JSON.stringify +
// localStorage.setItem per response — which blocks the main thread for tens
// to hundreds of milliseconds per chunk and is the main cause of the user-
// facing freeze, especially on the chat page.
const debouncedStorage = createJSONStorage(() => ({
  getItem: (name) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    // Defer the write to next idle tick; coalesce multiple writes in the same
    // tick into one localStorage.setItem call.
    scheduleWrite(name, value)
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {}
  },
}))

const pendingWrites = new Map<string, string>()
let writeHandle = 0
function scheduleWrite(name: string, value: string) {
  pendingWrites.set(name, value)
  if (writeHandle) return
  writeHandle = (typeof window !== 'undefined'
    ? window.setTimeout
    : setTimeout)(() => {
    writeHandle = 0
    for (const [k, v] of pendingWrites) {
      try {
        localStorage.setItem(k, v)
      } catch {}
    }
    pendingWrites.clear()
  }, 500) as unknown as number
}

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
  updateConversation: (convId: string, patch: Partial<ChatConversation>) => void
  clearAll: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
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
      storage: debouncedStorage,
      partialize: (state) => ({
        conversations: state.conversations,
        activeId: state.activeId,
      }),
    }
  )
)
