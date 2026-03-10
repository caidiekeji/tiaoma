'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';
import { showToast } from '@/lib/toast';

type DotStyle = 'square' | 'rounded' | 'dots';
type CornerStyle = 'square' | 'rounded' | 'extra-rounded';

interface QRStyleOptions {
  width: number;
  margin: number;
  darkColor: string;
  lightColor: string;
  useGradient: boolean;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: 'horizontal' | 'vertical' | 'diagonal';
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  logoUrl: string | null;
  logoSize: number;
  logoMargin: number;
  logoBackgroundColor: string;
}

export default function QRBeautifier() {
  const [text, setText] = useState('https://example.com');
  const [preview, setPreview] = useState<string | null>(null);
  const [svgPreview, setSvgPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState<QRStyleOptions>({
    width: 300,
    margin: 4,
    darkColor: '#000000',
    lightColor: '#ffffff',
    useGradient: false,
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    gradientDirection: 'diagonal',
    dotStyle: 'square',
    cornerStyle: 'square',
    logoUrl: null,
    logoSize: 0.3,
    logoMargin: 4,
    logoBackgroundColor: '#ffffff',
  });

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setOptions((prev) => ({
          ...prev,
          logoUrl: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeLogo = useCallback(() => {
    setLogoFile(null);
    setOptions((prev) => ({
      ...prev,
      logoUrl: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const generateQRCode = useCallback(async () => {
    if (!text.trim()) {
      setPreview(null);
      setSvgPreview(null);
      return;
    }

    setIsLoading(true);
    try {
      const qrOptions: QRCode.QRCodeToDataURLOptions = {
        width: options.width,
        margin: options.margin,
        color: {
          dark: options.useGradient ? options.gradientStart : options.darkColor,
          light: options.lightColor,
        },
        errorCorrectionLevel: options.logoUrl ? 'H' : 'M',
      };

      const dataUrl = await QRCode.toDataURL(text, qrOptions);
      setPreview(dataUrl);

      const svg = await QRCode.toString(text, {
        ...qrOptions,
        type: 'svg',
      });
      setSvgPreview(svg);
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : '生成失败');
    }
    setIsLoading(false);
  }, [text, options]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQRCode();
    }, 300);
    return () => clearTimeout(timer);
  }, [generateQRCode]);

  const downloadPNG = useCallback(() => {
    if (!preview) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = options.width;
      canvas.height = options.width;

      if (options.useGradient) {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          options.gradientDirection === 'horizontal'
            ? options.width
            : options.gradientDirection === 'vertical'
            ? 0
            : options.width,
          options.gradientDirection === 'horizontal'
            ? 0
            : options.gradientDirection === 'vertical'
            ? options.width
            : options.width
        );
        gradient.addColorStop(0, options.gradientStart);
        gradient.addColorStop(1, options.gradientEnd);
        ctx.fillStyle = options.lightColor;
        ctx.fillRect(0, 0, options.width, options.width);
      }

      ctx.drawImage(img, 0, 0);

      if (options.logoUrl) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          const logoSize = options.width * options.logoSize;
          const logoX = (options.width - logoSize) / 2;
          const logoY = (options.width - logoSize) / 2;
          const margin = options.logoMargin;
          const bgSize = logoSize + margin * 2;
          const bgX = logoX - margin;
          const bgY = logoY - margin;

          ctx.fillStyle = options.logoBackgroundColor;
          ctx.beginPath();
          ctx.roundRect(bgX, bgY, bgSize, bgSize, 8);
          ctx.fill();

          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

          saveAs(canvas.toDataURL('image/png'), 'beautified-qrcode.png');
        };
        logoImg.src = options.logoUrl;
      } else {
        saveAs(canvas.toDataURL('image/png'), 'beautified-qrcode.png');
      }
    };
    img.src = preview;
  }, [preview, options]);

  const downloadSVG = useCallback(() => {
    if (!svgPreview) return;
    const blob = new Blob([svgPreview], { type: 'image/svg+xml' });
    saveAs(blob, 'beautified-qrcode.svg');
  }, [svgPreview]);

  const presetColors = [
    { name: '经典黑白', dark: '#000000', light: '#ffffff' },
    { name: '深蓝', dark: '#1e3a8a', light: '#ffffff' },
    { name: '翠绿', dark: '#059669', light: '#ffffff' },
    { name: '紫罗兰', dark: '#7c3aed', light: '#ffffff' },
    { name: '玫红', dark: '#db2777', light: '#ffffff' },
    { name: '橙色', dark: '#ea580c', light: '#ffffff' },
  ];

  const gradientPresets = [
    { name: '日落', start: '#f97316', end: '#ec4899' },
    { name: '海洋', start: '#0ea5e9', end: '#6366f1' },
    { name: '森林', start: '#22c55e', end: '#14b8a6' },
    { name: '紫金', start: '#a855f7', end: '#ec4899' },
    { name: '极光', start: '#06b6d4', end: '#8b5cf6' },
    { name: '火焰', start: '#f59e0b', end: '#ef4444' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">二维码美化</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          自定义颜色、渐变、Logo，打造个性化二维码
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              内容
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入文本或URL"
              className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                尺寸: {options.width}px
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={options.width}
                onChange={(e) => setOptions((prev) => ({ ...prev, width: parseInt(e.target.value) }))}
                className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                边距: {options.margin}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={options.margin}
                onChange={(e) => setOptions((prev) => ({ ...prev, margin: parseInt(e.target.value) }))}
                className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              预设配色
            </label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      darkColor: preset.dark,
                      lightColor: preset.light,
                      useGradient: false,
                    }))
                  }
                  className="px-3 py-1.5 text-xs rounded-full border border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                  style={{
                    backgroundColor: preset.light,
                    color: preset.dark,
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useGradient"
              checked={options.useGradient}
              onChange={(e) => setOptions((prev) => ({ ...prev, useGradient: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="useGradient" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              使用渐变色
            </label>
          </div>

          {options.useGradient && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  渐变预设
                </label>
                <div className="flex flex-wrap gap-2">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() =>
                        setOptions((prev) => ({
                          ...prev,
                          gradientStart: preset.start,
                          gradientEnd: preset.end,
                        }))
                      }
                      className="px-3 py-1.5 text-xs rounded-full text-white transition-transform hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    起始色
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={options.gradientStart}
                      onChange={(e) => setOptions((prev) => ({ ...prev, gradientStart: e.target.value }))}
                      className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={options.gradientStart}
                      onChange={(e) => setOptions((prev) => ({ ...prev, gradientStart: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[44px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    结束色
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={options.gradientEnd}
                      onChange={(e) => setOptions((prev) => ({ ...prev, gradientEnd: e.target.value }))}
                      className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={options.gradientEnd}
                      onChange={(e) => setOptions((prev) => ({ ...prev, gradientEnd: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  渐变方向
                </label>
                <select
                  value={options.gradientDirection}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      gradientDirection: e.target.value as 'horizontal' | 'vertical' | 'diagonal',
                    }))
                  }
                  className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="horizontal">水平</option>
                  <option value="vertical">垂直</option>
                  <option value="diagonal">对角线</option>
                </select>
              </div>
            </>
          )}

          {!options.useGradient && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  前景色
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={options.darkColor}
                    onChange={(e) => setOptions((prev) => ({ ...prev, darkColor: e.target.value }))}
                    className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={options.darkColor}
                    onChange={(e) => setOptions((prev) => ({ ...prev, darkColor: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[44px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  背景色
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={options.lightColor}
                    onChange={(e) => setOptions((prev) => ({ ...prev, lightColor: e.target.value }))}
                    className="w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={options.lightColor}
                    onChange={(e) => setOptions((prev) => ({ ...prev, lightColor: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo
            </label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-3 min-h-[44px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                {logoFile ? '更换Logo' : '上传Logo'}
              </button>
              {logoFile && (
                <button
                  onClick={removeLogo}
                  className="px-4 py-3 min-h-[44px] bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                >
                  移除
                </button>
              )}
            </div>
            {options.logoUrl && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={options.logoUrl}
                    alt="Logo预览"
                    className="w-12 h-12 object-contain rounded bg-white"
                  />
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        大小: {Math.round(options.logoSize * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="0.4"
                        step="0.05"
                        value={options.logoSize}
                        onChange={(e) =>
                          setOptions((prev) => ({ ...prev, logoSize: parseFloat(e.target.value) }))
                        }
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        边距: {options.logoMargin}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={options.logoMargin}
                        onChange={(e) =>
                          setOptions((prev) => ({ ...prev, logoMargin: parseInt(e.target.value) }))
                        }
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-[240px] aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <LoadingSpinner size="md" />
            ) : preview ? (
              <img
                src={preview}
                alt="QR Code Preview"
                className="w-full h-full object-contain"
                style={{
                  background: options.useGradient
                    ? `linear-gradient(${options.gradientDirection === 'horizontal' ? '90deg' : options.gradientDirection === 'vertical' ? '180deg' : '135deg'}, ${options.gradientStart}, ${options.gradientEnd})`
                    : options.lightColor,
                }}
              />
            ) : (
              <span className="text-gray-400 dark:text-gray-500 text-sm">输入内容生成预览</span>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={downloadPNG}
              disabled={!preview}
              className="px-6 py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PNG
            </button>
            <button
              onClick={downloadSVG}
              disabled={!svgPreview}
              className="px-6 py-3 min-h-[44px] bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              SVG
            </button>
          </div>
        </div>
      </div>

      <Toast />
    </div>
  );
}
