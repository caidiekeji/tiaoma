'use client';

import { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';
import { showToast } from '@/lib/toast';
import { generateExtendedBarcode, ExtendedBarcodeFormat, EXTENDED_FORMATS } from '@/lib/extendedBarcode';
import QRCode from 'qrcode';

type GenerationType = 'barcode' | 'qrcode';

interface BatchItem {
  id: string;
  content: string;
  status: 'pending' | 'generating' | 'success' | 'error';
  preview?: string;
  error?: string;
}

export default function BatchGenerator() {
  const [generationType, setGenerationType] = useState<GenerationType>('qrcode');
  const [barcodeFormat, setBarcodeFormat] = useState<ExtendedBarcodeFormat>('qrcode');
  const [inputText, setInputText] = useState('');
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const parseInput = useCallback((text: string): string[] => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    return lines;
  }, []);

  const generateSingleItem = useCallback(
    async (content: string): Promise<{ success: boolean; data?: string; error?: string }> => {
      if (generationType === 'qrcode' || barcodeFormat === 'qrcode') {
        try {
          const dataUrl = await QRCode.toDataURL(content, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          });
          return { success: true, data: dataUrl };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : '生成失败' };
        }
      } else {
        return generateExtendedBarcode(content, barcodeFormat, {
          scale: 3,
          height: 10,
        });
      }
    },
    [generationType, barcodeFormat]
  );

  const handleGenerate = useCallback(async () => {
    const contents = parseInput(inputText);
    if (contents.length === 0) {
      showToast('error', '请输入要生成的内容');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    const newItems: BatchItem[] = contents.map((content, index) => ({
      id: `item-${index}`,
      content,
      status: 'pending',
    }));
    setItems(newItems);

    for (let i = 0; i < newItems.length; i++) {
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: 'generating' } : item
        )
      );

      const result = await generateSingleItem(newItems[i].content);

      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i
            ? {
                ...item,
                status: result.success ? 'success' : 'error',
                preview: result.data,
                error: result.error,
              }
            : item
        )
      );

      setProgress(Math.round(((i + 1) / newItems.length) * 100));
    }

    setIsGenerating(false);
    showToast('success', `成功生成 ${contents.length} 个码`);
  }, [inputText, parseInput, generateSingleItem]);

  const handleDownloadAll = useCallback(async () => {
    const successItems = items.filter((item) => item.status === 'success' && item.preview);
    if (successItems.length === 0) {
      showToast('error', '没有可下载的内容');
      return;
    }

    if (successItems.length === 1) {
      const item = successItems[0];
      if (item.preview) {
        saveAs(item.preview, `${item.content.slice(0, 20)}.png`);
      }
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder('batch-codes');

    if (folder) {
      for (let i = 0; i < successItems.length; i++) {
        const item = successItems[i];
        if (item.preview) {
          const base64Data = item.preview.split(',')[1];
          const fileName = `${i + 1}-${item.content.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
          folder.file(fileName, base64Data, { base64: true });
        }
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `batch-codes-${Date.now()}.zip`);
    showToast('success', '下载完成');
  }, [items]);

  const handleClear = useCallback(() => {
    setInputText('');
    setItems([]);
    setProgress(0);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">批量生成</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          每行一个内容，批量生成条码或二维码
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              生成类型
            </label>
            <select
              value={generationType}
              onChange={(e) => setGenerationType(e.target.value as GenerationType)}
              className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="qrcode">二维码</option>
              <option value="barcode">条形码</option>
            </select>
          </div>

          {generationType === 'barcode' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                条码格式
              </label>
              <select
                value={barcodeFormat}
                onChange={(e) => setBarcodeFormat(e.target.value as ExtendedBarcodeFormat)}
                className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(EXTENDED_FORMATS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            输入内容（每行一个）
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="https://example.com&#10;https://example.org&#10;产品编号001&#10;产品编号002"
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            已输入 {parseInput(inputText).length} 项
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || parseInput(inputText).length === 0}
            className="flex-1 min-w-[120px] px-6 py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>生成中 {progress}%</span>
              </>
            ) : (
              '开始生成'
            )}
          </button>

          <button
            onClick={handleDownloadAll}
            disabled={items.filter((i) => i.status === 'success').length === 0}
            className="px-6 py-3 min-h-[44px] bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            下载全部 ({items.filter((i) => i.status === 'success').length})
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-3 min-h-[44px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            清空
          </button>
        </div>

        {isGenerating && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              生成结果
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    item.status === 'success'
                      ? 'border-green-500'
                      : item.status === 'error'
                      ? 'border-red-500'
                      : item.status === 'generating'
                      ? 'border-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {item.status === 'generating' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <LoadingSpinner size="md" />
                    </div>
                  )}
                  {item.status === 'success' && item.preview && (
                    <img
                      src={item.preview}
                      alt={item.content}
                      className="w-full h-full object-contain bg-white"
                    />
                  )}
                  {item.status === 'error' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 p-2">
                      <span className="text-xs text-red-600 dark:text-red-400 text-center">
                        {item.error || '生成失败'}
                      </span>
                    </div>
                  )}
                  {item.status === 'success' && item.preview && (
                    <button
                      onClick={() => {
                        saveAs(item.preview!, `${item.content.slice(0, 20)}.png`);
                      }}
                      className="absolute bottom-1 right-1 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      title="下载"
                    >
                      <svg
                        className="w-4 h-4 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Toast />
    </div>
  );
}
