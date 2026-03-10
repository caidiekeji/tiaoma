import { toast } from './toast';

export interface ClipboardResult {
  success: boolean;
  error?: string;
}

export async function copyTextToClipboard(text: string): Promise<ClipboardResult> {
  try {
    if (!navigator.clipboard) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (!successful) {
        return { success: false, error: '复制失败' };
      }

      return { success: true };
    }

    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '复制失败',
    };
  }
}

export async function copyImageToClipboard(dataUrl: string): Promise<ClipboardResult> {
  try {
    if (!navigator.clipboard || !navigator.clipboard.write) {
      return { success: false, error: '您的浏览器不支持复制图片功能' };
    }

    const response = await fetch(dataUrl);
    const blob = await response.blob();

    if (blob.type !== 'image/png') {
      return { success: false, error: '仅支持复制 PNG 格式图片' };
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '复制图片失败',
    };
  }
}

export async function copySVGToClipboard(svgString: string): Promise<ClipboardResult> {
  try {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });

    if (!navigator.clipboard || !navigator.clipboard.write) {
      return { success: false, error: '您的浏览器不支持复制图片功能' };
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '复制 SVG 失败',
    };
  }
}

export async function copyToClipboard(
  data: string,
  type: 'text' | 'image' | 'svg' = 'text',
  showSuccessToast: boolean = true
): Promise<boolean> {
  let result: ClipboardResult;

  switch (type) {
    case 'image':
      result = await copyImageToClipboard(data);
      break;
    case 'svg':
      result = await copySVGToClipboard(data);
      break;
    default:
      result = await copyTextToClipboard(data);
  }

  if (result.success) {
    if (showSuccessToast) {
      toast.success('已复制到剪贴板');
    }
    return true;
  } else {
    toast.error(result.error || '复制失败');
    return false;
  }
}
