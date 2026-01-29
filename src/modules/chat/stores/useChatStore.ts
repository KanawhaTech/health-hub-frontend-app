import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatState {
  // State
  message: string;
  showReasoning: boolean;
  messages: ChatMessage[];
  sessionId: string;
  userId: string;
  uploadedFiles: File[];
  
  // Actions
  setMessage: (message: string) => void;
  setShowReasoning: (show: boolean) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  sendMessage: (files?: File[]) => Promise<void>;
  stopReasoning: () => void;
  clearMessages: () => void;
  setUploadedFiles: (files: File[]) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      message: '',
      showReasoning: false,
      messages: [],
      sessionId: crypto.randomUUID(), // Generate unique sessionId
      userId: 'user-default', // Change according to your auth system
      uploadedFiles: [],
      
      // Actions
      setMessage: (message) => set({ message }),
      
      setShowReasoning: (show) => set({ showReasoning: show }),
      
      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },
      
      sendMessage: async (files?: File[]) => {
        const { message, addMessage, setMessage, setShowReasoning, sessionId, userId } = get();
        
        if (message.trim()) {
          // Add user message
          addMessage({
            role: 'user',
            content: message.trim(),
          });
          
          // Clear input
          setMessage('');
          
          // Show Reasoning header
          setShowReasoning(true);
          
          // Note: Mutation must be called from the component
          // This method only prepares the state
        }
      },
      
      stopReasoning: () => {
        set({ showReasoning: false });
      },
      
      clearMessages: () => {
        set({ 
          messages: [],
          sessionId: crypto.randomUUID(), // Generate new sessionId for new chat
        });
      },
      
      setUploadedFiles: (files) => set({ uploadedFiles: files }),
    }),
    {
      name: 'chat-storage', // localStorage name
      partialize: (state) => ({
        messages: state.messages,
        sessionId: state.sessionId, // Persist sessionId
      }),
    }
  )
);
