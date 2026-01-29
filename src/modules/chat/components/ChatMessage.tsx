'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';

interface ChatMessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

export const ChatMessage = ({ id, role, content, timestamp, isLoading }: ChatMessageProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLike = () => {
    console.log('Like message:', id);
  };

  const handleDislike = () => {
    console.log('Dislike message:', id);
  };

  const handleRegenerate = () => {
    console.log('Regenerate message:', id);
  };

  if (role === 'user') {
    return (
      <div className="mb-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-xs text-white font-medium">U</span>
          </div>
          
          {/* User Message */}
          <div className="flex-1">
            <p className="text-white text-sm font-normal leading-relaxed">{content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-start gap-3">
        {/* Assistant Avatar */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
          <Icon icon="mdi:robot" className="w-4 h-4 text-white" />
        </div>
        
        {/* Assistant Message */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          ) : (
            <>
              <p className="text-white text-sm font-normal leading-relaxed mb-2 whitespace-pre-wrap">
                {content}
              </p>
              
              {/* Action buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-gray-800 transition-colors"
                  title={isCopied ? 'Copied!' : 'Copy'}
                >
                  <Icon 
                    icon={isCopied ? 'mdi:check' : 'mdi:content-copy'} 
                    className={`w-4 h-4 ${isCopied ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
                  />
                </button>
                
                <button
                  onClick={handleLike}
                  className="p-1.5 rounded hover:bg-gray-800 transition-colors"
                  title="Good response"
                >
                  <Icon icon="mdi:thumb-up-outline" className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
                
                <button
                  onClick={handleDislike}
                  className="p-1.5 rounded hover:bg-gray-800 transition-colors"
                  title="Bad response"
                >
                  <Icon icon="mdi:thumb-down-outline" className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
                
                <button
                  onClick={handleRegenerate}
                  className="p-1.5 rounded hover:bg-gray-800 transition-colors"
                  title="Regenerate"
                >
                  <Icon icon="mdi:refresh" className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
