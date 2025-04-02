import * as fs from 'fs';
import * as path from 'path';
import { FileSystemResult, DirectoryOptions, WriteFileOptions } from '../types/file-system.types';
import { REPORTS_DIR, SCREENSHOTS_DIR } from '../config/paths';

/**
 * Creates a directory if it doesn't exist
 * @param path Directory path
 * @returns Result of the operation
 */
export function createDirectory(path: string): { success: boolean; error?: string } {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Deletes a file if it exists
 * @param path File path
 * @returns Result of the operation
 */
export function deleteFile(path: string): { success: boolean; error?: string } {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Writes data to a file
 * @param path File path
 * @param data Data to write
 * @returns Result of the operation
 */
export function writeFile(path: string, data: string): { success: boolean; error?: string } {
  try {
    // Create directory for the file if it doesn't exist
    const dir = path.substring(0, path.lastIndexOf('/'));
    if (dir) {
      createDirectory(dir);
    }
    fs.writeFileSync(path, data, 'utf8');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Initializes report directories
 * @returns Array of results for each directory creation
 */
export function initializeReportDirectories(): Array<{ success: boolean; error?: string }> {
  const dirs = [
    { path: REPORTS_DIR },
    { path: path.join(REPORTS_DIR, 'report') },
    { path: SCREENSHOTS_DIR }
  ];

  const results = [];
  for (const dir of dirs) {
    results.push(createDirectory(dir.path));
  }

  return results;
} 