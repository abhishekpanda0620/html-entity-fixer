#!/usr/bin/env node
/**
 * html-fixer CLI
 */

import { Command } from 'commander';
import { createRequire } from 'module';
import { processFiles } from './core/processor.js';
import { Logger } from './utils/logger.js';
import { EscapeMode } from './core/entities.js';

// Read version from package.json (kept in sync by semantic-release)
const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

const program = new Command();

program
  .name('html-fixer')
  .description('Fast, safe CLI tool for escaping unescaped HTML entities')
  .version(version)
  .argument('<patterns...>', 'Glob patterns for files to process (e.g., "src/**/*.jsx")')
  .option('-d, --dry-run', 'Preview changes without modifying files', false)
  .option('-m, --mode <mode>', 'Escaping mode: essential or extended', 'essential')
  .option('-v, --verbose', 'Show detailed output', false)
  .option('-q, --quiet', 'Suppress all output except errors', false)
  .action(async (patterns: string[], options) => {
    const logger = new Logger({
      verbose: options.verbose,
      quiet: options.quiet,
    });

    // Validate mode
    const mode = options.mode as EscapeMode;
    if (mode !== 'essential' && mode !== 'extended') {
      logger.error(`Invalid mode: ${mode}. Must be 'essential' or 'extended'.`);
      process.exit(1);
    }

    if (options.dryRun) {
      logger.info('🔍 Dry run mode - no files will be modified\n');
    }

    logger.debug(`Patterns: ${patterns.join(', ')}`);
    logger.debug(`Mode: ${mode}`);

    try {
      const summary = await processFiles(patterns, {
        mode,
        dryRun: options.dryRun,
      });

      // Report results
      if (summary.totalFiles === 0) {
        logger.warn('No files matched the provided patterns.');
        process.exit(0);
      }

      // Show individual file results in verbose mode
      if (options.verbose) {
        for (const file of summary.files) {
          if (!file.success) {
            logger.error(`${file.filePath}: ${file.error}`);
          } else if (file.result?.hasChanges) {
            const action = options.dryRun ? 'would fix' : 'fixed';
            logger.success(
              `${logger.formatPath(file.filePath)}: ${action} ${file.result.escapedCount} entities`
            );
          } else {
            logger.debug(`${file.filePath}: no changes needed`);
          }
        }
      }

      // Show summary
      const summaryLines = [
        `Files scanned: ${logger.formatNumber(summary.totalFiles)}`,
        `Files with changes: ${logger.formatNumber(summary.filesWithChanges)}`,
        `Entities ${options.dryRun ? 'to fix' : 'fixed'}: ${logger.formatNumber(summary.totalEntitiesEscaped)}`,
      ];

      if (summary.failedFiles > 0) {
        summaryLines.push(`Failed files: ${logger.formatNumber(summary.failedFiles)}`);
      }

      logger.summary(summaryLines);

      // Exit with error if any files failed
      if (summary.failedFiles > 0) {
        process.exit(1);
      }

      // Exit with code 1 in dry-run mode if there are changes (useful for CI)
      if (options.dryRun && summary.filesWithChanges > 0) {
        process.exit(1);
      }
    } catch (err) {
      logger.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program.parse();
