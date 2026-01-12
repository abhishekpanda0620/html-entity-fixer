/**
 * html-fixer - Fast, safe CLI tool for escaping HTML entities
 *
 * @packageDocumentation
 */

export { escapeHtml, hasUnescapedEntities, type EscapeResult } from './core/escaper.js';
export {
  processFile,
  processFiles,
  type ProcessOptions,
  type FileResult,
  type ProcessSummary,
} from './core/processor.js';
export {
  type EscapeMode,
  ESSENTIAL_ENTITIES,
  EXTENDED_ENTITIES,
  getEntityMap,
} from './core/entities.js';
