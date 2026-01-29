'use client';

import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import { 
  getFileIcon, 
  formatFileSize, 
  truncateFileName,
  isImageFile,
  isPdfFile
} from '../utils';
import type { UploadedFile } from '../utils';

interface FilePreviewProps {
  files: UploadedFile[];
  onRemove: (fileId: string) => void;
  onUpload: (files: File[]) => void;
}

export const FilePreview = ({ files, onRemove, onUpload }: FilePreviewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [animatedFiles, setAnimatedFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Add animation class to new files
    const newFileIds = files.map(f => f.id).filter(id => !animatedFiles.has(id));
    
    if (newFileIds.length > 0) {
      // Trigger animation for new files
      const timer = setTimeout(() => {
        setAnimatedFiles(prev => new Set([...prev, ...newFileIds]));
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [files, animatedFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (fileId: string) => {
    // Remove from animated set
    setAnimatedFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
    onRemove(fileId);
  };

  if (files.length === 0) return null;

  return (
    <div className="mb-3 animate-in fade-in duration-300">
      <div className="flex items-start gap-2 flex-wrap">
      {files.map((uploadedFile, index) => {
        const { id, file, preview } = uploadedFile;
        const isAnimated = animatedFiles.has(id);

        return (
          <div
            key={id}
            className={`
              relative group w-[110px] h-[130px] bg-[#2a2a2a] rounded-md border border-gray-700 
              hover:border-gray-500 hover:shadow-lg hover:shadow-gray-900/50 hover:scale-105
              transition-all duration-300 ease-out overflow-hidden
              ${isAnimated ? 'animate-in fade-in zoom-in-95 slide-in-from-bottom-4' : 'opacity-0'}
            `}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'forwards'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => handleRemove(id)}
              className="absolute top-1 left-1 z-10 w-4 h-4 flex items-center justify-center 
                bg-gray-900/90 hover:bg-red-600 rounded-full 
                transition-all duration-200 
                opacity-0 group-hover:opacity-100 
                scale-90 group-hover:scale-100"
              aria-label="Remove file"
            >
              <Icon icon="mdi:close" className="w-3 h-3 text-white" />
            </button>

            {/* File preview */}
            <div className="w-full h-[90px] flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-110">
              {isImageFile(file) && preview ? (
                <img
                  src={preview}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain rounded transition-all duration-300"
                />
              ) : isPdfFile(file) ? (
                <div className="flex flex-col items-center justify-center transition-transform duration-300">
                  <div className="w-12 h-16 bg-gray-700/50 rounded flex items-center justify-center group-hover:bg-gray-600/50 transition-colors duration-300">
                    <span className="text-white font-semibold text-[10px]">PDF</span>
                  </div>
                </div>
              ) : (
                <Icon
                  icon={getFileIcon(file)}
                  className="w-10 h-10 transition-transform duration-300"
                />
              )}
            </div>

            {/* File info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800/95 p-1.5 border-t border-gray-700 
              group-hover:bg-gray-700/95 transition-colors duration-300">
              <p className="text-[9px] text-white font-medium truncate leading-tight transition-colors duration-300" title={file.name}>
                {truncateFileName(file.name, 12)}
              </p>
              <p className="text-[8px] text-gray-400 mt-0.5 transition-colors duration-300 group-hover:text-gray-300">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
        );
      })}
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

export default FilePreview;
