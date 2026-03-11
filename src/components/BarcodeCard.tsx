'use client';

import { useState, useEffect, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import { toast } from '@/lib/toast';
import LoadingSpinner from './LoadingSpinner';

interface BarcodeCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function BarcodeCard({
  title = '条形码生成器',
  description = '支持多种格式：Code128、Code39、EAN-13、DataMatrix、PDF417等',
  className = '',
}: BarcodeCardProps) {
  const [value, setValue] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(10);
  const [background, setBackground] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#000000');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateBarcode = useCallback(() => {
    if (!value.trim()) {
      setError('请输入条形码内容');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const canvas = document.getElementById('barcode-canvas') as HTMLCanvasElement;
      if (canvas) {
        JsBarcode(canvas, value, {
          format,
          width,
          height,
          fontSize,
          margin,
          background: background,
          lineColor,
          text: text || undefined,
        });
      }
    } catch (err) {
      setError(`生成失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [value, format, width, height, fontSize, margin, background, lineColor, text]);

  useEffect(() => {
    generateBarcode();
  }, [generateBarcode]);

  const downloadBarcode = (format: 'png' | 'svg') => {
    const canvas = document.getElementById('barcode-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    if (format === 'png') {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `barcode-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
      toast.success('PNG 下载成功');
    } else {
      // 生成 SVG
      const svg = document.createElement('svg');
      JsBarcode(svg, value, {
        format,
        width,
        height,
        fontSize,
        margin,
        background: background,
        lineColor,
        text: text || undefined,
      });
      const svgContent = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `barcode-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('SVG 下载成功');
    }
  };

  const barcodeFormats = [
    { value: 'CODE128', label: 'CODE128' },
    { value: 'CODE39', label: 'CODE39' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'EAN8', label: 'EAN-8' },
    { value: 'UPC', label: 'UPC' },
    { value: 'ITF14', label: 'ITF-14' },
    { value: 'MSI', label: 'MSI' },
    { value: 'Pharmacode', label: 'Pharmacode' },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-full ${className}`}>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="barcode-value"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              条形码内容
            </label>
            <input
              id="barcode-value"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="输入条形码内容..."
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]
                ${error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {error && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1" role="alert">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="barcode-format"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              格式
            </label>
            <select
              id="barcode-format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]"
            >
              {barcodeFormats.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="barcode-width"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                线宽: {width}px
              </label>
              <input
                id="barcode-width"
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
              />
            </div>
            <div>
              <label
                htmlFor="barcode-height"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                高度: {height}px
              </label>
              <input
                id="barcode-height"
                type="range"
                min="50"
                max="200"
                step="10"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="barcode-font-size"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                字体大小: {fontSize}px
              </label>
              <input
                id="barcode-font-size"
                type="range"
                min="8"
                max="24"
                step="2"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
              />
            </div>
            <div>
              <label
                htmlFor="barcode-margin"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                边距: {margin}px
              </label>
              <input
                id="barcode-margin"
                type="range"
                min="0"
                max="30"
                step="2"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="barcode-line-color"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                线条颜色
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="barcode-line-color"
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer touch-manipulation"
                />
                <input
                  type="text"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm min-h-[44px]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="barcode-background"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                背景颜色
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="barcode-background"
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer touch-manipulation"
                />
                <input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm min-h-[44px]"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="barcode-text"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              自定义文本 (可选)
            </label>
            <input
              id="barcode-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入自定义文本..."
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            预览
          </label>
          <div className="flex-1 flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 relative">
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10">
                <LoadingSpinner size="md" />
              </div>
            )}
            {error ? (
              <p className="text-red-500 dark:text-red-400 text-center px-4 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            ) : (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <canvas id="barcode-canvas" className="max-w-full max-h-full" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => downloadBarcode('png')}
              disabled={isGenerating}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed touch-manipulation touch-active min-h-[44px]"
            >
              下载 PNG
            </button>
            <button
              onClick={() => downloadBarcode('svg')}
              disabled={isGenerating}
              className="px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed touch-manipulation touch-active min-h-[44px]"
            >
              下载 SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}