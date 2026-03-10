import bwipjs from 'bwip-js';

export type ExtendedBarcodeFormat =
  | 'code128'
  | 'code39'
  | 'ean13'
  | 'ean8'
  | 'upca'
  | 'itf14'
  | 'datamatrix'
  | 'pdf417'
  | 'azteccode'
  | 'qrcode'
  | 'code93'
  | 'code11'
  | 'codabar'
  | 'gs1-128';

export interface ExtendedBarcodeOptions {
  width?: number;
  height?: number;
  scale?: number;
  textColor?: string;
  backgroundColor?: string;
  includeText?: boolean;
  textXAlign?: 'left' | 'center' | 'right';
  textYAlign?: 'below' | 'above';
}

export interface ExtendedBarcodeResult {
  success: boolean;
  data?: string;
  svg?: string;
  error?: string;
}

export const EXTENDED_FORMATS: Record<ExtendedBarcodeFormat, { label: string; description: string; placeholder: string }> = {
  'code128': {
    label: 'Code 128',
    description: '通用条码，支持所有ASCII字符',
    placeholder: '输入任意文本',
  },
  'code39': {
    label: 'Code 39',
    description: '支持大写字母、数字和特殊字符',
    placeholder: '输入大写字母和数字',
  },
  'code93': {
    label: 'Code 93',
    description: 'Code 39的紧凑版本',
    placeholder: '输入大写字母和数字',
  },
  'code11': {
    label: 'Code 11',
    description: '主要用于电信设备',
    placeholder: '输入数字',
  },
  'codabar': {
    label: 'Codabar',
    description: '常用于图书馆和血库',
    placeholder: '输入数字和字符',
  },
  'ean13': {
    label: 'EAN-13',
    description: '13位商品条码',
    placeholder: '输入12-13位数字',
  },
  'ean8': {
    label: 'EAN-8',
    description: '8位商品条码',
    placeholder: '输入7-8位数字',
  },
  'upca': {
    label: 'UPC-A',
    description: '12位美国商品条码',
    placeholder: '输入11-12位数字',
  },
  'itf14': {
    label: 'ITF-14',
    description: '14位物流包装条码',
    placeholder: '输入13-14位数字',
  },
  'gs1-128': {
    label: 'GS1-128',
    description: '供应链标准条码',
    placeholder: '输入GS1格式数据',
  },
  'datamatrix': {
    label: 'Data Matrix',
    description: '二维条码，高密度数据存储',
    placeholder: '输入任意文本',
  },
  'pdf417': {
    label: 'PDF417',
    description: '二维条码，支持大量数据',
    placeholder: '输入任意文本',
  },
  'azteccode': {
    label: 'Aztec Code',
    description: '二维条码，常用于交通票据',
    placeholder: '输入任意文本',
  },
  'qrcode': {
    label: 'QR Code',
    description: '二维码，广泛使用',
    placeholder: '输入任意文本或URL',
  },
};

export function generateExtendedBarcode(
  text: string,
  format: ExtendedBarcodeFormat,
  options: ExtendedBarcodeOptions = {}
): ExtendedBarcodeResult {
  if (!text || text.trim() === '') {
    return { success: false, error: '请输入内容' };
  }

  try {
    const canvas = document.createElement('canvas');
    
    const bwipOptions: Record<string, unknown> = {
      bcid: format,
      text: text,
      scale: options.scale || 2,
      height: options.height || 10,
      includetext: options.includeText !== false,
      textxalign: options.textXAlign || 'center',
      textyalign: options.textYAlign || 'below',
      backgroundcolor: options.backgroundColor || 'FFFFFF',
      barcolor: options.textColor || '000000',
    };

    if (format === 'datamatrix' || format === 'pdf417' || format === 'azteccode' || format === 'qrcode') {
      bwipOptions.columns = options.width || 0;
    }

    bwipjs.toCanvas(canvas, bwipOptions as unknown as bwipjs.RenderOptions);

    const dataUrl = canvas.toDataURL('image/png');
    
    return {
      success: true,
      data: dataUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成失败',
    };
  }
}

export function generateExtendedBarcodeSVG(
  text: string,
  format: ExtendedBarcodeFormat,
  options: ExtendedBarcodeOptions = {}
): ExtendedBarcodeResult {
  if (!text || text.trim() === '') {
    return { success: false, error: '请输入内容' };
  }

  try {
    const canvas = document.createElement('canvas');
    
    const bwipOptions: Record<string, unknown> = {
      bcid: format,
      text: text,
      scale: options.scale || 2,
      height: options.height || 10,
      includetext: options.includeText !== false,
      textxalign: options.textXAlign || 'center',
      textyalign: options.textYAlign || 'below',
      backgroundcolor: options.backgroundColor || 'FFFFFF',
      barcolor: options.textColor || '000000',
    };

    bwipjs.toCanvas(canvas, bwipOptions as unknown as bwipjs.RenderOptions);
    
    const dataUrl = canvas.toDataURL('image/png');
    
    return {
      success: true,
      data: dataUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成失败',
    };
  }
}
