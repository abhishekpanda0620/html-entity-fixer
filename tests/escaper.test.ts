/**
 * Unit tests for the escaper module
 */

import { escapeHtml, hasUnescapedEntities } from '../src/core/escaper.js';
import { testCases } from './fixtures.js';

describe('escapeHtml', () => {
  describe('essential mode', () => {
    it.each(testCases.essential.basic)(
      'should escape: "$input" → "$expected"',
      ({ input, expected, escapedCount }) => {
        const result = escapeHtml(input, 'essential');
        expect(result.content).toBe(expected);
        expect(result.escapedCount).toBe(escapedCount);
        expect(result.hasChanges).toBe(escapedCount > 0);
      }
    );

    it.each(testCases.essential.combined)(
      'should handle combined entities',
      ({ input, expected, escapedCount }) => {
        const result = escapeHtml(input, 'essential');
        expect(result.content).toBe(expected);
        expect(result.escapedCount).toBe(escapedCount);
      }
    );

    it.each(testCases.essential.alreadyEscaped)(
      'should not double-escape: "$input"',
      ({ input, expected, escapedCount }) => {
        const result = escapeHtml(input, 'essential');
        expect(result.content).toBe(expected);
        expect(result.escapedCount).toBe(escapedCount);
      }
    );

    it.each(testCases.essential.mixed)(
      'should handle mixed escaped/unescaped',
      ({ input, expected, escapedCount }) => {
        const result = escapeHtml(input, 'essential');
        expect(result.content).toBe(expected);
        expect(result.escapedCount).toBe(escapedCount);
      }
    );
  });

  describe('extended mode', () => {
    it.each(testCases.extended.basic)(
      'should escape extended entities: "$input"',
      ({ input, expected, escapedCount }) => {
        const result = escapeHtml(input, 'extended');
        expect(result.content).toBe(expected);
        expect(result.escapedCount).toBe(escapedCount);
      }
    );

    it('should include essential entities in extended mode', () => {
      const result = escapeHtml("Test's © symbol", 'extended');
      expect(result.content).toBe("Test&#39;s &copy; symbol");
      expect(result.escapedCount).toBe(2);
    });
  });

  describe('no changes needed', () => {
    it.each(testCases.noChanges)(
      'should return unchanged: "$input"',
      ({ input, expected, escapedCount }) => {
        const result = escapeHtml(input, 'essential');
        expect(result.content).toBe(expected);
        expect(result.escapedCount).toBe(escapedCount);
        expect(result.hasChanges).toBe(false);
      }
    );
  });

  describe('default mode', () => {
    it('should default to essential mode', () => {
      const result = escapeHtml("Test's quote");
      expect(result.content).toBe("Test&#39;s quote");
    });
  });
});

describe('hasUnescapedEntities', () => {
  it('should return true when entities need escaping', () => {
    expect(hasUnescapedEntities("Test's quote")).toBe(true);
    expect(hasUnescapedEntities('<script>')).toBe(true);
  });

  it('should return false when no escaping needed', () => {
    expect(hasUnescapedEntities('Plain text')).toBe(false);
    expect(hasUnescapedEntities('&amp;')).toBe(false);
  });

  it('should respect mode parameter', () => {
    expect(hasUnescapedEntities('©', 'essential')).toBe(false);
    expect(hasUnescapedEntities('©', 'extended')).toBe(true);
  });
});
