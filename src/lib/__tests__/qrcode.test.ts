import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateQRCode,
  generateQRCodeDataURL,
  generateQRCodeSVG,
  ERROR_CORRECTION_LEVELS,
} from '../qrcode';

describe('qrcode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ERROR_CORRECTION_LEVELS', () => {
    it('contains all error correction levels', () => {
      expect(ERROR_CORRECTION_LEVELS).toHaveProperty('L');
      expect(ERROR_CORRECTION_LEVELS).toHaveProperty('M');
      expect(ERROR_CORRECTION_LEVELS).toHaveProperty('Q');
      expect(ERROR_CORRECTION_LEVELS).toHaveProperty('H');
    });

    it('has descriptive labels', () => {
      expect(ERROR_CORRECTION_LEVELS.L).toContain('低');
      expect(ERROR_CORRECTION_LEVELS.M).toContain('中');
      expect(ERROR_CORRECTION_LEVELS.Q).toContain('四分之一');
      expect(ERROR_CORRECTION_LEVELS.H).toContain('高');
    });
  });

  describe('generateQRCode', () => {
    it('returns error for empty text', async () => {
      const result = await generateQRCode('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('输入文本不能为空');
    });

    it('returns error for whitespace text', async () => {
      const result = await generateQRCode('   ');
      expect(result.success).toBe(false);
      expect(result.error).toBe('输入文本不能为空');
    });

    it('generates QR code as data URL by default', async () => {
      const result = await generateQRCode('https://example.com');
      expect(result.success).toBe(true);
      expect(result.data).toMatch(/^data:image\/png;base64,/);
    });

    it('generates QR code as SVG when specified', async () => {
      const result = await generateQRCode('https://example.com', {
        outputFormat: 'svg',
      });
      expect(result.success).toBe(true);
      expect(result.data).toContain('<svg');
    });

    it('accepts custom options', async () => {
      const result = await generateQRCode('Test', {
        width: 500,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      expect(result.success).toBe(true);
    });

    it('handles various text types', async () => {
      const testCases = [
        'Simple text',
        'https://example.com/path?query=value',
        '{"json": "data"}',
        '中文测试',
        '🎉 Emoji test',
      ];

      for (const text of testCases) {
        const result = await generateQRCode(text);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('generateQRCodeDataURL', () => {
    it('generates QR code as data URL', async () => {
      const result = await generateQRCodeDataURL('https://example.com');
      expect(result.success).toBe(true);
      expect(result.data).toMatch(/^data:image\/png;base64,/);
    });

    it('returns error for empty text', async () => {
      const result = await generateQRCodeDataURL('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('输入文本不能为空');
    });
  });

  describe('generateQRCodeSVG', () => {
    it('generates QR code as SVG', async () => {
      const result = await generateQRCodeSVG('https://example.com');
      expect(result.success).toBe(true);
      expect(result.data).toContain('<svg');
    });

    it('returns error for empty text', async () => {
      const result = await generateQRCodeSVG('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('输入文本不能为空');
    });
  });
});
