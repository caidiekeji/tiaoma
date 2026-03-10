import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBarcode, generateBarcodeSVG, VALID_FORMATS } from '../barcode';

describe('barcode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('VALID_FORMATS', () => {
    it('contains expected barcode formats', () => {
      expect(VALID_FORMATS).toContain('CODE128');
      expect(VALID_FORMATS).toContain('CODE39');
      expect(VALID_FORMATS).toContain('EAN13');
      expect(VALID_FORMATS).toContain('EAN8');
      expect(VALID_FORMATS).toContain('UPC');
      expect(VALID_FORMATS).toContain('ITF14');
    });
  });

  describe('generateBarcode', () => {
    it('returns error for empty text', () => {
      const result = generateBarcode('', 'CODE128');
      expect(result.success).toBe(false);
      expect(result.error).toBe('输入文本不能为空');
    });

    it('returns error for whitespace text', () => {
      const result = generateBarcode('   ', 'CODE128');
      expect(result.success).toBe(false);
      expect(result.error).toBe('输入文本不能为空');
    });

    it('returns error for unsupported format', () => {
      const result = generateBarcode('test', 'INVALID' as any);
      expect(result.success).toBe(false);
      expect(result.error).toContain('不支持的条码格式');
    });

    it('validates EAN13 format - valid input', () => {
      const result = generateBarcode('123456789012', 'EAN13');
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('validates EAN13 format - invalid input', () => {
      const result = generateBarcode('abc', 'EAN13');
      expect(result.success).toBe(false);
      expect(result.error).toBe('EAN13 需要 12-13 位数字');
    });

    it('validates EAN8 format - valid input', () => {
      const result = generateBarcode('1234567', 'EAN8');
      expect(result.success).toBe(true);
    });

    it('validates EAN8 format - invalid input', () => {
      const result = generateBarcode('abc', 'EAN8');
      expect(result.success).toBe(false);
      expect(result.error).toBe('EAN8 需要 7-8 位数字');
    });

    it('validates UPC format - valid input', () => {
      const result = generateBarcode('12345678901', 'UPC');
      expect(result.success).toBe(true);
    });

    it('validates UPC format - invalid input', () => {
      const result = generateBarcode('abc', 'UPC');
      expect(result.success).toBe(false);
      expect(result.error).toBe('UPC 需要 11-12 位数字');
    });

    it('validates ITF14 format - valid input', () => {
      const result = generateBarcode('1234567890123', 'ITF14');
      expect(result.success).toBe(true);
    });

    it('validates ITF14 format - invalid input', () => {
      const result = generateBarcode('abc', 'ITF14');
      expect(result.success).toBe(false);
      expect(result.error).toBe('ITF14 需要 13-14 位数字');
    });

    it('validates CODE39 format - valid input', () => {
      const result = generateBarcode('ABC123', 'CODE39');
      expect(result.success).toBe(true);
    });

    it('validates CODE39 format - invalid characters', () => {
      const result = generateBarcode('ABC@123', 'CODE39');
      expect(result.success).toBe(false);
      expect(result.error).toContain('CODE39 只能包含');
    });

    it('generates CODE128 barcode successfully', () => {
      const result = generateBarcode('Hello World', 'CODE128');
      expect(result.success).toBe(true);
      expect(result.data).toMatch(/^data:image\/png;base64,/);
    });

    it('accepts custom options', () => {
      const result = generateBarcode('123456789012', 'EAN13', {
        width: 3,
        height: 150,
        margin: 20,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('generateBarcodeSVG', () => {
    it('returns error for empty text', () => {
      const result = generateBarcodeSVG('', 'CODE128');
      expect(result.success).toBe(false);
      expect(result.error).toBe('输入文本不能为空');
    });

    it('generates SVG successfully', () => {
      const result = generateBarcodeSVG('Hello World', 'CODE128');
      expect(result.success).toBe(true);
      expect(result.data).toContain('<svg');
    });

    it('returns error for unsupported format', () => {
      const result = generateBarcodeSVG('test', 'INVALID' as any);
      expect(result.success).toBe(false);
      expect(result.error).toContain('不支持的条码格式');
    });
  });
});
