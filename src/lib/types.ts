export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface BarcodeOptions {
  format: string;
  value: string;
  width?: number;
  height?: number;
  fontSize?: number;
  fontOptions?: string;
  font?: string;
  text?: string;
  textAlign?: string;
  textPosition?: string;
  textMargin?: number;
  background?: string;
  lineColor?: string;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

export interface BarcodeResult {
  success: boolean;
  data?: string;
  error?: string;
}

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