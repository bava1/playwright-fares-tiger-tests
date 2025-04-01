export interface FileSystemError {
  message: string;
  code?: string;
  path?: string;
}

export interface FileSystemResult {
  success: boolean;
  error?: FileSystemError;
}

export interface DirectoryOptions {
  recursive?: boolean;
  force?: boolean;
}

export interface WriteFileOptions {
  encoding?: string;
  mode?: number;
  flag?: string;
} 