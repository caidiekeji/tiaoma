import { Header } from "@/components/Header";
import BarcodeCard from "@/components/BarcodeCard";
import QRCard from "@/components/QRCard";
import BatchGenerator from "@/components/BatchGenerator";
import QRBeautifier from "@/components/QRBeautifier";
import LabelDesigner from "@/components/LabelDesigner";
import Tabs from "@/components/Tabs";

const tabs = [
  { id: "barcode", label: "条形码" },
  { id: "qrcode", label: "二维码" },
  { id: "batch", label: "批量生成" },
  { id: "beautify", label: "二维码美化" },
  { id: "designer", label: "标签设计" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full max-w-5xl">
        <Tabs tabs={tabs} defaultTab="barcode">
          <BarcodeCard
            title="条形码生成器"
            description="支持多种格式：Code128、Code39、EAN-13、DataMatrix、PDF417等"
            className="border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
          />
          <QRCard
            title="二维码生成器"
            description="输入文本或URL，自定义颜色、尺寸、纠错级别"
            className="border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
          />
          <BatchGenerator />
          <QRBeautifier />
          <LabelDesigner />
        </Tabs>
      </main>

      <footer className="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024 条码二维码生成器 · 使用 Next.js 和 Tailwind CSS 构建
          </p>
        </div>
      </footer>
    </div>
  );
}
