import React, { useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  X,
  Printer,
  Share2,
  Phone,
  Edit2,
  DollarSign,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { formatBdt } from '../utils/constants';

export const InvoiceMemoModal: React.FC = () => {
  const { activeInvoiceSale, closeInvoice, openDuePayment, openEditSale, settings, showToast, t } =
    useInventory();
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!activeInvoiceSale) return null;

  const sale = activeInvoiceSale;
  const isEnglish = settings.appLanguage === 'EN';
  const lang = settings.appLanguage;

  const formattedDate = new Date(sale.soldAt).toLocaleString(isEnglish ? 'en-US' : 'bn-BD', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `
🧾 ${settings.shopName}
${settings.shopTagline}
${settings.shopAddress} | 📞 ${settings.shopPhone}
----------------------------------------
${t.invoiceNoLabel}: #${sale.invoiceNumber}
${t.dateLabel}: ${formattedDate}

[${t.customerInfoSection}]
${isEnglish ? 'Name:' : 'নাম:'} ${sale.customerName}
${isEnglish ? 'Phone:' : 'মোবাইল:'} ${sale.customerPhone}
${sale.customerAddress ? `${isEnglish ? 'Address:' : 'ঠিকানা:'} ${sale.customerAddress}` : ''}

[${t.productDetailsSection}]
${sale.productDetails}
${t.imeiLabel} ${sale.imei}
${sale.batteryHealth ? `${t.batteryLabel} ${sale.batteryHealth}` : ''}
${sale.boxCondition ? `${t.boxLabel} ${sale.boxCondition}` : ''}

[${t.paymentSummarySection}]
${t.totalSalePriceLabel} ৳${formatBdt(sale.salePrice, lang)}
${t.paidLabel} ৳${formatBdt(sale.paidAmount, lang)}
${t.dueLabel} ৳${formatBdt(sale.dueAmount, lang)}
${t.paymentMethodLabel}: ${sale.paymentMethod}

[${t.warrantySection}]
${sale.warrantyInfo}

${t.memoDisclaimer}
----------------------------------------
${settings.shopName} এ আসার জন্য ধন্যবাদ!
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${settings.shopName} Memo #${sale.invoiceNumber}`,
          text
        });
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast(isEnglish ? 'Invoice memo copied to clipboard!' : 'ক্যাশ মেমো টেক্সট কপি করা হয়েছে!');
    } catch (_) {}
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="no-print px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
              #{sale.invoiceNumber}
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{t.invoiceTitle}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openEditSale(sale)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors"
              title={t.btnEditMemo}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={closeInvoice}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Memo Voucher */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 bg-slate-100/40 dark:bg-slate-950/60">
          <div
            ref={printAreaRef}
            className="printable-area bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden"
          >
            {/* Top decorative blue line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600"></div>

            {/* Shop Header Banner */}
            <div className="text-center pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex justify-center mb-2">
                <img
                  src="/shop_logo.png"
                  alt="Shop Logo"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/shop_icon_canvas.png';
                  }}
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {settings.shopName}
              </h2>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{settings.shopTagline}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {settings.shopAddress} • 📞 {settings.shopPhone}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-extrabold uppercase tracking-wider">
                {t.invoiceTitle}
              </div>
            </div>

            {/* Invoice Meta Bar */}
            <div className="py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">{t.invoiceNoLabel}: </span>
                <span className="font-mono-code font-bold text-slate-900 dark:text-white">#{sale.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">{t.dateLabel}: </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formattedDate}</span>
              </div>
            </div>

            {/* Customer Information Box */}
            <div className="my-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
              <div className="font-bold text-blue-700 dark:text-blue-400 tracking-wide uppercase text-[10px]">
                {t.customerInfoSection}
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">{sale.customerName}</div>
              <div className="text-slate-600 dark:text-slate-300 font-medium">
                {isEnglish ? 'Phone:' : 'মোবাইল:'} <span className="font-semibold">{sale.customerPhone}</span>
              </div>
              {sale.customerAddress && (
                <div className="text-slate-500 dark:text-slate-400">
                  {isEnglish ? 'Address:' : 'ঠিকানা:'} {sale.customerAddress}
                </div>
              )}
            </div>

            {/* Product Specifications Box */}
            <div className="my-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
              <div className="font-bold text-blue-700 dark:text-blue-400 tracking-wide uppercase text-[10px]">
                {t.productDetailsSection}
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">{sale.productDetails}</div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono-code font-bold">
                <span className="text-slate-500 dark:text-slate-400 font-normal">{t.imeiLabel}</span>
                <span>{sale.imei}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                {sale.batteryHealth && (
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {t.batteryLabel} {sale.batteryHealth}
                  </span>
                )}
                {sale.boxCondition && <span>{t.boxLabel} {sale.boxCondition}</span>}
              </div>
            </div>

            {/* Pricing & Accounts Table */}
            <div className="my-3 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t.totalSalePriceLabel}</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  ৳{formatBdt(sale.salePrice, lang)}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{t.paidLabel}</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                  ৳{formatBdt(sale.paidAmount, lang)}
                </span>
              </div>
              <div
                className={`flex justify-between p-2.5 ${
                  sale.dueAmount > 0
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="font-bold">{t.dueLabel}</span>
                <span
                  className={`font-black text-sm ${
                    sale.dueAmount > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  ৳{formatBdt(sale.dueAmount, lang)}
                </span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700">
                <span>{t.paymentMethodLabel}:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{sale.paymentMethod}</span>
              </div>
            </div>

            {/* Warranty & Conditions Box */}
            <div className="my-3 p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/60 text-[11px] space-y-1 text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-400 uppercase text-[10px]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{t.warrantySection}</span>
              </div>
              <div className="whitespace-pre-line text-[10.5px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                {sale.warrantyInfo}
              </div>
              {sale.remarks && (
                <div className="mt-1 pt-1 border-t border-amber-200/40 dark:border-amber-900/40 text-[10px] text-amber-900 dark:text-amber-300 font-semibold italic">
                  * {sale.remarks}
                </div>
              )}
            </div>

            {/* Bottom Disclaimer & Authorized Signature Stamp */}
            <div className="pt-4 flex items-end justify-between">
              <div className="text-[9.5px] text-slate-500 dark:text-slate-400 max-w-[240px] leading-snug">
                {t.memoDisclaimer}
                <div className="mt-1 font-bold text-slate-700 dark:text-slate-300">
                  {settings.shopName} এ আসার জন্য ধন্যবাদ!
                </div>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 mx-auto rounded-full border-2 border-dashed border-blue-600 dark:border-blue-400 flex items-center justify-center text-blue-600 dark:text-blue-400 p-1">
                  <CheckCircle className="h-6 w-6 stroke-[2]" />
                </div>
                <div className="text-[9px] font-extrabold text-blue-700 dark:text-blue-400 mt-1 uppercase tracking-tight">
                  {settings.shopName}
                  <br />
                  Authorized Seal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar (Hidden in print) */}
        <div className="no-print p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          {/* Row 1: Print & Share */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>{t.btnPrint}</span>
            </button>
            <button
              onClick={handleShare}
              className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-transparent dark:border-slate-700"
            >
              <Share2 className="h-4 w-4" />
              <span>{t.btnShareMemo}</span>
            </button>
          </div>

          {/* Row 2: Call Customer & Collect Due if due > 0 */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${sale.customerPhone}`}
              className="py-2 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.btnCallCustomer}</span>
            </a>
            {sale.dueAmount > 0 ? (
              <button
                onClick={() => {
                  closeInvoice();
                  openDuePayment(sale);
                }}
                className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <DollarSign className="h-3.5 w-3.5" />
                <span>{t.btnCollectDue}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  closeInvoice();
                  openEditSale(sale);
                }}
                className="py-2 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{t.btnEditMemo}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
