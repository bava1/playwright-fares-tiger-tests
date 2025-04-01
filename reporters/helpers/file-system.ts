import * as fs from 'fs';
import * as path from 'path';
import { FileSystemResult, DirectoryOptions, WriteFileOptions } from '../types/file-system.types';

/**
 * Создает директорию, если она не существует
 */
export const createDirectory = (dirPath: string, options: DirectoryOptions = {}): FileSystemResult => {
  try {
    fs.mkdirSync(dirPath, { recursive: options.recursive });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: (err as NodeJS.ErrnoException).code,
        path: dirPath
      }
    };
  }
};

/**
 * Удаляет файл, если он существует
 */
export const deleteFile = (filePath: string): FileSystemResult => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: (err as NodeJS.ErrnoException).code,
        path: filePath
      }
    };
  }
};

/**
 * Записывает данные в файл
 */
export const writeFile = (filePath: string, data: string, options: WriteFileOptions = {}): FileSystemResult => {
  try {
    // Создаем директорию для файла, если она не существует
    const dirPath = path.dirname(filePath);
    const dirResult = createDirectory(dirPath, { recursive: true });
    if (!dirResult.success) {
      return dirResult;
    }

    // Записываем файл
    fs.writeFileSync(filePath, data, {
      encoding: (options.encoding as BufferEncoding) || 'utf-8',
      mode: options.mode,
      flag: options.flag
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: (err as NodeJS.ErrnoException).code,
        path: filePath
      }
    };
  }
};

/**
 * Инициализирует директории для отчетов
 */
export const initializeReportDirectories = (): FileSystemResult[] => {
  const results: FileSystemResult[] = [];
  
  // Создаем директории для отчетов
  const dirs = [
    { path: 'reports', options: { recursive: true } },
    { path: 'test-results', options: { recursive: true } },
    { path: 'logs', options: { recursive: true } }
  ];

  for (const dir of dirs) {
    results.push(createDirectory(dir.path, dir.options));
  }

  return results;
}; 