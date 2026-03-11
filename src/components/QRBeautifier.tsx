'use client';

import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { toast } from '@/lib/toast';
import LoadingSpinner from './LoadingSpinner';

interface QRBeautifierProps {
  className?: string;
}

export default function QRBeautifier({ className = '' }: QRBeautifierProps) {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(4);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoSize, setLogoSize] = useState(30);
  const [roundedCorners, setRoundedCorners] = useState(false);
  const [dotStyle, setDotStyle] = useState<'square' | 'circle'>('square');
  const [previewDataURL, setPreviewDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generatePreview = useCallback(async () => {
    if (!text.trim()) {
      setPreviewDataURL('');
      setError('');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const dataURL = await QRCode.toDataURL(text, {
        width: size,
        margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });

      // 这里可以添加更多美化功能，如添加logo、圆角等
      // 目前使用基本的QRCode生成
      setPreviewDataURL(dataURL);
    } catch (err) {
      setError(`生成失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [text, size, margin, darkColor, lightColor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generatePreview();
    }, 300);

    return () => clearTimeout(timer);
  }, [generatePreview]);

  const downloadQRCode = (format: 'png' | 'svg') => {
    if (!previewDataURL) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `qrcode-beautified-${Date.now()}.png`;
      link.href = previewDataURL;
      link.click();
      toast.success('PNG 下载成功');
    } else {
      // 生成 SVG
      QRCode.toString(text, {
        type: 'svg',
        width: size,
        margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      })
        .then((svg) => {
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `qrcode-beautified-${Date.now()}.svg`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.success('SVG 下载成功');
        })
        .catch((err) => {
          toast.error('生成 SVG 失败');
        });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-full ${className}`}>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          二维码美化
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          自定义二维码样式，添加logo，设置圆角等
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="beautify-text"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              二维码内容
            </label>
            <textarea
              id="beautify-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入URL或文本内容..."
              rows={4}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none min-h-[44px]
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
              htmlFor="beautify-size"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              尺寸: {size}px
            </label>
            <input
              id="beautify-size"
              type="range"
              min="100"
              max="500"
              step="10"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
            />
          </div>

          <div>
            <label
              htmlFor="beautify-margin"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              边距: {margin}
            </label>
            <input
              id="beautify-margin"
              type="range"
              min="0"
              max="10"
              step="1"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="beautify-dark-color"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                前景色
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="beautify-dark-color"
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
                htmlFor="beautify-light-color"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                背景色
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="beautify-light-color"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              点样式
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setDotStyle('square')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all
                  ${dotStyle === 'square'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                方形
              </button>
              <button
                onClick={() => setDotStyle('circle')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all
                  ${dotStyle === 'circle'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                圆形
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="beautify-rounded"
              type="checkbox"
              checked={roundedCorners}
              onChange={(e) => setRoundedCorners(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="beautify-rounded"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              圆角
            </label>
          </div>

          <div>
            <label
              htmlFor="beautify-logo"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              添加 Logo (可选)
            </label>
            <input
              id="beautify-logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            {logo && (
              <div className="mt-2">
                <label
                  htmlFor="beautify-logo-size"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Logo 大小: {logoSize}%
                </label>
                <input
                  id="beautify-logo-size"
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
                />
              </div>
            )}
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
            ) : previewDataURL ? (
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

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => downloadQRCode('png')}
              disabled={!previewDataURL || isGenerating}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed touch-manipulation touch-active min-h-[44px]"
            >
              下载 PNG
            </button>
            <button
              onClick={() => downloadQRCode('svg')}
              disabled={!previewDataURL || isGenerating}
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