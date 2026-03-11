'use client';

import { useState, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { toast } from '@/lib/toast';
import LoadingSpinner from './LoadingSpinner';

interface BatchGeneratorProps {
  className?: string;
}

export default function BatchGenerator({ className = '' }: BatchGeneratorProps) {
  const [type, setType] = useState<'barcode' | 'qrcode'>('barcode');
  const [format, setFormat] = useState('CODE128');
  const [data, setData] = useState('123456789012\n123456789013\n123456789014');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [margin, setMargin] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBatch = useCallback(async () => {
    if (!data.trim()) {
      toast.error('请输入批量数据');
      return;
    }

    setIsGenerating(true);

    try {
      const lines = data.split('\n').filter(line => line.trim());
      const zip = new JSZip();

      if (type === 'barcode') {
        for (let i = 0; i < lines.length; i++) {
          const value = lines[i].trim();
          const canvas = document.createElement('canvas');
          JsBarcode(canvas, value, {
            format,
            width,
            height,
            margin,
          });
          const dataURL = canvas.toDataURL('image/png');
          const blob = await (await fetch(dataURL)).blob();
          zip.file(`barcode-${i + 1}.png`, blob);
        }
      } else {
        for (let i = 0; i < lines.length; i++) {
          const value = lines[i].trim();
          const dataURL = await QRCode.toDataURL(value, {
            width: 300,
            margin: 4,
          });
          const blob = await (await fetch(dataURL)).blob();
          zip.file(`qrcode-${i + 1}.png`, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${type}-batch-${Date.now()}.zip`);
      toast.success(`成功生成 ${lines.length} 个${type === 'barcode' ? '条形码' : '二维码'}`);
    } catch (error) {
      console.error('批量生成失败:', error);
      toast.error('批量生成失败，请检查输入数据');
    } finally {
      setIsGenerating(false);
    }
  }, [type, format, data, width, height, margin]);

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
          批量生成
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          每行输入一个数据，批量生成条形码或二维码
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              类型
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setType('barcode')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all
                  ${type === 'barcode'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                条形码
              </button>
              <button
                onClick={() => setType('qrcode')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all
                  ${type === 'qrcode'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                二维码
              </button>
            </div>
          </div>

          {type === 'barcode' && (
            <div>
              <label
                htmlFor="batch-format"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                格式
              </label>
              <select
                id="batch-format"
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
        </div>

        {type === 'barcode' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="batch-width"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                线宽: {width}px
              </label>
              <input
                id="batch-width"
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
                htmlFor="batch-height"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                高度: {height}px
              </label>
              <input
                id="batch-height"
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
        )}

        <div>
          <label
            htmlFor="batch-data"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            批量数据 (每行一个)
          </label>
          <textarea
            id="batch-data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="输入批量数据，每行一个..."
            rows={8}
            className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none min-h-[150px]"
          />
        </div>

        <button
          onClick={generateBatch}
          disabled={isGenerating}
          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation touch-active min-h-[44px]"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" />
              生成中...
            </>
          ) : (
            '批量生成并下载'
          )}
        </button>

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>使用说明：</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li>每行输入一个数据，支持多行</li>
            <li>条形码：输入数字或字母，根据选择的格式要求</li>
            <li>二维码：输入任意文本或URL</li>
            <li>生成后会下载一个包含所有图片的ZIP文件</li>
          </ul>
        </div>
      </div>
    </div>
  );
}