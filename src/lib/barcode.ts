import JsBarcode from 'jsbarcode';
import type { BarcodeFormat, BarcodeOptions, BarcodeResult } from './types';

const VALID_FORMATS: BarcodeFormat[] = ['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14'];

function validateInput(text: string, format: BarcodeFormat): string | null {
  if (!text || text.trim() === '') {
    return '输入文本不能为空';
  }

  switch (format) {
    case 'EAN13':
      if (!/^\d{12,13}$/.test(text)) {
        return 'EAN13 需要 12-13 位数字';
      }
      break;
    case 'EAN8':
      if (!/^\d{7,8}$/.test(text)) {
        return 'EAN8 需要 7-8 位数字';
      }
      break;
    case 'UPC':
      if (!/^\d{11,12}$/.test(text)) {
        return 'UPC 需要 11-12 位数字';
      }
      break;
    case 'ITF14':
      if (!/^\d{13,14}$/.test(text)) {
        return 'ITF14 需要 13-14 位数字';
      }
      break;
    case 'CODE39':
      if (!/^[A-Z0-9\-. $/+%]+$/i.test(text)) {
        return 'CODE39 只能包含字母、数字和特殊字符(-. $/+%)';
      }
      break;
    case 'CODE128':
      break;
  }

  return null;
}

export function generateBarcode(
  text: string,
  format: BarcodeFormat = 'CODE128',
  options: BarcodeOptions = {}
): BarcodeResult {
  if (!VALID_FORMATS.includes(format)) {
    return {
      success: false,
      error: `不支持的条码格式: ${format}。支持的格式: ${VALID_FORMATS.join(', ')}`,
    };
  }

  const validationError = validateInput(text, format);
  if (validationError) {
    return {
      success: false,
      error: validationError,
    };
  }

  try {
    const canvas = document.createElement('canvas');

    const defaultOptions: BarcodeOptions = {
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 16,
      margin: 10,
      lineColor: '#000000',
      background: '#ffffff',
      textAlign: 'center',
      textPosition: 'bottom',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    JsBarcode(canvas, text, {
      format: format,
      width: mergedOptions.width,
      height: mergedOptions.height,
      displayValue: mergedOptions.displayValue,
      font: mergedOptions.font,
      fontSize: mergedOptions.fontSize,
      textMargin: mergedOptions.textMargin,
      margin: mergedOptions.margin,
      lineColor: mergedOptions.lineColor,
      background: mergedOptions.background,
      textAlign: mergedOptions.textAlign,
      textPosition: mergedOptions.textPosition,
    });

    const dataURL = canvas.toDataURL('image/png');

    return {
      success: true,
      data: dataURL,
    };
  } catch (error) {
    return {
      success: false,
      error: `条码生成失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

export function generateBarcodeSVG(
  text: string,
  format: BarcodeFormat = 'CODE128',
  options: BarcodeOptions = {}
): BarcodeResult {
  if (!VALID_FORMATS.includes(format)) {
    return {
      success: false,
      error: `不支持的条码格式: ${format}。支持的格式: ${VALID_FORMATS.join(', ')}`,
    };
  }

  const validationError = validateInput(text, format);
  if (validationError) {
    return {
      success: false,
      error: validationError,
    };
  }

  try {
    const defaultOptions: BarcodeOptions = {
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 16,
      margin: 10,
      lineColor: '#000000',
      background: '#ffffff',
      textAlign: 'center',
      textPosition: 'bottom',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    JsBarcode(svgElement, text, {
      format: format,
      width: mergedOptions.width,
      height: mergedOptions.height,
      displayValue: mergedOptions.displayValue,
      font: mergedOptions.font,
      fontSize: mergedOptions.fontSize,
      textMargin: mergedOptions.textMargin,
      margin: mergedOptions.margin,
      lineColor: mergedOptions.lineColor,
      background: mergedOptions.background,
      textAlign: mergedOptions.textAlign,
      textPosition: mergedOptions.textPosition,
    });

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    return {
      success: true,
      data: svgString,
    };
  } catch (error) {
    return {
      success: false,
      error: `条码生成失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

export { VALID_FORMATS };
