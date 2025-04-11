import * as fs from 'fs';
import * as path from 'path';
import { LOGS_DIR } from '../config/paths';

/**
 * Creates a directory if it doesn't exist
 * Supports recursive directory creation
 * @param dirPath - Path to the directory
 * @returns Result of the operation
 */
export function createDirectory(dirPath: string): { success: boolean; error?: string } {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // Create all necessary directories
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
 * Writes data to a file, creating the directory if necessary
 * @param filePath - Full path to the file
 * @param data - String data to write into the file
 * @returns Result of the operation
 */
export function writeFile(filePath: string, data: string): { success: boolean; error?: string } {
  try {
    const dir = path.dirname(filePath); // Get directory part of the file path
    createDirectory(dir);               // Ensure directory exists

    fs.writeFileSync(filePath, data, 'utf8'); // Write file content
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
    { path: path.dirname(LOGS_DIR) }  // Create logs directory
  ];

  const results = [];
  for (const dir of dirs) {
    results.push(createDirectory(dir.path));
  }

  return results;
} 