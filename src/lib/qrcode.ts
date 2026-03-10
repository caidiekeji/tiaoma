import QRCode from 'qrcode';
import type { QRCodeOptions, QRCodeResult, QRCodeErrorCorrectionLevel } from './types';

export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<QRCodeResult> {
  if (!text || text.trim() === '') {
    return {
      success: false,
      error: '输入文本不能为空',
    };
  }

  try {
    const defaultOptions: QRCodeOptions = {
      width: 300,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
      outputFormat: 'dataURL',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    if (mergedOptions.outputFormat === 'svg') {
      const svgString = await QRCode.toString(text, {
        type: 'svg',
        width: mergedOptions.width,
        margin: mergedOptions.margin,
        color: mergedOptions.color,
        errorCorrectionLevel: mergedOptions.errorCorrectionLevel as QRCodeErrorCorrectionLevel,
      });

      return {
        success: true,
        data: svgString,
      };
    } else {
      const dataURL = await QRCode.toDataURL(text, {
        width: mergedOptions.width,
        margin: mergedOptions.margin,
        color: mergedOptions.color,
        errorCorrectionLevel: mergedOptions.errorCorrectionLevel as QRCodeErrorCorrectionLevel,
      });

      return {
        success: true,
        data: dataURL,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `二维码生成失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

export async function generateQRCodeDataURL(
  text: string,
  options: Omit<QRCodeOptions, 'outputFormat'> = {}
): Promise<QRCodeResult> {
  return generateQRCode(text, { ...options, outputFormat: 'dataURL' });
}

export async function generateQRCodeSVG(
  text: string,
  options: Omit<QRCodeOptions, 'outputFormat'> = {}
): Promise<QRCodeResult> {
  return generateQRCode(text, { ...options, outputFormat: 'svg' });
}

export const ERROR_CORRECTION_LEVELS = {
  L: '低 (约7%纠错能力)',
  M: '中 (约15%纠错能力)',
  Q: '四分之一 (约25%纠错能力)',
  H: '高 (约30%纠错能力)',
} as const;
