'use client';

import { Icon } from '@iconify/react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';
import { useChatStore } from '@/modules/chat/stores';
import { useChatMutation } from '@/modules/chat/services';

export const ChatContainer = () => {
  const message = useChatStore((state) => state.message);
  const messages = useChatStore((state) => state.messages);
  const showReasoning = useChatStore((state) => state.showReasoning);
  const stopReasoning = useChatStore((state) => state.stopReasoning);
  const setMessage = useChatStore((state) => state.setMessage);
  const addMessage = useChatStore((state) => state.addMessage);
  const setShowReasoning = useChatStore((state) => state.setShowReasoning);
  const sessionId = useChatStore((state) => state.sessionId);
  const userId = useChatStore((state) => state.userId);
  const clearMessages = useChatStore((state) => state.clearMessages);

  const { mutate: sendChatQuery, isPending } = useChatMutation(sessionId);

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to delete the entire chat?')) {
      clearMessages();
      setShowReasoning(false);
    }
  };

  const handleSendMessage = (files?: File[]) => {
    if (!message.trim()) return;

    // Add user message
    addMessage({
      role: 'user',
      content: message.trim(),
    });

    // Prepare FormData
    const formData = new FormData();
    formData.append('question', message.trim());
    formData.append('sessionId', sessionId);
    formData.append('userId', userId);

    // Add files only if they exist
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }

    // Clear input
    setMessage('');

    // Show reasoning
    setShowReasoning(true);

    // Send query to API
    sendChatQuery(formData, {
      onSuccess: (response: any) => {
        setShowReasoning(false);
        addMessage({
          role: 'assistant',
          content: response.answer || 'Something went wrong',
        });
      },
      onError: (error: Error) => {
        setShowReasoning(false);
        addMessage({
          role: 'assistant',
          content: `Error: ${error.message || 'Error processing request'}`,
        });
      },
    });
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header with clear chat button - Only shown when there are messages */}
      {hasMessages && (
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-white text-lg font-semibold">Health Hub Chat</h1>
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Icon icon="mdi:delete-outline" className="w-5 h-5" />
            <span className="text-sm">Clear chat</span>
          </button>
        </div>
      )}

      {/* Chat Messages Area - Only shown when there are messages */}
      {hasMessages && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <ChatMessageList 
            messages={messages} 
            isLoading={showReasoning}
          />
        </div>
      )}

      {/* Input Area - Centered when no messages, at bottom when there are messages */}
      <div className={hasMessages ? 'px-6 pb-8' : 'flex-1 flex items-center justify-center px-6'}>
        <div className="w-full max-w-xl mx-auto">
          {/* Input Container - Reasoning always inside the same container */}
          <div className="w-full bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {showReasoning && (
              <ChatHeader isReasoning={showReasoning} onStop={stopReasoning} />
            )}
            
            <div className="bg-gray-900 px-6 py-5">
              <ChatInput
                value={message}
                onChange={setMessage}
                onSend={handleSendMessage}
                isLoading={isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ChatContainer;