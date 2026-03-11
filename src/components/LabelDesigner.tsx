'use client';

import { useState, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { toast } from '@/lib/toast';
import LoadingSpinner from './LoadingSpinner';

interface LabelDesignerProps {
  className?: string;
}

export default function LabelDesigner({ className = '' }: LabelDesignerProps) {
  const [labelType, setLabelType] = useState<'barcode' | 'qrcode'>('barcode');
  const [format, setFormat] = useState('CODE128');
  const [value, setValue] = useState('123456789012');
  const [labelWidth, setLabelWidth] = useState(200);
  const [labelHeight, setLabelHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const [text, setText] = useState('产品标签');
  const [fontSize, setFontSize] = useState(12);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLabel = useCallback(() => {
    if (!value.trim()) {
      toast.error('请输入条形码或二维码内容');
      return;
    }

    setIsGenerating(true);

    try {
      if (labelType === 'barcode') {
        const canvas = document.getElementById('label-barcode') as HTMLCanvasElement;
        if (canvas) {
          JsBarcode(canvas, value, {
            format,
            width: 2,
            height: 60,
            margin: 5,
          });
        }
      } else {
        const canvas = document.getElementById('label-qrcode') as HTMLCanvasElement;
        if (canvas) {
          QRCode.toCanvas(canvas, value, {
            width: 80,
            margin: 2,
          });
        }
      }
    } catch (error) {
      console.error('生成标签失败:', error);
      toast.error('生成标签失败');
    } finally {
      setIsGenerating(false);
    }
  }, [labelType, format, value]);

  const downloadLabel = async () => {
    const labelElement = document.getElementById('label-preview');
    if (!labelElement) return;

    try {
      const canvas = await html2canvas(labelElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `label-${Date.now()}.png`);
          toast.success('标签下载成功');
        }
      });
    } catch (error) {
      console.error('下载标签失败:', error);
      toast.error('下载标签失败');
    }
  };

  const barcodeFormats = [
    { value: 'CODE128', label: 'CODE128' },
    { value: 'CODE39', label: 'CODE39' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'EAN8', label: 'EAN-8' },
    { value: 'UPC', label: 'UPC' },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-full ${className}`}>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          标签设计
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          设计并生成商品标签
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标签类型
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setLabelType('barcode')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all
                  ${labelType === 'barcode'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                条形码
              </button>
              <button
                onClick={() => setLabelType('qrcode')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all
                  ${labelType === 'qrcode'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                二维码
              </button>
            </div>
          </div>

          {labelType === 'barcode' && (
            <div>
              <label
                htmlFor="label-format"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                格式
              </label>
              <select
                id="label-format"
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
          )}

          <div>
            <label
              htmlFor="label-value"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {labelType === 'barcode' ? '条形码内容' : '二维码内容'}
            </label>
            <input
              id="label-value"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`输入${labelType === 'barcode' ? '条形码' : '二维码'}内容...`}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="label-width"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                标签宽度: {labelWidth}px
              </label>
              <input
                id="label-width"
                type="range"
                min="100"
                max="400"
                step="10"
                value={labelWidth}
                onChange={(e) => setLabelWidth(Number(e.target.value))}
                className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
              />
            </div>
            <div>
              <label
                htmlFor="label-height"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                标签高度: {labelHeight}px
              </label>
              <input
                id="label-height"
                type="range"
                min="50"
                max="200"
                step="10"
                value={labelHeight}
                onChange={(e) => setLabelHeight(Number(e.target.value))}
                className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="label-show-text"
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="label-show-text"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              显示文本
            </label>
          </div>

          {showText && (
            <div>
              <label
                htmlFor="label-text"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                文本内容
              </label>
              <input
                id="label-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入文本内容..."
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]"
              />
            </div>
          )}

          {showText && (
            <div>
              <label
                htmlFor="label-font-size"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                字体大小: {fontSize}px
              </label>
              <input
                id="label-font-size"
                type="range"
                min="8"
                max="24"
                step="2"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 touch-manipulation"
              />
            </div>
          )}

          <button
            onClick={generateLabel}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation touch-active min-h-[44px]"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                生成中...
              </>
            ) : (
              '生成标签'
            )}
          </button>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            预览
          </label>
          <div className="flex-1 flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div
              id="label-preview"
              style={{
                width: `${labelWidth}px`,
                height: `${labelHeight}px`,
                border: '1px solid #ddd',
                padding: '10px',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {labelType === 'barcode' ? (
                <canvas id="label-barcode" style={{ marginBottom: showText ? '10px' : '0' }} />
              ) : (
                <canvas id="label-qrcode" style={{ marginBottom: showText ? '10px' : '0' }} />
              )}
              {showText && (
                <div style={{ fontSize: `${fontSize}px`, textAlign: 'center' }}>
                  {text}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={downloadLabel}
            disabled={isGenerating}
            className="mt-4 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed touch-manipulation touch-active min-h-[44px]"
          >
            下载标签
          </button>
        </div>
      </div>
    </div>
  );
}