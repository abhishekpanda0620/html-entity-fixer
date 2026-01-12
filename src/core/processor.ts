/**
 * File processing logic for html-fixer
 */

import { readFile, writeFile } from 'fs/promises';
import { globby } from 'globby';
import { escapeHtml, EscapeResult } from './escaper.js';
import { EscapeMode } from './entities.js';

export interface ProcessOptions {
  /** Escaping mode */
  mode: EscapeMode;
  /** If true, don't modify files, just report what would change */
  dryRun: boolean;
  /** File encoding */
  encoding?: BufferEncoding;
  /** Current working directory for glob patterns */
  cwd?: string;
}

export interface FileResult {
  /** Absolute path to the file */
  filePath: string;
  /** Whether the file was processed successfully */
  success: boolean;
  /** Escape result if successful */
  result?: EscapeResult;
  /** Error message if failed */
  error?: string;
}

export interface ProcessSummary {
  /** Total files processed */
  totalFiles: number;
  /** Files that had changes */
  filesWithChanges: number;
  /** Total entities escaped */
  totalEntitiesEscaped: number;
  /** Files that failed to process */
  failedFiles: number;
  /** Individual file results */
  files: FileResult[];
}

/**
 * Process a single file
 */
export async function processFile(filePath: string, options: ProcessOptions): Promise<FileResult> {
  const encoding = options.encoding ?? 'utf-8';

  try {
    const content = await readFile(filePath, { encoding });
    const result = escapeHtml(content, options.mode);

    if (result.hasChanges && !options.dryRun) {
      await writeFile(filePath, result.content, { encoding });
    }

    return {
      filePath,
      success: true,
      result,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return {
      filePath,
      success: false,
      error,
    };
  }
}

/**
 * Process multiple files matching glob patterns
 */
export async function processFiles(
  patterns: string[],
  options: ProcessOptions
): Promise<ProcessSummary> {
  // Expand glob patterns to file paths
  const filePaths = await globby(patterns, {
    absolute: true,
    onlyFiles: true,
    gitignore: false, // Disable gitignore for external paths
    cwd: options.cwd,
  });

  const results: FileResult[] = [];

  for (const filePath of filePaths) {
    const result = await processFile(filePath, options);
    results.push(result);
  }

  // Calculate summary
  const summary: ProcessSummary = {
    totalFiles: results.length,
    filesWithChanges: results.filter((r) => r.result?.hasChanges).length,
    totalEntitiesEscaped: results.reduce((sum, r) => sum + (r.result?.escapedCount ?? 0), 0),
    failedFiles: results.filter((r) => !r.success).length,
    files: results,
  };

  return summary;
}
