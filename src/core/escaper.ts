/**
 * Core HTML entity escaping logic
 */

import { EscapeMode, getEntityMap, ESCAPED_ENTITY_PATTERN } from './entities.js';

export interface EscapeResult {
  /** The escaped content */
  content: string;
  /** Number of entities that were escaped */
  escapedCount: number;
  /** Whether any changes were made */
  hasChanges: boolean;
}

/**
 * Escapes HTML entities in the given content
 *
 * @param content - The content to escape
 * @param mode - The escaping mode ('essential' or 'extended')
 * @returns The escape result with content and statistics
 */
export function escapeHtml(content: string, mode: EscapeMode = 'essential'): EscapeResult {
  const entityMap = getEntityMap(mode);
  let escapedCount = 0;

  // First, temporarily replace already-escaped entities to avoid double-escaping
  const placeholders: string[] = [];
  const contentWithPlaceholders = content.replace(ESCAPED_ENTITY_PATTERN, (match) => {
    placeholders.push(match);
    return `\uE000PH_${placeholders.length - 1}\uE001`;
  });

  // Escape unescaped entities
  let escapedContent = contentWithPlaceholders;
  for (const [char, entity] of entityMap) {
    const regex = new RegExp(escapeRegex(char), 'g');
    const matches = escapedContent.match(regex);
    if (matches) {
      escapedCount += matches.length;
      escapedContent = escapedContent.replace(regex, entity);
    }
  }

  // Restore the placeholders
  escapedContent = escapedContent.replace(/\uE000PH_(\d+)\uE001/g, (_, index) => {
    return placeholders[parseInt(index, 10)];
  });

  return {
    content: escapedContent,
    escapedCount,
    hasChanges: escapedCount > 0,
  };
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if content contains unescaped HTML entities
 */
export function hasUnescapedEntities(content: string, mode: EscapeMode = 'essential'): boolean {
  const result = escapeHtml(content, mode);
  return result.hasChanges;
}
