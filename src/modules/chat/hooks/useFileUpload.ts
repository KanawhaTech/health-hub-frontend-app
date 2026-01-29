import { useState, useRef, useCallback } from 'react';
import { generateFileId, createImagePreview, isImageFile } from '../utils';
import type { UploadedFile } from '../utils';

export interface UseFileUploadOptions {
  onUpload?: (files: UploadedFile[]) => void;
  onRemove?: (fileId: string) => void;
  maxFiles?: number;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const { onUpload, onRemove, maxFiles } = options;
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (files: File[]) => {
    // Check max files limit
    if (maxFiles && uploadedFiles.length + files.length > maxFiles) {
      console.warn(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: UploadedFile[] = await Promise.all(
      files.map(async (file) => {
        const uploadedFile: UploadedFile = {
          id: generateFileId(),
          file,
        };

        // Create preview for images
        if (isImageFile(file)) {
          try {
            uploadedFile.preview = await createImagePreview(file);
          } catch (error) {
            console.error('Failed to create image preview:', error);
          }
        }

        return uploadedFile;
      })
    );

    setUploadedFiles((prev) => {
      const updated = [...prev, ...newFiles];
      onUpload?.(updated);
      return updated;
    });
  }, [uploadedFiles.length, maxFiles, onUpload]);

  const handleFileRemove = useCallback((fileId: string) => {
    setUploadedFiles((prev) => {
      // Revoke preview URL to free memory
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      const updated = prev.filter((f) => f.id !== fileId);
      onRemove?.(fileId);
      return updated;
    });
  }, [onRemove]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      handleFileUpload(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileUpload]);

  const clearFiles = useCallback(() => {
    // Revoke all preview URLs to free memory
    uploadedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setUploadedFiles([]);
  }, [uploadedFiles]);

  const removeAllFiles = useCallback(() => {
    // Revoke all preview URLs before clearing
    uploadedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      onRemove?.(file.id);
    });
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setUploadedFiles([]);
  }, [uploadedFiles, onRemove]);

  return {
    uploadedFiles,
    fileInputRef,
    handleFileUpload,
    handleFileRemove,
    handleUploadClick,
    handleFileSelect,
    clearFiles,
    removeAllFiles,
  };
};
