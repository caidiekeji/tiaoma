'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import {
  Star, Heart, Circle, Square, Triangle, Diamond, Check, X,
  Phone, Mail, MapPin, User, Calendar, Clock, FileText, Image, Link,
  Printer, Barcode, Tag, Percent, DollarSign,
  Globe, ShoppingBag, ShoppingCart, Package,
  Truck, CreditCard, Wallet, Receipt, Gift,
  Sun, Moon, Cloud, CloudRain, Thermometer, Zap,
  Play, Pause, XCircle, Camera, Video, Music,
  CheckCircle, AlertCircle, Info, HelpCircle, ThumbsUp, ThumbsDown, MessageCircle,
  Send, Bookmark, Trash2, Copy, Download,
  Share2, Layers, Search, Settings,
  Menu, Move, QrCode,
  Hexagon, Octagon, Pentagon,
  Folder, Archive, Scan,
  Box, Boxes, Container,
  PackageOpen, PackagePlus, PackageMinus, PackageSearch, PackageX,
  ShieldCheck, ShieldAlert, Shield, ShieldQuestion,
  Recycle, Leaf, TreePine, Droplets, Wind,
  Scale, Ruler, Weight,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ArrowUpCircle, ArrowDownCircle, ArrowLeftCircle, ArrowRightCircle,
  ArrowUpFromLine, ArrowDownFromLine,
 Snowflake, Droplet, Flame, Ban, Hand, AlertTriangle,
  LucideIcon} from 'lucide-react';

type ElementType = 'text' | 'title' | 'shape' | 'line' | 'icon' | 'qrcode' | 'barcode';

interface LabelElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    textAlign?: 'left' | 'center' | 'right';
    rotation?: number;
    opacity?: number;
    shapeType?: 'rect' | 'circle' | 'triangle' | 'diamond';
    barcodeFormat?: string;
    qrColor?: string;
    qrBgColor?: string;
    showText?: boolean;
  };
}

interface TemplateElement {
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Partial<LabelElement['style']>;
}

interface IconItem {
  name: string;
  icon: LucideIcon;
}

const ICON_CATEGORIES: { name: string; icons: IconItem[] }[] = [
  { name: '常用', icons: [{ name: '用户', icon: User }, { name: '电话', icon: Phone }, { name: '邮件', icon: Mail }, { name: '位置', icon: MapPin }, { name: '日历', icon: Calendar }, { name: '时钟', icon: Clock }, { name: '搜索', icon: Search }, { name: '设置', icon: Settings }, { name: '菜单', icon: Menu }] },
  { name: '电商', icons: [{ name: '购物车', icon: ShoppingCart }, { name: '购物袋', icon: ShoppingBag }, { name: '包裹', icon: Package }, { name: '卡车', icon: Truck }, { name: '信用卡', icon: CreditCard }, { name: '钱包', icon: Wallet }, { name: '收据', icon: Receipt }, { name: '礼物', icon: Gift }, { name: '标签', icon: Tag }, { name: '折扣', icon: Percent }, { name: '美元', icon: DollarSign }, { name: '条码', icon: Barcode }] },
  { name: '包装', icons: [{ name: '盒子', icon: Box }, { name: '包裹', icon: Package }, { name: '多箱', icon: Boxes }, { name: '容器', icon: Container }, { name: '开箱', icon: PackageOpen }, { name: '装箱', icon: PackagePlus }, { name: '拆箱', icon: PackageMinus }, { name: '查件', icon: PackageSearch }, { name: '退件', icon: PackageX }, { name: '存档', icon: Archive }] },
  { name: '认证', icons: [{ name: '认证', icon: ShieldCheck }, { name: '警告盾', icon: ShieldAlert }, { name: '盾牌', icon: Shield }, { name: '疑问盾', icon: ShieldQuestion }, { name: '勾选圆', icon: CheckCircle }, { name: '警告圆', icon: AlertCircle }] },
 { name: '物流', icons: [{ name: '向上', icon: ArrowUp }, { name: '向下', icon: ArrowDown }, { name: '向左', icon: ArrowLeft }, { name: '向右', icon: ArrowRight }, { name: '向上圆', icon: ArrowUpCircle }, { name: '向下圆', icon: ArrowDownCircle }, { name: '向左圆', icon: ArrowLeftCircle }, { name: '向右圆', icon: ArrowRightCircle }, { name: '向上线', icon: ArrowUpFromLine }, { name: '向下线', icon: ArrowDownFromLine }, { name: '易碎', icon: Droplet }, { name: '勿压', icon: Ban }, { name: '防火', icon: Flame }, { name: '防潮', icon: Droplets }, { name: '小心', icon: AlertTriangle }, { name: '禁止', icon: XCircle }, { name: '手提', icon: Hand }] },
  { name: '计量', icons: [{ name: '天平', icon: Scale }, { name: '直尺', icon: Ruler }, { name: '重量', icon: Weight }] },
  { name: '通讯', icons: [{ name: '发送', icon: Send }, { name: '消息', icon: MessageCircle }, { name: '书签', icon: Bookmark }, { name: '分享', icon: Share2 }, { name: '链接', icon: Link }, { name: '全球', icon: Globe }] },
  { name: '状态', icons: [{ name: '勾选', icon: Check }, { name: '关闭', icon: X }, { name: '勾选圆', icon: CheckCircle }, { name: '关闭圆', icon: XCircle }, { name: '警告', icon: AlertCircle }, { name: '信息', icon: Info }, { name: '帮助', icon: HelpCircle }, { name: '点赞', icon: ThumbsUp }, { name: '踩', icon: ThumbsDown }] },
  { name: '媒体', icons: [{ name: '图片', icon: Image }, { name: '相机', icon: Camera }, { name: '视频', icon: Video }, { name: '音乐', icon: Music }, { name: '播放', icon: Play }, { name: '暂停', icon: Pause }] },
  { name: '天气', icons: [{ name: '太阳', icon: Sun }, { name: '月亮', icon: Moon }, { name: '云', icon: Cloud }, { name: '雨', icon: CloudRain }, { name: '温度', icon: Thermometer }, { name: '闪电', icon: Zap }] },
  { name: '形状', icons: [{ name: '圆形', icon: Circle }, { name: '方形', icon: Square }, { name: '三角形', icon: Triangle }, { name: '菱形', icon: Diamond }, { name: '六边形', icon: Hexagon }, { name: '星形', icon: Star }, { name: '心形', icon: Heart }, { name: '五边形', icon: Pentagon }, { name: '八边形', icon: Octagon }] },
  { name: '办公', icons: [{ name: '文件', icon: FileText }, { name: '文件夹', icon: Folder }, { name: '归档', icon: Archive }, { name: '打印', icon: Printer }, { name: '扫描', icon: Scan }, { name: '复制', icon: Copy }] },
];

const SHAPE_TYPES = [{ name: '矩形', type: 'rect' }, { name: '圆形', type: 'circle' }, { name: '三角形', type: 'triangle' }, { name: '菱形', type: 'diamond' }];
const BARCODE_FORMATS = [{ name: 'CODE128', value: 'CODE128' }, { name: 'CODE39', value: 'CODE39' }, { name: 'EAN13', value: 'EAN13' }, { name: 'EAN8', value: 'EAN8' }, { name: 'UPC', value: 'UPC' }, { name: 'ITF14', value: 'ITF14' }];
const PRESET_COLORS = ['#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E'];

const TEMPLATES: { name: string; width: number; height: number; bg: string; elements?: TemplateElement[] }[] = [
  { name: '商品标签', width: 300, height: 200, bg: '#ffffff', elements: [
    { type: 'title' as const, x: 20, y: 15, width: 260, height: 32, content: '商品名称', style: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' as const } },
    { type: 'shape' as const, x: 20, y: 55, width: 260, height: 2, style: { backgroundColor: '#3b82f6', shapeType: 'rect' as const } },
    { type: 'text' as const, x: 20, y: 70, width: 120, height: 24, content: '规格：500g', style: { fontSize: 12, color: '#6b7280', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 95, width: 120, height: 24, content: '产地：中国', style: { fontSize: 12, color: '#6b7280', textAlign: 'left' as const } },
    { type: 'text' as const, x: 150, y: 70, width: 130, height: 28, content: '¥99.00', style: { fontSize: 20, fontWeight: 'bold', color: '#ef4444', textAlign: 'right' as const } },
    { type: 'barcode' as const, x: 80, y: 130, width: 140, height: 50, content: '123456789012', style: { barcodeFormat: 'CODE128', color: '#000000', showText: true } },
  ]},
  { name: '价签', width: 200, height: 120, bg: '#fffde7', elements: [
    { type: 'text' as const, x: 10, y: 10, width: 180, height: 24, content: '特价商品', style: { fontSize: 14, fontWeight: 'bold', color: '#ef4444', textAlign: 'center' as const } },
    { type: 'text' as const, x: 10, y: 45, width: 180, height: 40, content: '¥19.9', style: { fontSize: 32, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' as const } },
    { type: 'text' as const, x: 10, y: 90, width: 180, height: 20, content: '限时优惠', style: { fontSize: 11, color: '#6b7280', textAlign: 'center' as const } },
  ]},
  { name: '名片', width: 350, height: 200, bg: '#ffffff', elements: [
    { type: 'title' as const, x: 20, y: 20, width: 150, height: 32, content: '张三', style: { fontSize: 22, fontWeight: 'bold', color: '#1f2937', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 50, width: 150, height: 24, content: '高级工程师', style: { fontSize: 12, color: '#6b7280', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 80, width: 150, height: 24, content: '某某科技有限公司', style: { fontSize: 11, color: '#9ca3af', textAlign: 'left' as const } },
    { type: 'shape' as const, x: 20, y: 115, width: 310, height: 1, style: { backgroundColor: '#e5e7eb', shapeType: 'rect' as const } },
    { type: 'text' as const, x: 20, y: 130, width: 200, height: 20, content: '电话：138-0000-0000', style: { fontSize: 11, color: '#4b5563', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 150, width: 200, height: 20, content: '邮箱：zhangsan@example.com', style: { fontSize: 11, color: '#4b5563', textAlign: 'left' as const } },
    { type: 'qrcode' as const, x: 260, y: 120, width: 70, height: 70, content: 'https://example.com', style: { qrColor: '#1f2937', qrBgColor: '#ffffff' } },
  ]},
  { name: '吊牌', width: 150, height: 250, bg: '#f5f5f5', elements: [
    { type: 'shape' as const, x: 60, y: 10, width: 30, height: 30, style: { backgroundColor: '#1f2937', shapeType: 'circle' as const } },
    { type: 'title' as const, x: 15, y: 55, width: 120, height: 28, content: '品牌名称', style: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' as const } },
    { type: 'shape' as const, x: 15, y: 90, width: 120, height: 1, style: { backgroundColor: '#d1d5db', shapeType: 'rect' as const } },
    { type: 'text' as const, x: 15, y: 100, width: 120, height: 20, content: '品名：T恤', style: { fontSize: 10, color: '#4b5563', textAlign: 'center' as const } },
    { type: 'text' as const, x: 15, y: 120, width: 120, height: 20, content: '尺码：L', style: { fontSize: 10, color: '#4b5563', textAlign: 'center' as const } },
    { type: 'text' as const, x: 15, y: 140, width: 120, height: 20, content: '颜色：白色', style: { fontSize: 10, color: '#4b5563', textAlign: 'center' as const } },
    { type: 'text' as const, x: 15, y: 160, width: 120, height: 20, content: '材质：棉', style: { fontSize: 10, color: '#4b5563', textAlign: 'center' as const } },
    { type: 'shape' as const, x: 15, y: 185, width: 120, height: 1, style: { backgroundColor: '#d1d5db', shapeType: 'rect' as const } },
    { type: 'text' as const, x: 15, y: 195, width: 120, height: 24, content: '¥199.00', style: { fontSize: 14, fontWeight: 'bold', color: '#ef4444', textAlign: 'center' as const } },
    { type: 'qrcode' as const, x: 45, y: 220, width: 60, height: 60, content: '产品追溯码', style: { qrColor: '#1f2937', qrBgColor: '#ffffff' } },
  ]},
  { name: '快递单', width: 400, height: 280, bg: '#ffffff', elements: [
    { type: 'title' as const, x: 20, y: 15, width: 360, height: 28, content: '快递面单', style: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' as const } },
    { type: 'shape' as const, x: 20, y: 50, width: 360, height: 1, style: { backgroundColor: '#000000', shapeType: 'rect' as const } },
    { type: 'text' as const, x: 20, y: 60, width: 80, height: 20, content: '收件人：', style: { fontSize: 11, fontWeight: 'bold', color: '#1f2937', textAlign: 'left' as const } },
    { type: 'text' as const, x: 90, y: 60, width: 200, height: 20, content: '李四 138-0000-0000', style: { fontSize: 11, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 80, width: 80, height: 20, content: '地址：', style: { fontSize: 11, fontWeight: 'bold', color: '#1f2937', textAlign: 'left' as const } },
    { type: 'text' as const, x: 90, y: 80, width: 290, height: 20, content: '北京市朝阳区xxx路xxx号xxx室', style: { fontSize: 11, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'shape' as const, x: 20, y: 105, width: 360, height: 1, style: { backgroundColor: '#d1d5db', shapeType: 'rect' as const } },
    { type: 'text' as const, x: 20, y: 115, width: 80, height: 20, content: '寄件人：', style: { fontSize: 11, fontWeight: 'bold', color: '#1f2937', textAlign: 'left' as const } },
    { type: 'text' as const, x: 90, y: 115, width: 200, height: 20, content: '张三 139-0000-0000', style: { fontSize: 11, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'shape' as const, x: 20, y: 140, width: 360, height: 1, style: { backgroundColor: '#000000', shapeType: 'rect' as const } },
    { type: 'text' as const, x: 20, y: 150, width: 360, height: 50, content: '物品：服装 x1', style: { fontSize: 14, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'barcode' as const, x: 100, y: 200, width: 200, height: 60, content: 'SF1234567890', style: { barcodeFormat: 'CODE128', color: '#000000', showText: true } },
  ]},
  { name: '优惠券', width: 300, height: 150, bg: '#fff1f2', elements: [
    { type: 'title' as const, x: 20, y: 15, width: 260, height: 28, content: '限时优惠券', style: { fontSize: 16, fontWeight: 'bold', color: '#be123c', textAlign: 'center' as const } },
    { type: 'text' as const, x: 20, y: 50, width: 260, height: 45, content: '满100减20', style: { fontSize: 28, fontWeight: 'bold', color: '#e11d48', textAlign: 'center' as const } },
    { type: 'shape' as const, x: 20, y: 100, width: 260, height: 1, style: { backgroundColor: '#fecdd3', shapeType: 'rect' as const } },
    { type: 'text' as const, x: 20, y: 110, width: 260, height: 18, content: '有效期：2024.01.01 - 2024.12.31', style: { fontSize: 10, color: '#9f1239', textAlign: 'center' as const } },
    { type: 'text' as const, x: 20, y: 128, width: 260, height: 18, content: '全场通用 | 不可叠加使用', style: { fontSize: 9, color: '#881337', textAlign: 'center' as const } },
  ]},
  { name: '会员卡', width: 350, height: 200, bg: '#1e3a5f', elements: [
    { type: 'title' as const, x: 20, y: 20, width: 200, height: 28, content: '某某俱乐部', style: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 50, width: 200, height: 20, content: 'VIP会员卡', style: { fontSize: 12, color: '#fbbf24', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 90, width: 200, height: 28, content: '张三', style: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 120, width: 200, height: 20, content: '会员编号：VIP888888', style: { fontSize: 11, color: '#94a3b8', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 140, width: 200, height: 20, content: '有效期至：2025.12.31', style: { fontSize: 11, color: '#94a3b8', textAlign: 'left' as const } },
    { type: 'barcode' as const, x: 20, y: 165, width: 200, height: 25, content: 'VIP888888', style: { barcodeFormat: 'CODE128', color: '#ffffff', showText: false } },
    { type: 'qrcode' as const, x: 260, y: 60, width: 70, height: 70, content: 'MEMBER:VIP888888', style: { qrColor: '#ffffff', qrBgColor: '#1e3a5f' } },
  ]},
  { name: '入场券', width: 300, height: 120, bg: '#fef3c7', elements: [
    { type: 'title' as const, x: 15, y: 10, width: 180, height: 28, content: '2024音乐节', style: { fontSize: 18, fontWeight: 'bold', color: '#92400e', textAlign: 'left' as const } },
    { type: 'text' as const, x: 15, y: 40, width: 180, height: 20, content: 'VIP入场券', style: { fontSize: 12, fontWeight: 'bold', color: '#b45309', textAlign: 'left' as const } },
    { type: 'text' as const, x: 15, y: 65, width: 180, height: 18, content: '日期：2024.08.15 19:00', style: { fontSize: 10, color: '#78350f', textAlign: 'left' as const } },
    { type: 'text' as const, x: 15, y: 85, width: 180, height: 18, content: '座位：A区 12排 08座', style: { fontSize: 10, color: '#78350f', textAlign: 'left' as const } },
    { type: 'qrcode' as const, x: 220, y: 20, width: 65, height: 65, content: 'TICKET:20240815-A1208', style: { qrColor: '#92400e', qrBgColor: '#fef3c7' } },
    { type: 'text' as const, x: 220, y: 90, width: 65, height: 16, content: '扫码入场', style: { fontSize: 9, color: '#78350f', textAlign: 'center' as const } },
  ]},
  { name: '资产标签', width: 250, height: 100, bg: '#ffffff', elements: [
    { type: 'shape' as const, x: 10, y: 10, width: 230, height: 80, style: { backgroundColor: '#dbeafe', shapeType: 'rect' as const, borderRadius: 8 } },
    { type: 'text' as const, x: 20, y: 20, width: 100, height: 20, content: '固定资产', style: { fontSize: 12, fontWeight: 'bold', color: '#1e40af', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 42, width: 150, height: 18, content: '名称：笔记本电脑', style: { fontSize: 10, color: '#1e3a8a', textAlign: 'left' as const } },
    { type: 'text' as const, x: 20, y: 60, width: 150, height: 18, content: '编号：ZC-2024-0001', style: { fontSize: 10, color: '#1e3a8a', textAlign: 'left' as const } },
    { type: 'barcode' as const, x: 150, y: 25, width: 80, height: 50, content: 'ZC20240001', style: { barcodeFormat: 'CODE128', color: '#1e40af', showText: false } },
  ]},
  { name: '库存标签', width: 200, height: 120, bg: '#f0fdf4', elements: [
    { type: 'text' as const, x: 10, y: 10, width: 180, height: 24, content: '库存物资', style: { fontSize: 14, fontWeight: 'bold', color: '#166534', textAlign: 'center' as const } },
    { type: 'shape' as const, x: 10, y: 38, width: 180, height: 1, style: { backgroundColor: '#86efac', shapeType: 'rect' as const } },
    { type: 'text' as const, x: 15, y: 48, width: 170, height: 18, content: '品名：办公用品', style: { fontSize: 10, color: '#14532d', textAlign: 'left' as const } },
    { type: 'text' as const, x: 15, y: 66, width: 170, height: 18, content: '数量：100件', style: { fontSize: 10, color: '#14532d', textAlign: 'left' as const } },
    { type: 'text' as const, x: 15, y: 84, width: 170, height: 18, content: '库位：A-01-02', style: { fontSize: 10, color: '#14532d', textAlign: 'left' as const } },
    { type: 'barcode' as const, x: 40, y: 100, width: 120, height: 15, content: 'KC20240001', style: { barcodeFormat: 'CODE128', color: '#166534', showText: false } },
  ]},
  { name: '警示标签', width: 200, height: 150, bg: '#fef2f2', elements: [
    { type: 'shape' as const, x: 70, y: 10, width: 60, height: 60, style: { backgroundColor: '#fef2f2', shapeType: 'triangle' as const } },
    { type: 'text' as const, x: 90, y: 25, width: 20, height: 30, content: '!', style: { fontSize: 24, fontWeight: 'bold', color: '#dc2626', textAlign: 'center' as const } },
    { type: 'title' as const, x: 10, y: 80, width: 180, height: 24, content: '注意安全', style: { fontSize: 16, fontWeight: 'bold', color: '#dc2626', textAlign: 'center' as const } },
    { type: 'text' as const, x: 10, y: 108, width: 180, height: 18, content: '小心高温', style: { fontSize: 11, color: '#991b1b', textAlign: 'center' as const } },
    { type: 'text' as const, x: 10, y: 128, width: 180, height: 16, content: '请勿触摸', style: { fontSize: 10, color: '#7f1d1d', textAlign: 'center' as const } },
  ]},
  { name: '胸牌', width: 200, height: 280, bg: '#ffffff', elements: [
    { type: 'shape' as const, x: 0, y: 0, width: 200, height: 80, style: { backgroundColor: '#3b82f6', shapeType: 'rect' as const } },
    { type: 'title' as const, x: 10, y: 25, width: 180, height: 28, content: '技术大会', style: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' as const } },
    { type: 'text' as const, x: 10, y: 55, width: 180, height: 18, content: '2024.08.15', style: { fontSize: 10, color: '#bfdbfe', textAlign: 'center' as const } },
    { type: 'shape' as const, x: 60, y: 100, width: 80, height: 80, style: { backgroundColor: '#e5e7eb', shapeType: 'rect' as const, borderRadius: 8 } },
    { type: 'text' as const, x: 60, y: 130, width: 80, height: 20, content: '照片', style: { fontSize: 12, color: '#9ca3af', textAlign: 'center' as const } },
    { type: 'title' as const, x: 10, y: 195, width: 180, height: 28, content: '张三', style: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' as const } },
    { type: 'text' as const, x: 10, y: 225, width: 180, height: 20, content: '高级工程师', style: { fontSize: 12, color: '#6b7280', textAlign: 'center' as const } },
    { type: 'text' as const, x: 10, y: 250, width: 180, height: 18, content: '某某科技有限公司', style: { fontSize: 10, color: '#9ca3af', textAlign: 'center' as const } },
  ]},
  { name: '合格证', width: 180, height: 120, bg: '#ffffff', elements: [
    { type: 'shape' as const, x: 0, y: 0, width: 180, height: 30, style: { backgroundColor: '#22c55e', shapeType: 'rect' as const } },
    { type: 'title' as const, x: 10, y: 5, width: 160, height: 20, content: '产品合格证', style: { fontSize: 14, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' as const } },
    { type: 'text' as const, x: 10, y: 40, width: 160, height: 18, content: '产品名称：XXX', style: { fontSize: 10, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'text' as const, x: 10, y: 58, width: 160, height: 18, content: '检验员：01', style: { fontSize: 10, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'text' as const, x: 10, y: 76, width: 160, height: 18, content: '日期：2024.08.15', style: { fontSize: 10, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'qrcode' as const, x: 120, y: 40, width: 50, height: 50, content: 'QC:PASSED:20240815', style: { qrColor: '#166534', qrBgColor: '#ffffff' } },
    { type: 'text' as const, x: 10, y: 98, width: 160, height: 16, content: '检验合格，准予出厂', style: { fontSize: 9, color: '#16a34a', textAlign: 'center' as const } },
  ]},
  { name: '书籍标签', width: 150, height: 200, bg: '#faf5ff', elements: [
    { type: 'shape' as const, x: 0, y: 0, width: 150, height: 40, style: { backgroundColor: '#7c3aed', shapeType: 'rect' as const } },
    { type: 'title' as const, x: 10, y: 10, width: 130, height: 20, content: '图书借阅', style: { fontSize: 14, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' as const } },
    { type: 'text' as const, x: 10, y: 50, width: 130, height: 18, content: '书名：XXX', style: { fontSize: 10, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'text' as const, x: 10, y: 70, width: 130, height: 18, content: '编号：B20240001', style: { fontSize: 10, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'text' as const, x: 10, y: 90, width: 130, height: 18, content: '分类：计算机', style: { fontSize: 10, color: '#1f2937', textAlign: 'left' as const } },
    { type: 'barcode' as const, x: 25, y: 115, width: 100, height: 40, content: 'B20240001', style: { barcodeFormat: 'CODE128', color: '#5b21b6', showText: true } },
    { type: 'text' as const, x: 10, y: 165, width: 130, height: 16, content: '借阅日期', style: { fontSize: 9, color: '#7c3aed', textAlign: 'center' as const } },
    { type: 'shape' as const, x: 30, y: 182, width: 90, height: 12, style: { backgroundColor: '#e9d5ff', shapeType: 'rect' as const } },
  ]},
];

export default function LabelDesigner() {
  const [elements, setElements] = useState<LabelElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 280 });
  const [canvasBackground, setCanvasBackground] = useState('#ffffff');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateId = () => `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addElement = useCallback((type: ElementType, defaultProps?: Partial<LabelElement>) => {
    const newElement: LabelElement = {
      id: generateId(),
      type,
      x: 50,
      y: 50,
      width: type === 'line' ? 100 : type === 'title' ? 200 : type === 'text' ? 150 : type === 'qrcode' ? 80 : type === 'barcode' ? 150 : 48,
      height: type === 'line' ? 3 : type === 'title' ? 48 : type === 'text' ? 36 : type === 'qrcode' ? 80 : type === 'barcode' ? 50 : 48,
      content: type === 'title' ? '标题文字' : type === 'text' ? '文本内容' : type === 'qrcode' ? 'https://example.com' : type === 'barcode' ? '12345678' : '',
      style: {
        fontSize: type === 'title' ? 20 : 14,
        fontWeight: type === 'title' ? 'bold' : 'normal',
        color: '#1f2937',
        backgroundColor: type === 'shape' ? '#3b82f6' : 'transparent',
        borderColor: '#2563eb',
        borderWidth: type === 'line' ? 3 : 0,
        borderRadius: type === 'shape' ? 8 : 0,
        textAlign: 'center',
        rotation: 0,
        opacity: 1,
        shapeType: 'rect',
        barcodeFormat: 'CODE128',
        qrColor: '#000000',
        qrBgColor: '#ffffff',
        showText: true,
      },
      ...defaultProps,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<LabelElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates, style: { ...el.style, ...updates.style } } : el)));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
  }, []);

  const duplicateElement = useCallback((id: string) => {
    setElements((prev) => {
      const element = prev.find((el) => el.id === id);
      if (element) {
        return [...prev, { ...element, id: generateId(), x: element.x + 20, y: element.y + 20 }];
      }
      return prev;
    });
  }, []);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);
    const element = elements.find((el) => el.id === id);
    if (element && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - canvasRect.left - element.x, y: e.clientY - canvasRect.top - element.y });
    }
  }, [elements]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    updateElement(selectedId, { x: Math.max(0, Math.min(x, canvasSize.width - 20)), y: Math.max(0, Math.min(y, canvasSize.height - 20)) });
  }, [isDragging, selectedId, dragOffset, updateElement, canvasSize]);

  const handleCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedId(null);
    }
  }, []);

  const applyTemplate = useCallback((template: typeof TEMPLATES[0]) => {
    setCanvasSize({ width: template.width, height: template.height });
    setCanvasBackground(template.bg);
    if (template.elements) {
      const newElements: LabelElement[] = template.elements.map((el, index) => ({
        id: `template-${Date.now()}-${index}`,
        type: el.type,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        content: el.content || '',
        style: {
          fontSize: el.style?.fontSize || 14,
          fontWeight: el.style?.fontWeight || 'normal',
          color: el.style?.color || '#1f2937',
          backgroundColor: el.style?.backgroundColor || 'transparent',
          borderColor: '#2563eb',
          borderWidth: 0,
          borderRadius: el.style?.borderRadius || 0,
          textAlign: el.style?.textAlign || 'center',
          rotation: 0,
          opacity: 1,
          shapeType: el.style?.shapeType || 'rect',
          barcodeFormat: el.style?.barcodeFormat || 'CODE128',
          qrColor: el.style?.qrColor || '#000000',
          qrBgColor: el.style?.qrBgColor || '#ffffff',
          showText: el.style?.showText ?? true,
        },
      }));
      setElements(newElements);
      setSelectedId(null);
    }
  }, []);

  const exportAsImage = useCallback(async () => {
    if (!canvasRef.current) return;
    if (elements.length === 0) {
      alert('请先添加元素再导出');
      return;
    }

    const originalBorder = canvasRef.current.style.border;
    canvasRef.current.style.border = 'none';
    
    try {
      // 暂时移除选择边框
      const selectedElements = document.querySelectorAll('[style*="2px solid #3b82f6"]');
      selectedElements.forEach((el) => {
        (el as HTMLElement).style.border = '2px solid transparent';
      });

      // 确保字体加载
      await document.fonts.ready;

      // 等待所有元素渲染完成
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: canvasBackground,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        foreignObjectRendering: false,
        ignoreElements: (element) => {
          // 不忽略任何元素
          return false;
        },
        onclone: (clonedDoc) => {
          const clonedCanvas = clonedDoc.body.querySelector('[data-label-canvas]') as HTMLElement;
          if (clonedCanvas) {
            clonedCanvas.style.fontFamily = 'Arial, "Microsoft YaHei", "SimSun", sans-serif';
            clonedCanvas.style.position = 'relative';
            clonedCanvas.style.overflow = 'visible';
            clonedCanvas.style.width = canvasSize.width + 'px';
            clonedCanvas.style.height = canvasSize.height + 'px';
          }
        },
      });

      // 调试信息
      console.log('Canvas size:', canvas.width, 'x', canvas.height);
      
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('生成的画布尺寸为 0');
      }

      canvas.toBlob((blob) => { 
        if (blob) {
          console.log('Blob size:', blob.size);
          saveAs(blob, `label-${Date.now()}.png`);
        } else {
          throw new Error('Blob 生成失败');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败：' + (error as Error).message);
    } finally {
      canvasRef.current!.style.border = originalBorder;
      // 恢复选择边框
      const selectedElements = document.querySelectorAll('[style*="2px solid transparent"]');
      selectedElements.forEach((el) => {
        (el as HTMLElement).style.border = '2px solid #3b82f6';
      });
    }
  }, [canvasBackground, elements.length, canvasSize]);

  const selectedElement = elements.find((el) => el.id === selectedId);

  const getIconComponent = (iconName: string): LucideIcon | undefined => {
    for (const cat of ICON_CATEGORIES) {
      const found = cat.icons.find(i => i.name === iconName);
      if (found) return found.icon;
    }
    return undefined;
  };

  const renderElement = (el: LabelElement) => {
    const isSelected = el.id === selectedId;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      cursor: isDragging && isSelected ? 'grabbing' : 'move',
      border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
      transform: `rotate(${el.style.rotation || 0}deg)`,
      opacity: el.style.opacity || 1,
      userSelect: 'none',
      boxSizing: 'border-box',
      fontFamily: 'Arial, "Microsoft YaHei", "SimSun", sans-serif',
    };

    const shapeStyle: React.CSSProperties = {
      ...baseStyle,
      backgroundColor: el.style.backgroundColor,
      borderRadius: el.style.shapeType === 'circle' ? '50%' : el.style.borderRadius,
      clipPath: el.style.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : el.style.shapeType === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : undefined,
    };

    switch (el.type) {
      case 'title':
      case 'text':
        // 为文字元素创建独立的样式，不使用 baseStyle 中的固定高度
        const textStyle: React.CSSProperties = {
          position: 'absolute',
          left: el.x,
          top: el.y,
          width: el.width,
          height: 'auto',
          minHeight: el.height, // 使用模板中定义的高度作为最小高度
          cursor: isDragging && isSelected ? 'grabbing' : 'move',
          border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
          transform: `rotate(${el.style.rotation || 0}deg)`,
          opacity: el.style.opacity || 1,
          userSelect: 'none',
          boxSizing: 'border-box',
          fontFamily: 'Arial, "Microsoft YaHei", "SimSun", sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: el.style.textAlign === 'left' ? 'flex-start' : el.style.textAlign === 'right' ? 'flex-end' : 'center',
          fontSize: el.style.fontSize,
          fontWeight: el.style.fontWeight,
          color: el.style.color,
          padding: '2px 4px', // 增加上下 padding
          lineHeight: 1.5,
          overflow: 'visible', // 改为 visible 避免裁剪
        };
        return (
          <div key={el.id} style={textStyle} onMouseDown={(e) => handleElementMouseDown(e, el.id)}>
            <span style={{ display: 'inline-block', maxWidth: '100%', overflow: 'visible', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{el.content}</span>
          </div>
        );
      case 'shape':
        return <div key={el.id} style={shapeStyle} onMouseDown={(e) => handleElementMouseDown(e, el.id)} />;
      case 'line':
        return <div key={el.id} style={{ ...baseStyle, backgroundColor: el.style.color || '#1f2937', height: el.style.borderWidth || 3 }} onMouseDown={(e) => handleElementMouseDown(e, el.id)} />;
      case 'icon':
        const IconComponent = getIconComponent(el.content);
        return (
          <div key={el.id} style={{ ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: el.style.color }} onMouseDown={(e) => handleElementMouseDown(e, el.id)}>
            {IconComponent && <IconComponent size={Math.min(el.width, el.height) * 0.8} />}
          </div>
        );
      case 'qrcode':
        return <QRCodeElement key={el.id} el={el} isSelected={isSelected} onMouseDown={(e) => handleElementMouseDown(e, el.id)} />;
      case 'barcode':
        return <BarcodeElement key={el.id} el={el} isSelected={isSelected} onMouseDown={(e) => handleElementMouseDown(e, el.id)} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-full">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">标签设计器</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">拖拽元素自由布局，设计专业标签</p>
      </div>

      <div className="flex gap-4">
        <div className="w-64 flex-shrink-0 space-y-3 max-h-[500px] overflow-y-auto">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">模板</h3>
            <div className="grid grid-cols-3 gap-1">
              {TEMPLATES.map((t) => (
                <button key={t.name} onClick={() => applyTemplate(t)} className="px-2 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors">
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">画布</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-xs text-gray-500">宽</label>
                <input type="number" value={canvasSize.width} onChange={(e) => setCanvasSize((s) => ({ ...s, width: parseInt(e.target.value) || 400 }))} className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="text-xs text-gray-500">高</label>
                <input type="number" value={canvasSize.height} onChange={(e) => setCanvasSize((s) => ({ ...s, height: parseInt(e.target.value) || 300 }))} className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {PRESET_COLORS.slice(0, 11).map((c) => (
                <button key={c} onClick={() => setCanvasBackground(c)} className="w-5 h-5 rounded border border-gray-300" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">添加元素</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => addElement('title')} className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium">标题</button>
              <button onClick={() => addElement('text')} className="px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm hover:bg-green-100 dark:hover:bg-green-900/50 font-medium">文字</button>
              <button onClick={() => addElement('shape')} className="px-3 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm hover:bg-purple-100 dark:hover:bg-purple-900/50 font-medium">图形</button>
              <button onClick={() => addElement('line')} className="px-3 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-sm hover:bg-orange-100 dark:hover:bg-orange-900/50 font-medium">线条</button>
              <button onClick={() => addElement('qrcode')} className="px-3 py-2 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded text-sm hover:bg-cyan-100 dark:hover:bg-cyan-900/50 font-medium flex items-center justify-center gap-1"><QrCode size={14} /> 二维码</button>
              <button onClick={() => addElement('barcode')} className="px-3 py-2 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded text-sm hover:bg-pink-100 dark:hover:bg-pink-900/50 font-medium flex items-center justify-center gap-1"><Barcode size={14} /> 条码</button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">图标库</h3>
            <div className="flex gap-1 mb-2 flex-wrap">
              {ICON_CATEGORIES.map((cat, i) => (
                <button key={cat.name} onClick={() => setActiveCategory(i)} className={`px-2 py-1 text-xs rounded ${activeCategory === i ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {ICON_CATEGORIES[activeCategory].icons.map((item) => {
                const IconComp = item.icon;
                return (
                  <button key={item.name} onClick={() => addElement('icon', { content: item.name, width: 40, height: 40 })} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex flex-col items-center justify-center" title={item.name}>
                    <IconComp size={20} className="text-gray-600 dark:text-gray-300" />
                    <span className="text-[9px] text-gray-500 mt-0.5">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-center overflow-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-lg flex-1 min-h-[400px]">
            <div
              ref={canvasRef}
              data-label-canvas
              className="relative shadow-lg overflow-hidden"
              style={{ width: canvasSize.width, height: canvasSize.height, backgroundColor: canvasBackground, border: '1px dashed #9ca3af', fontFamily: 'Arial, "Microsoft YaHei", "SimSun", sans-serif' }}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            >
              {elements.map(renderElement)}
              {elements.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Layers size={48} className="mb-2 opacity-30" />
                  <span className="text-sm">从左侧添加元素开始设计</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-3">
            <button onClick={() => { setElements([]); setSelectedId(null); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1">
              <Trash2 size={16} /> 清空
            </button>
            <button onClick={exportAsImage} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1">
              <Download size={16} /> 导出PNG
            </button>
          </div>
        </div>

        <div className="w-64 flex-shrink-0">
          {selectedElement ? (
            <div className="border border-blue-300 dark:border-blue-700 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300">属性编辑</h3>
                <div className="flex gap-1">
                  <button onClick={() => duplicateElement(selectedElement.id)} className="p-1.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded" title="复制"><Copy size={16} /></button>
                  <button onClick={() => deleteElement(selectedElement.id)} className="p-1.5 hover:bg-red-200 dark:hover:bg-red-800 rounded text-red-600" title="删除"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="space-y-3">
                {(selectedElement.type === 'text' || selectedElement.type === 'title' || selectedElement.type === 'qrcode' || selectedElement.type === 'barcode') && (
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      {selectedElement.type === 'qrcode' ? '内容/链接' : selectedElement.type === 'barcode' ? '条码数据' : '内容'}
                    </label>
                    <input type="text" value={selectedElement.content} onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                )}
                
                {selectedElement.type === 'barcode' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">条码格式</label>
                      <select value={selectedElement.style.barcodeFormat} onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, barcodeFormat: e.target.value } })} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600">
                        {BARCODE_FORMATS.map((f) => (<option key={f.value} value={f.value}>{f.name}</option>))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="showText" checked={selectedElement.style.showText} onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, showText: e.target.checked } })} className="rounded" />
                      <label htmlFor="showText" className="text-xs text-gray-500">显示文字</label>
                    </div>
                  </>
                )}
                
                {selectedElement.type === 'qrcode' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">前景色</label>
                      <input type="color" value={selectedElement.style.qrColor || '#000000'} onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, qrColor: e.target.value } })} className="w-full h-8 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">背景色</label>
                      <input type="color" value={selectedElement.style.qrBgColor || '#ffffff'} onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, qrBgColor: e.target.value } })} className="w-full h-8 rounded cursor-pointer" />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">宽</label>
                    <input type="number" value={selectedElement.width} onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) || 50 })} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">高</label>
                    <input type="number" value={selectedElement.height} onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) || 50 })} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">X</label>
                    <input type="number" value={Math.round(selectedElement.x)} onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Y</label>
                    <input type="number" value={Math.round(selectedElement.y)} onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </div>
                
                {(selectedElement.type === 'text' || selectedElement.type === 'title' || selectedElement.type === 'icon' || selectedElement.type === 'line' || selectedElement.type === 'barcode') && (
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">颜色</label>
                    <div className="flex gap-1 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button key={c} onClick={() => updateElement(selectedElement.id, { style: { ...selectedElement.style, color: c } })} className={`w-5 h-5 rounded border ${selectedElement.style.color === c ? 'ring-2 ring-blue-500' : 'border-gray-300'}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                )}
                
                {(selectedElement.type === 'text' || selectedElement.type === 'title') && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">字号</label>
                        <input type="number" value={selectedElement.style.fontSize} onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontSize: parseInt(e.target.value) || 14 } })} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">粗细</label>
                        <select value={selectedElement.style.fontWeight} onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontWeight: e.target.value } })} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600">
                          <option value="normal">正常</option>
                          <option value="bold">粗体</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">对齐</label>
                      <div className="flex gap-1">
                        {['left', 'center', 'right'].map((align) => (
                          <button key={align} onClick={() => updateElement(selectedElement.id, { style: { ...selectedElement.style, textAlign: align as 'left' | 'center' | 'right' } })} className={`flex-1 py-1.5 text-xs rounded ${selectedElement.style.textAlign === align ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {align === 'left' ? '左' : align === 'center' ? '中' : '右'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {selectedElement.type === 'shape' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">形状</label>
                      <div className="flex gap-1">
                        {SHAPE_TYPES.map((s) => (
                          <button key={s.type} onClick={() => updateElement(selectedElement.id, { style: { ...selectedElement.style, shapeType: s.type as 'rect' | 'circle' | 'triangle' | 'diamond' } })} className={`flex-1 py-1.5 text-xs rounded ${selectedElement.style.shapeType === s.type ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">填充色</label>
                      <div className="flex gap-1 flex-wrap">
                        {PRESET_COLORS.map((c) => (
                          <button key={c} onClick={() => updateElement(selectedElement.id, { style: { ...selectedElement.style, backgroundColor: c } })} className={`w-5 h-5 rounded border ${selectedElement.style.backgroundColor === c ? 'ring-2 ring-blue-500' : 'border-gray-300'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">圆角: {selectedElement.style.borderRadius}px</label>
                      <input type="range" min="0" max="50" value={selectedElement.style.borderRadius} onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, borderRadius: parseInt(e.target.value) } })} className="w-full" />
                    </div>
                  </>
                )}
                
                {selectedElement.type === 'line' && (
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">粗细: {selectedElement.style.borderWidth}px</label>
                    <input type="range" min="1" max="10" value={selectedElement.style.borderWidth} onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, borderWidth: parseInt(e.target.value) } })} className="w-full" />
                  </div>
                )}
                
                <div>
                  <label className="text-xs text-gray-500 block mb-1">旋转: {selectedElement.style.rotation}°</label>
                  <input type="range" min="0" max="360" value={selectedElement.style.rotation} onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, rotation: parseInt(e.target.value) } })} className="w-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center text-gray-500 text-sm">
              <Move size={32} className="mx-auto mb-2 opacity-30" />
              <p>点击画布中的元素进行编辑</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QRCodeElement({ el, isSelected, onMouseDown }: { el: LabelElement; isSelected: boolean; onMouseDown: (e: React.MouseEvent) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && el.content) {
      QRCode.toCanvas(canvasRef.current, el.content, { width: Math.min(el.width, el.height) - 4, margin: 1, color: { dark: el.style.qrColor || '#000000', light: el.style.qrBgColor || '#ffffff' } });
    }
  }, [el.content, el.width, el.height, el.style.qrColor, el.style.qrBgColor]);

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    cursor: 'move',
    border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
    transform: `rotate(${el.style.rotation || 0}deg)`,
    opacity: el.style.opacity || 1,
    userSelect: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Arial, "Microsoft YaHei", "SimSun", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: el.style.qrBgColor || '#ffffff',
  };

  return (
    <div style={baseStyle} onMouseDown={onMouseDown}>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );
}

function BarcodeElement({ el, isSelected, onMouseDown }: { el: LabelElement; isSelected: boolean; onMouseDown: (e: React.MouseEvent) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && el.content) {
      try {
        JsBarcode(svgRef.current, el.content, { format: el.style.barcodeFormat || 'CODE128', width: 2, height: Math.max(40, el.height - (el.style.showText ? 20 : 4)), displayValue: el.style.showText ?? true, background: 'transparent', lineColor: el.style.color || '#000000', fontSize: 12, margin: 0 });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [el.content, el.style.barcodeFormat, el.style.color, el.style.showText, el.height]);

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    cursor: 'move',
    border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
    transform: `rotate(${el.style.rotation || 0}deg)`,
    opacity: el.style.opacity || 1,
    userSelect: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Arial, "Microsoft YaHei", "SimSun", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  };

  return (
    <div style={baseStyle} onMouseDown={onMouseDown}>
      <svg ref={svgRef} style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );
}
