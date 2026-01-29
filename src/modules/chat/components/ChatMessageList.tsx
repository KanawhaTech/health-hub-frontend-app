'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '../stores/useChatStore';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
}

export const ChatMessageList = ({ messages, isLoading }: ChatMessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto py-4 scroll-smooth bg-gray-950 px-6"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#4B5563 transparent',
      }}
    >
      {/* Messages - Alineado con el ancho del input */}
      <div className="max-w-xl mx-auto">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <ChatMessage
              id={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="group">
            <ChatMessage
              id="loading"
              role="assistant"
              content=""
              timestamp={Date.now()}
              isLoading={true}
            />
          </div>
        )}
      </div>

      {/* Auto-scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessageList;
