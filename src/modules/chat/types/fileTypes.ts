/**
 * Type definitions for file handling
 */

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

export interface FileUploadConfig {
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  maxFiles?: number;
  multiple?: boolean;
}

export interface FileValidationError {
  file: File;
  error: string;
}

export interface FileUploadResult {
  success: UploadedFile[];
  errors: FileValidationError[];
}
