'use client';

import { Icon } from '@iconify/react';
import { FilePreview } from './FilePreview';
import { useFileUpload } from '../hooks';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (files?: File[]) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ value, onChange, onSend, isLoading = false }: ChatInputProps) => {
  const {
    uploadedFiles,
    fileInputRef,
    handleFileUpload,
    handleFileRemove,
    handleUploadClick,
    handleFileSelect,
    clearFiles,
  } = useFileUpload();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      const files = uploadedFiles.map(uf => uf.file);
      onSend(files);
      clearFiles(); // Clear files after sending
    }
  };

  const handleSendClick = () => {
    if (isLoading) return;
    const files = uploadedFiles.map(uf => uf.file);
    onSend(files);
    clearFiles(); // Clear files after sending
  };

  return (
    <div className="space-y-4">
      {/* File Preview */}
      <FilePreview
        files={uploadedFiles}
        onRemove={handleFileRemove}
        onUpload={handleFileUpload}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What does this code do?"
        className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-lg mb-3"
        disabled={isLoading}
      />
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleUploadClick}
            className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <Icon icon="codex:file" className="w-5 h-5" />
          </button>
        </div>
        
        <button
          onClick={handleSendClick}
          disabled={isLoading || !value.trim()}
          className={`cursor-pointer ml-auto w-10 h-10 flex items-center justify-center rounded-full transition-colors shadow-lg flex-shrink-0 ${
            isLoading || !value.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          {isLoading ? (
            <Icon icon="mdi:loading" className="w-5 h-5 text-gray-900 animate-spin" />
          ) : (
            <Icon icon="mdi:arrow-up" className="w-5 h-5 text-gray-900" />
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
    </div>
  );
};

export default ChatInput;
