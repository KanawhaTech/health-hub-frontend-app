import { Icon } from '@iconify/react';

interface ChatHeaderProps {
  isReasoning: boolean;
  onStop: () => void;
}

export const ChatHeader = ({ isReasoning, onStop }: ChatHeaderProps) => {
  return (
    <div className="bg-gray-700/90 px-5 py-3 flex items-center justify-between border-b border-gray-600/50">
      <div className="flex items-center gap-2.5">
        <Icon icon="mdi:atom" className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-medium">
          Reasoning...
        </span>
      </div>
      
      <button
        onClick={onStop}
        className="px-4 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-md transition-colors"
      >
        Stop
      </button>
    </div>
  );
};

export default ChatHeader;