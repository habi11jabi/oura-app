import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  X,
  Copy,
  Check,
  ShoppingCart,
  Edit2,
  Trash2,
  Battery,
  Box,
  Truck,
  Calendar,
  ShieldCheck,
  Tag,
  Printer,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { formatBdt } from '../utils/constants';

// Clean SVG Barcode Generator based on IMEI digits
const BarcodeVisualizer: React.FC<{ value: string }> = ({ value }) => {
  const bars = value.split('').map((char, index) => {
    const num = parseInt(char, 10) || 5;
    return {
      width: (num % 3) + 1.5,
      isSpace: index % 4 === 3
    };
  });

  return (
    <div className="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-end justify-center h-12 w-full gap-[2px] max-w-[280px] overflow-hidden px-2">
        {bars.map((bar, i) => (
          <React.Fragment key={i}>
            <div
              className="bg-slate-900 dark:bg-slate-100 rounded-xs h-full"
              style={{ width: `${bar.width}px` }}
            />
            {bar.isSpace && <div className="w-[3px]" />}
            <div
              className="bg-slate-900 dark:bg-slate-100 rounded-xs"
              style={{
                width: `${(bar.width % 2) + 1}px`,
                height: i % 2 === 0 ? '85%' : '100%'
              }}
            />
          </React.Fragment>
        ))}
      </div>
      <div className="mt-2 font-mono-code font-bold tracking-[0.25em] text-xs text-slate-800 dark:text-slate-200 text-center">
        {value}
      </div>
    </div>
  );
};

export const ProductDetailModal: React.FC = () => {
  const {
    viewingProduct,
    closeProductDetail,
    openSaleCheckout,
    openEditProduct,
    deleteProduct,
    settings,
    showToast,
    t
  } = useInventory();

  const [copied, setCopied] = useState(false);

  if (!viewingProduct) return null;

  const product = viewingProduct;
  const isEnglish = settings.appLanguage === 'EN';
  const lang = settings.appLanguage;

  const profit = product.targetSalePrice - product.purchasePrice;
  const margin = product.targetSalePrice > 0 ? ((profit / product.targetSalePrice) * 100).toFixed(1) : '0';

  const dateAddedStr = new Date(product.createdAt).toLocaleDateString(isEnglish ? 'en-US' : 'bn-BD', {
    dateStyle: 'medium'
  });

  const batteryNum = parseInt(product.batteryHealth, 10) || (product.batteryHealth.includes('100') ? 100 : 90);

  const handleCopyImei = async () => {
    try {
      await navigator.clipboard.writeText(product.imei);
      setCopied(true);
      if ('vibrate' in navigator) navigator.vibrate(50);
      showToast(isEnglish ? `Copied IMEI: ${product.imei}` : `IMEI কপি করা হয়েছে: ${product.imei}`);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const handlePrintLabel = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${product.model} - ${product.imei}</title>
          <style>
            body { font-family: monospace; padding: 20px; text-align: center; }
            .label { border: 2px dashed #000; padding: 16px; width: 280px; margin: 0 auto; }
            h2 { margin: 4px 0; font-size: 16px; }
            p { margin: 2px 0; font-size: 12px; }
            .imei { font-size: 14px; font-weight: bold; letter-spacing: 2px; margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="label">
            <p><strong>${settings.shopName}</strong></p>
            <h2>${product.company} ${product.model}</h2>
            <p>${product.variant} | ${product.color}</p>
            <p>Battery: ${product.batteryHealth} | Box: ${product.boxCondition}</p>
            <div class="imei">IMEI: ${product.imei}</div>
            <p><strong>Price: ৳${product.targetSalePrice.toLocaleString()}</strong></p>
          </div>
          <script>window.onload = function() { window.print(); window.close(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                  {product.company}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    product.status === 'IN_STOCK'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {product.status === 'IN_STOCK' ? t.statusInStock : t.statusSold}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {product.model}
              </h3>
            </div>
          </div>
          <button
            onClick={closeProductDetail}
            className="h-8 w-8 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* 1. Barcode & IMEI Showcase Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/70 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>{isEnglish ? 'Device IMEI & Barcode' : 'আইএমইআই ও বারকোড বিবরণ'}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrintLabel}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
                  title="Print barcode label sticker"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">{isEnglish ? 'Print Tag' : 'লেবেল প্রিন্ট'}</span>
                </button>
                <button
                  onClick={handleCopyImei}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? (isEnglish ? 'Copied!' : 'কপি হয়েছে!') : (isEnglish ? 'Copy IMEI' : 'কপি করুন')}</span>
                </button>
              </div>
            </div>

            {/* Visual Barcode Component */}
            <BarcodeVisualizer value={product.imei} />
          </div>

          {/* 2. Device Full Specifications Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              {isEnglish ? 'Full Hardware Specifications' : 'সম্পূর্ণ ডিভাইসের বিবরণী'}
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{t.companyLabel}</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{product.company}</span>
              </div>

              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{t.modelLabel}</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{product.model}</span>
              </div>

              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{t.variantLabel}</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{product.variant}</span>
              </div>

              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{t.colorLabel}</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{product.color}</span>
              </div>

              {/* Battery Health with visual indicator */}
              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Battery className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.batteryHealthLabel}</span>
                  </span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{product.batteryHealth}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      batteryNum >= 90 ? 'bg-emerald-500' : batteryNum >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, batteryNum))}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5">
                  <Box className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                  <span>{t.boxConditionLabel}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{product.boxCondition}</span>
              </div>

              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5">
                  <Truck className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                  <span>{t.supplierSourceLabel}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{product.supplier}</span>
              </div>

              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                  <span>{isEnglish ? 'Date Added' : 'যুক্ত করার তারিখ'}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{dateAddedStr}</span>
              </div>
            </div>
          </div>

          {/* 3. Pricing & Profit Analysis Breakdown */}
          <div className="bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-indigo-50/50 dark:from-blue-950/40 dark:via-slate-800/60 dark:to-indigo-950/40 border border-blue-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-3">
            <h4 className="text-xs font-extrabold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isEnglish ? 'Pricing & Net Profit Calculation' : 'ক্রয়-বিক্রয় মূল্য ও সম্ভাব্য মুনাফা'}</span>
            </h4>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-blue-100/80 dark:border-slate-700 shadow-2xs">
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-semibold">{t.purchaseCostLabel}</div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  ৳{formatBdt(product.purchasePrice, lang)}
                </div>
              </div>

              <div className="p-3 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-blue-200/80 dark:border-slate-700 shadow-2xs">
                <div className="text-[10.5px] text-blue-600 dark:text-blue-400 font-semibold">{t.targetPriceLabel}</div>
                <div className="text-sm sm:text-base font-black text-blue-600 dark:text-blue-400 mt-0.5">
                  ৳{formatBdt(product.targetSalePrice, lang)}
                </div>
              </div>

              <div className="p-3 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-emerald-200/80 dark:border-slate-700 shadow-2xs">
                <div className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-semibold">{t.potentialProfitLabel}</div>
                <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  +৳{formatBdt(profit, lang)}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">({margin}%)</div>
              </div>
            </div>
          </div>

          {/* 4. Warranty & Notes Box */}
          {product.notes && (
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/60 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5 uppercase text-[10px]">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                <span>{t.notesLabel}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{product.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Action Footer Bar */}
        <div className="p-4 bg-slate-50/90 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          {product.status === 'IN_STOCK' && (
            <button
              onClick={() => {
                closeProductDetail();
                openSaleCheckout(product);
              }}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{t.btnSell}</span>
            </button>
          )}

          <button
            onClick={() => {
              closeProductDetail();
              openEditProduct(product);
            }}
            className="py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-2xs"
          >
            <Edit2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span>{t.btnEdit}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm(t.confirmDeleteProduct)) {
                closeProductDetail();
                deleteProduct(product.id);
              }
            }}
            className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 rounded-2xl border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 transition-all"
            title={t.btnDelete}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
