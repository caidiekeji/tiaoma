import { toast } from './toast';


export async function copyToClipboard(text: string, type: 'text' | 'image' = 'text'): Promise<boolean> {
  try {
    if (type === 'image') {
      // 处理图片复制
      const blob = await (await fetch(text)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      toast.success('图片已复制到剪贴板');
    } else {
      // 处理文本复制
      await navigator.clipboard.writeText(text);
      toast.success('文本已复制到剪贴板');
    }
    return true;
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    toast.error('复制失败，请手动复制');
    return false;
  }
}

export async function readFromClipboard(): Promise<string | null> {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('从剪贴板读取失败:', error);
    return null;
  }
}