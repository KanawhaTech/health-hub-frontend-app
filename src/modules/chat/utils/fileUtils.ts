/**
 * File utility functions for file handling and formatting
 */

/**
 * Get the appropriate icon for a file based on its extension
 * @param file - The file object
 * @returns The icon identifier string
 */
export const getFileIcon = (file: File): string => {
  const extension = getFileExtension(file.name);
  
  switch (extension) {
    case 'pdf':
      return 'vscode-icons:file-type-pdf2';
    case 'doc':
    case 'docx':
      return 'vscode-icons:file-type-word';
    case 'xls':
    case 'xlsx':
      return 'vscode-icons:file-type-excel';
    case 'ppt':
    case 'pptx':
      return 'vscode-icons:file-type-powerpoint';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 'vscode-icons:file-type-image';
    case 'txt':
      return 'vscode-icons:file-type-text';
    case 'zip':
    case 'rar':
    case '7z':
      return 'vscode-icons:file-type-zip';
    case 'js':
    case 'jsx':
      return 'vscode-icons:file-type-js';
    case 'ts':
    case 'tsx':
      return 'vscode-icons:file-type-typescript';
    case 'json':
      return 'vscode-icons:file-type-json';
    case 'html':
      return 'vscode-icons:file-type-html';
    case 'css':
      return 'vscode-icons:file-type-css';
    case 'md':
      return 'vscode-icons:file-type-markdown';
    default:
      return 'vscode-icons:default-file';
  }
};

/**
 * Format bytes to human-readable file size
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  
  return `${size} ${sizes[i]}`;
};

/**
 * Truncate a filename to a specified length while preserving the extension
 * @param name - The filename
 * @param maxLength - Maximum length of the filename (default: 20)
 * @returns Truncated filename
 */
export const truncateFileName = (name: string, maxLength: number = 20): string => {
  if (name.length <= maxLength) return name;
  
  const extension = getFileExtension(name);
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
  const truncatedLength = maxLength - 3 - (extension?.length || 0);
  
  if (truncatedLength <= 0) {
    return `...${extension}`;
  }
  
  const truncated = nameWithoutExt.substring(0, truncatedLength);
  return `${truncated}...${extension}`;
};

/**
 * Get file extension from filename
 * @param filename - The filename
 * @returns Lowercase file extension without dot
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if a file is an image
 * @param file - The file object
 * @returns True if the file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Check if a file is a PDF
 * @param file - The file object
 * @returns True if the file is a PDF
 */
export const isPdfFile = (file: File): boolean => {
  return file.type === 'application/pdf';
};

/**
 * Generate a unique ID for a file
 * @returns Unique string ID
 */
export const generateFileId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Create a preview URL for an image file
 * @param file - The image file
 * @returns Promise with the preview URL
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('File is not an image'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Validate file size
 * @param file - The file object
 * @param maxSizeInMB - Maximum file size in megabytes
 * @returns True if file size is within limit
 */
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Validate file type
 * @param file - The file object
 * @param allowedTypes - Array of allowed MIME types or extensions
 * @returns True if file type is allowed
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const extension = getFileExtension(file.name);
  return allowedTypes.some(type => 
    type === file.type || type === `.${extension}` || type === extension
  );
};
