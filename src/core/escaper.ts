/**
 * Core HTML entity escaping logic
 *
 * This module handles HTML-aware escaping - it only escapes text content,
 * NOT HTML tags or attributes, to preserve document structure.
 */

import { EscapeMode, getEntityMap, ESCAPED_ENTITY_PATTERN } from './entities.js';
import { isValidTag } from './tags.js';

export interface EscapeResult {
  /** The escaped content */
  content: string;
  /** Number of entities that were escaped */
  escapedCount: number;
  /** Whether any changes were made */
  hasChanges: boolean;
}

/**
 * Escapes HTML entities in text content only (not in HTML tags)
 *
 * @param content - The HTML content to process
 * @param mode - The escaping mode ('essential' or 'extended')
 * @returns The escape result with content and statistics
 */
export function escapeHtml(content: string, mode: EscapeMode = 'essential'): EscapeResult {
  const entityMap = getEntityMap(mode);
  let escapedCount = 0;

  // Strategy: Split content into HTML tags and text segments
  // Only escape entities in text segments, preserve tags as-is

  // Regex to match HTML tags (including comments, doctype, etc.)
  // This matches: <!-- comments -->, <!DOCTYPE>, <tag>, </tag>, <tag />
  const htmlTagPattern =
    /(<!\[CDATA\[[\s\S]*?\]\]>|<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z][^>]*\/?>)/g;

  // Split content into parts (alternating: text, tag, text, tag, ...)
  const parts = content.split(htmlTagPattern);

  // Pre-scan for closing tags to support arbitrary XML tags
  const validClosingTags = new Set<string>();
  for (let i = 1; i < parts.length; i += 2) {
    const match = parts[i].match(/^<\/([a-zA-Z0-9-]+)>/);
    if (match) {
      validClosingTags.add(match[1]);
    }
  }

  const processedParts = parts.map((part, index) => {
    // Check if this part is a potential HTML tag (odd indices)
    if (index % 2 === 1) {
      // Special Handling for Comments, CDATA, Doctype, PI
      if (part.startsWith('<!') || part.startsWith('<?')) {
        return part;
      }

      // Validate if it is a REAL tag
      // Extract tag name (assuming standard format like <tag ...> or </tag>)
      const tagNameMatch = part.match(/^<\/?([a-zA-Z0-9-]+)/);
      if (tagNameMatch) {
        const tagName = tagNameMatch[1];

        // 1. Valid HTML/SVG/MathML tag
        // 2. Custom Element (hyphenated)
        // 3. React Component (PascalCase)
        // 4. XML tag with matching closing tag elsewhere in document
        // 5. Self-closing tag (ends with />)
        if (isValidTag(tagName) || validClosingTags.has(tagName) || part.trim().endsWith('/>')) {
          return part; // Return valid tag/comment unchanged
        }
      }
      // If it looks like a tag but isn't valid (e.g., <here>), treat as text
    }

    // This is text content (or invalid tag) - escape entities here
    return escapeTextContent(part, entityMap, (count) => {
      escapedCount += count;
    });
  });

  const escapedContent = processedParts.join('');

  return {
    content: escapedContent,
    escapedCount,
    hasChanges: escapedCount > 0,
  };
}

/**
 * Escape entities in a text string (not HTML)
 */
function escapeTextContent(
  text: string,
  entityMap: ReadonlyMap<string, string>,
  countCallback: (count: number) => void
): string {
  // First, temporarily replace already-escaped entities to avoid double-escaping
  const placeholders: string[] = [];
  let processed = text.replace(ESCAPED_ENTITY_PATTERN, (match) => {
    placeholders.push(match);
    return `\uE000PH_${placeholders.length - 1}\uE001`;
  });

  // Escape unescaped entities
  for (const [char, entity] of entityMap) {
    const regex = new RegExp(escapeRegex(char), 'g');
    const matches = processed.match(regex);
    if (matches) {
      countCallback(matches.length);
      processed = processed.replace(regex, entity);
    }
  }

  // Restore the placeholders
  processed = processed.replace(/\uE000PH_(\d+)\uE001/g, (_, index) => {
    return placeholders[parseInt(index, 10)];
  });

  return processed;
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
