/**
 * Unit tests for entity definitions
 */

import { 
  ESSENTIAL_ENTITIES, 
  EXTENDED_ENTITIES, 
  getEntityMap,
  type EscapeMode 
} from '../src/core/entities.js';

describe('Entity Maps', () => {
  describe('ESSENTIAL_ENTITIES', () => {
    const requiredEntities = ['&', '<', '>', '"', "'"];

    it.each(requiredEntities)('should contain mapping for "%s"', (char) => {
      expect(ESSENTIAL_ENTITIES.has(char)).toBe(true);
    });

    it('should have & as first entry to prevent double-escaping', () => {
      const firstKey = ESSENTIAL_ENTITIES.keys().next().value;
      expect(firstKey).toBe('&');
    });

    it('should map to correct entity codes', () => {
      expect(ESSENTIAL_ENTITIES.get('&')).toBe('&amp;');
      expect(ESSENTIAL_ENTITIES.get('<')).toBe('&lt;');
      expect(ESSENTIAL_ENTITIES.get('>')).toBe('&gt;');
      expect(ESSENTIAL_ENTITIES.get('"')).toBe('&quot;');
      expect(ESSENTIAL_ENTITIES.get("'")).toBe('&#39;');
    });
  });

  describe('EXTENDED_ENTITIES', () => {
    it('should include all essential entities', () => {
      for (const [char] of ESSENTIAL_ENTITIES) {
        expect(EXTENDED_ENTITIES.has(char)).toBe(true);
      }
    });

    const extendedChars = [
      '©', '®', '™', 
      '—', '–', '\u00A0', '…', '§', '¶', '°',
      '€', '£', '¥', '¢', 
      '½', '¼', '¾',
      '×', '÷', '±', '∞', '≠', '≈', '≤', '≥',
      '←', '→', '↑', '↓'
    ];

    it.each(extendedChars)('should contain extended char "%s"', (char) => {
      expect(EXTENDED_ENTITIES.has(char)).toBe(true);
    });
  });

  describe('getEntityMap', () => {
    const modes: Array<{ mode: EscapeMode; expected: typeof ESSENTIAL_ENTITIES }> = [
      { mode: 'essential', expected: ESSENTIAL_ENTITIES },
      { mode: 'extended', expected: EXTENDED_ENTITIES },
    ];

    it.each(modes)('should return correct map for $mode mode', ({ mode, expected }) => {
      expect(getEntityMap(mode)).toBe(expected);
    });
  });
});
