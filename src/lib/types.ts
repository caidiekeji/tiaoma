export type BarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF14';

export interface BarcodeOptions {
  width?: number;
  height?: number;
  displayValue?: boolean;
  font?: string;
  fontSize?: number;
  textMargin?: number;
  margin?: number;
  lineColor?: string;
  background?: string;
  textAlign?: 'left' | 'center' | 'right';
  textPosition?: 'bottom' | 'top';
}

export interface BarcodeResult {
  success: boolean;
  data?: string;
  error?: string;
}

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRCodeOutputFormat = 'dataURL' | 'svg';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  outputFormat?: QRCodeOutputFormat;
}

export interface QRCodeResult {
  success: boolean;
  data?: string;
  error?: string;
}
