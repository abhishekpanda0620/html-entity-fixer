/**
 * HTML entity mappings for different escaping modes
 */

export type EscapeMode = 'essential' | 'extended';

/**
 * Essential HTML entities that must always be escaped
 * These prevent XSS and HTML parsing issues
 */
export const ESSENTIAL_ENTITIES: ReadonlyMap<string, string> = new Map([
  ['&', '&amp;'], // Must be first to avoid double-escaping
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ["'", '&#39;'],
]);

/**
 * Extended entities for enhanced escaping
 * Includes common special characters
 */
export const EXTENDED_ENTITIES: ReadonlyMap<string, string> = new Map([
  // Include all essential entities
  ...ESSENTIAL_ENTITIES,
  // Additional extended entities
  ['©', '&copy;'],
  ['®', '&reg;'],
  ['™', '&trade;'],
  // Typography
  ['—', '&mdash;'],
  ['–', '&ndash;'],
  ['\u00A0', '&nbsp;'], // Non-breaking space
  ['…', '&hellip;'],
  ['§', '&sect;'],
  ['¶', '&para;'],
  ['°', '&deg;'],
  // Currency
  ['€', '&euro;'],
  ['£', '&pound;'],
  ['¥', '&yen;'],
  ['¢', '&cent;'],
  // Fractions
  ['½', '&frac12;'],
  ['¼', '&frac14;'],
  ['¾', '&frac34;'],
  // Math & Logic
  ['×', '&times;'],
  ['÷', '&divide;'],
  ['±', '&plusmn;'],
  ['∞', '&infin;'],
  ['≠', '&ne;'],
  ['≈', '&asymp;'],
  ['≤', '&le;'],
  ['≥', '&ge;'],
  // Arrows
  ['←', '&larr;'],
  ['→', '&rarr;'],
  ['↑', '&uarr;'],
  ['↓', '&darr;'],
]);

/**
 * Get the appropriate entity map for the given mode
 */
export function getEntityMap(mode: EscapeMode): ReadonlyMap<string, string> {
  return mode === 'extended' ? EXTENDED_ENTITIES : ESSENTIAL_ENTITIES;
}

/**
 * Patterns to detect already-escaped entities (to avoid double-escaping)
 */
export const ESCAPED_ENTITY_PATTERN = /&(?:#\d+|#x[\da-fA-F]+|[a-zA-Z]+);/g;
