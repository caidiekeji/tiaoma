'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  generateQRCodeDataURL,
  generateQRCodeSVG,
  ERROR_CORRECTION_LEVELS,
} from '@/lib/qrcode';
import { toast } from '@/lib/toast';
import { copyToClipboard } from '@/lib/clipboard';
import LoadingSpinner from './LoadingSpinner';
import type { QRCodeErrorCorrectionLevel } from '@/lib/types';

interface QRCardProps {
  title?: string;
  description?: string;
  defaultText?: string;
  defaultSize?: number;
  defaultMargin?: number;
  defaultDarkColor?: string;
  defaultLightColor?: string;
  defaultErrorCorrection?: QRCodeErrorCorrectionLevel;
  className?: string;
}

export default function QRCard({
  title = '二维码生成器',
  description = '输入文本或URL，自定义样式，生成二维码',
  defaultText = '',
  defaultSize = 300,
  defaultMargin = 4,
  defaultDarkColor = '#000000',
  defaultLightColor = '#ffffff',
  defaultErrorCorrection = 'M',
  className = '',
}: QRCardProps) {
  const [text, setText] = useState(defaultText);
  const [size, setSize] = useState(defaultSize);
  const [margin, setMargin] = useState(defaultMargin);
  const [darkColor, setDarkColor] = useState(defaultDarkColor);
  const [lightColor, setLightColor] = useState(defaultLightColor);
  const [errorCorrection, setErrorCorrection] =
    useState<QRCodeErrorCorrectionLevel>(defaultErrorCorrection);

  const [previewDataURL, setPreviewDataURL] = useState<string>('');
  const [previewSVG, setPreviewSVG] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const generatePreview = useCallback(async () => {
    if (!text.trim()) {
      setPreviewDataURL('');
      setPreviewSVG('');
      setError('');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const [dataURLResult, svgResult] = await Promise.all([
        generateQRCodeDataURL(text, {
          width: size,
          margin,
          color: {
            dark: darkColor,
            light: lightColor,
          },
          errorCorrectionLevel: errorCorrection,
        }),
        generateQRCodeSVG(text, {
          width: size,
          margin,
          color: {
            dark: darkColor,
            light: lightColor,
          },
          errorCorrectionLevel: errorCorrection,
        }),
      ]);

      if (dataURLResult.success && dataURLResult.data) {
        setPreviewDataURL(dataURLResult.data);
      } else if (dataURLResult.error) {
        setError(dataURLResult.error);
      }

      if (svgResult.success && svgResult.data) {
        setPreviewSVG(svgResult.data);
      } else if (svgResult.error) {
        setError(svgResult.error);
      }
    } catch (err) {
      setError(
        `生成失败: ${err instanceof Error ? err.message : '未知错误'}`
      );
    } finally {
      setIsGenerating(false);
    }
  }, [text, size, margin, darkColor, lightColor, errorCorrection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generatePreview();
    }, 300);

    return () => clearTimeout(timer);
  }, [generatePreview]);

  const downloadPNG = () => {
    if (!previewDataURL) return;

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = previewDataURL;
    link.click();
    toast.success('PNG 下载成功');
  };

  const downloadSVG = () => {
    if (!previewSVG) return;

    const blob = new Blob([previewSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('SVG 下载成功');
  };

  const handleCopyImage = async () => {
    if (!previewDataURL) return;
    await copyToClipboard(previewDataURL, 'image');
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-full ${className}`}
    >
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
              htmlFor="qr-text"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              二维码内容
            </label>
            <textarea
              id="qr-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入URL或文本内容..."
              rows={4}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none min-h-[44px]
                ${
                  error
                    ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
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
              htmlFor="qr-size"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              尺寸: {size}px
            </label>
            <input
              id="qr-size"
              type="range"
              min="100"
              max="500"
              step="10"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>100px</span>
              <span>500px</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="qr-margin"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              边距: {margin}
            </label>
            <input
              id="qr-margin"
              type="range"
              min="0"
              max="10"
              step="1"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="qr-dark-color"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                前景色
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-dark-color"
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer touch-manipulation"
                />
                <input
                  type="text"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="qr-light-color"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                背景色
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-light-color"
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer touch-manipulation"
                />
                <input
                  type="text"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm min-h-[44px]"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="qr-error-correction"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              纠错级别
            </label>
            <select
              id="qr-error-correction"
              value={errorCorrection}
              onChange={(e) =>
                setErrorCorrection(e.target.value as QRCodeErrorCorrectionLevel)
              }
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]"
            >
              {Object.entries(ERROR_CORRECTION_LEVELS).map(([level, desc]) => (
                <option key={level} value={level}>
                  {level} - {desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            预览
          </label>
          <div
            ref={previewRef}
            className="flex-1 flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 relative"
          >
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
            ) : previewDataURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewDataURL}
                alt="QR Code Preview"
                className="max-w-full max-h-full"
                style={{ width: Math.min(size, 400), height: 'auto' }}
              />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-center">
                输入内容后预览二维码
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <button
              onClick={handleCopyImage}
              disabled={!previewDataURL}
              className="px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed touch-manipulation touch-active min-h-[44px]"
            >
              复制图片
            </button>
            <button
              onClick={downloadPNG}
              disabled={!previewDataURL}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed touch-manipulation touch-active min-h-[44px]"
            >
              下载 PNG
            </button>
            <button
              onClick={downloadSVG}
              disabled={!previewSVG}
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
