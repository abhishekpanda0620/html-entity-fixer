/**
 * Integration tests for the file processor
 */

import { writeFile, mkdir, rm, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { processFile, processFiles } from '../src/core/processor.js';
import { sampleFiles } from './fixtures.js';

describe('Processor', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a unique temp directory for each test
    testDir = join(tmpdir(), `html-fixer-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up temp directory
    await rm(testDir, { recursive: true, force: true });
  });

  /**
   * Helper to create a test file
   */
  async function createTestFile(name: string, content: string): Promise<string> {
    const filePath = join(testDir, name);
    await writeFile(filePath, content, 'utf-8');
    return filePath;
  }

  describe('processFile', () => {
    it('should process a file with entities', async () => {
      const filePath = await createTestFile('test.jsx', sampleFiles.jsxWithEntities);
      
      const result = await processFile(filePath, { mode: 'essential', dryRun: false });
      
      expect(result.success).toBe(true);
      expect(result.result?.hasChanges).toBe(true);
      expect(result.result?.escapedCount).toBeGreaterThan(0);
    });

    it('should not modify files in dry-run mode', async () => {
      const originalContent = sampleFiles.jsxWithEntities;
      const filePath = await createTestFile('test.jsx', originalContent);
      
      await processFile(filePath, { mode: 'essential', dryRun: true });
      
      const afterContent = await readFile(filePath, 'utf-8');
      expect(afterContent).toBe(originalContent);
    });

    it('should modify files when not in dry-run mode', async () => {
      const originalContent = sampleFiles.jsxWithEntities;
      const filePath = await createTestFile('test.jsx', originalContent);
      
      await processFile(filePath, { mode: 'essential', dryRun: false });
      
      const afterContent = await readFile(filePath, 'utf-8');
      expect(afterContent).not.toBe(originalContent);
      expect(afterContent).toContain('&#39;');
    });

    it('should handle files without changes', async () => {
      const filePath = await createTestFile('clean.ts', sampleFiles.cleanFile);
      
      const result = await processFile(filePath, { mode: 'essential', dryRun: false });
      
      expect(result.success).toBe(true);
      expect(result.result?.hasChanges).toBe(false);
      expect(result.result?.escapedCount).toBe(0);
    });

    it('should return error for non-existent files', async () => {
      const result = await processFile('/nonexistent/file.txt', { 
        mode: 'essential', 
        dryRun: false 
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('processFiles', () => {
    it('should process multiple files matching glob pattern', async () => {
      await createTestFile('a.jsx', sampleFiles.jsxWithEntities);
      await createTestFile('b.jsx', sampleFiles.jsxWithEntities);
      await createTestFile('c.ts', sampleFiles.cleanFile);
      
      const summary = await processFiles(['*.jsx'], { 
        mode: 'essential', 
        dryRun: true,
        cwd: testDir,
      });
      
      expect(summary.totalFiles).toBe(2);
      expect(summary.filesWithChanges).toBe(2);
    });

    it('should return empty summary for no matches', async () => {
      const summary = await processFiles(['*.nonexistent'], { 
        mode: 'essential', 
        dryRun: true,
        cwd: testDir,
      });
      
      expect(summary.totalFiles).toBe(0);
      expect(summary.filesWithChanges).toBe(0);
    });

    it('should aggregate statistics correctly', async () => {
      await createTestFile('file1.jsx', "Test's");  // 1 entity
      await createTestFile('file2.jsx', '"quote"'); // 2 entities
      await createTestFile('file3.jsx', 'clean');   // 0 entities
      
      const summary = await processFiles(['*.jsx'], { 
        mode: 'essential', 
        dryRun: true,
        cwd: testDir,
      });
      
      expect(summary.totalFiles).toBe(3);
      expect(summary.filesWithChanges).toBe(2);
      expect(summary.totalEntitiesEscaped).toBe(3);
      expect(summary.failedFiles).toBe(0);
    });
  });
});
