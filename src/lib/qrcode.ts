import QRCode from 'qrcode';

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export const ERROR_CORRECTION_LEVELS = {
  L: '低 (7%)',
  M: '中 (15%)',
  Q: '较高 (25%)',
  H: '高 (30%)',
} as const;

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
}

export interface QRCodeResult {
  success: boolean;
  data?: string;
  error?: string;
}

export async function generateQRCodeDataURL(
  text: string,
  options: QRCodeOptions = {}
): Promise<QRCodeResult> {
  try {
    const dataURL = await QRCode.toDataURL(text, {
      width: options.width || 300,
      margin: options.margin || 4,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#ffffff',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    });

    return {
      success: true,
      data: dataURL,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成二维码失败',
    };
  }
}

export async function generateQRCodeSVG(
  text: string,
  options: QRCodeOptions = {}
): Promise<QRCodeResult> {
  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      width: options.width || 300,
      margin: options.margin || 4,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#ffffff',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    });

    return {
      success: true,
      data: svg,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成二维码失败',
    };
  }
}

export async function generateQRCodePNG(
  text: string,
  options: QRCodeOptions = {}
): Promise<QRCodeResult> {
  try {
    const buffer = await QRCode.toBuffer(text, {
      width: options.width || 300,
      margin: options.margin || 4,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#ffffff',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    });

    return {
      success: true,
      data: buffer.toString('base64'),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成二维码失败',
    };
  }
}