'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateBarcode, generateBarcodeSVG, VALID_FORMATS } from '@/lib/barcode';
import { toast } from '@/lib/toast';
import { copyToClipboard } from '@/lib/clipboard';
import LoadingSpinner from './LoadingSpinner';
import type { BarcodeFormat, BarcodeOptions } from '@/lib/types';

interface BarcodeCardProps {
  title?: string;
  description?: string;
  defaultFormat?: BarcodeFormat;
  defaultText?: string;
  className?: string;
}

const FORMAT_LABELS: Record<BarcodeFormat, string> = {
  CODE128: 'CODE128',
  CODE39: 'CODE39',
  EAN13: 'EAN-13',
  EAN8: 'EAN-8',
  UPC: 'UPC-A',
  ITF14: 'ITF-14',
};

const FORMAT_HINTS: Record<BarcodeFormat, string> = {
  CODE128: '任意字符',
  CODE39: '大写字母/数字',
  EAN13: '12-13位数字',
  EAN8: '7-8位数字',
  UPC: '11-12位数字',
  ITF14: '13-14位数字',
};

const FORMAT_PLACEHOLDERS: Record<BarcodeFormat, string> = {
  CODE128: '输入文本',
  CODE39: 'ABC-123',
  EAN13: '123456789012',
  EAN8: '1234567',
  UPC: '12345678901',
  ITF14: '1234567890123',
};

export default function BarcodeCard({
  title = '条码生成器',
  description = '生成多种格式的条形码',
  defaultFormat = 'CODE128',
  defaultText = '',
  className = '',
}: BarcodeCardProps) {
  const [text, setText] = useState(defaultText);
  const [format, setFormat] = useState<BarcodeFormat>(defaultFormat);
  const [options, setOptions] = useState<BarcodeOptions>({
    width: 2,
    height: 80,
    lineColor: '#000000',
    background: '#ffffff',
    displayValue: true,
    margin: 10,
    fontSize: 14,
  });
  const [preview, setPreview] = useState<string>('');
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isValid, setIsValid] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const updatePreview = useCallback(() => {
    if (!text.trim()) {
      setPreview('');
      setSvgContent('');
      setError('');
      setIsValid(false);
      return;
    }

    setIsGenerating(true);

    const pngResult = generateBarcode(text, format, options);
    const svgResult = generateBarcodeSVG(text, format, options);

    if (pngResult.success && pngResult.data) {
      setPreview(pngResult.data);
      setError('');
      setIsValid(true);
    } else {
      setError(pngResult.error || '生成失败');
      setPreview('');
      setIsValid(false);
    }

    if (svgResult.success && svgResult.data) {
      setSvgContent(svgResult.data);
    }

    setIsGenerating(false);
  }, [text, format, options]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePreview();
    }, 150);

    return () => clearTimeout(timer);
  }, [updatePreview]);

  const handleDownloadPNG = () => {
    if (!preview) return;

    const link = document.createElement('a');
    link.download = `barcode-${format}-${Date.now()}.png`;
    link.href = preview;
    link.click();
    toast.success('PNG 下载成功');
  };

  const handleDownloadSVG = () => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `barcode-${format}-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('SVG 下载成功');
  };

  const handleCopyImage = async () => {
    if (!preview) return;
    await copyToClipboard(preview, 'image');
  };

  const handleOptionChange = (key: keyof BarcodeOptions, value: string | number | boolean) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-full ${className}`}>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="barcode-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                条码格式
              </label>
              <select
                id="barcode-format"
                value={format}
                onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-colors duration-200 min-h-[40px] text-sm"
              >
                {VALID_FORMATS.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {FORMAT_LABELS[fmt]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="barcode-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                条码内容
              </label>
              <input
                id="barcode-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={FORMAT_PLACEHOLDERS[format]}
                className={`w-full px-3 py-2 border rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-colors duration-200 min-h-[40px]
                            ${error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1" role="alert">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">{FORMAT_HINTS[format]}</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                宽度: {options.width}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={options.width}
                onChange={(e) => handleOptionChange('width', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                高度: {options.height}px
              </label>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={options.height}
                onChange={(e) => handleOptionChange('height', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                线条颜色
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={options.lineColor}
                  onChange={(e) => handleOptionChange('lineColor', e.target.value)}
                  className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={options.lineColor}
                  onChange={(e) => handleOptionChange('lineColor', e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[44px]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                背景颜色
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={options.background}
                  onChange={(e) => handleOptionChange('background', e.target.value)}
                  className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={options.background}
                  onChange={(e) => handleOptionChange('background', e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[44px]"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.displayValue}
              onChange={(e) => handleOptionChange('displayValue', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            显示文本
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            预览
          </label>
          <div ref={previewRef}
            className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2 
                       bg-gray-50 dark:bg-gray-900 min-h-[300px] flex items-center justify-center relative">
            {isGenerating && <LoadingSpinner size="sm" />}
            {preview ? (
              <img src={preview} alt="条码预览" className="max-w-full h-auto max-h-[200px]" />
            ) : (
              <p className="text-gray-400 text-sm">{text ? '输入无效' : '请输入内容'}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleCopyImage}
              disabled={!isValid}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400
                         text-white text-sm font-medium rounded-lg transition-colors
                         disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制
            </button>
            <button
              onClick={handleDownloadPNG}
              disabled={!isValid}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                         text-white text-sm font-medium rounded-lg transition-colors
                         disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PNG
            </button>
            <button
              onClick={handleDownloadSVG}
              disabled={!isValid}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400
                         text-white text-sm font-medium rounded-lg transition-colors
                         disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
