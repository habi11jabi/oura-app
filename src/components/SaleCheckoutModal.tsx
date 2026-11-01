import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, ShoppingCart, Check, AlertCircle, Phone, MapPin, User } from 'lucide-react';
import { formatBdt } from '../utils/constants';

export const SaleCheckoutModal: React.FC = () => {
  const { productToSell, closeSaleCheckout, recordSale, settings, t } = useInventory();
  const isEnglish = settings.appLanguage === 'EN';
  const lang = settings.appLanguage;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [salePriceStr, setSalePriceStr] = useState(() =>
    productToSell ? productToSell.targetSalePrice.toString() : ''
  );
  const [paidAmountStr, setPaidAmountStr] = useState(() =>
    productToSell ? productToSell.targetSalePrice.toString() : ''
  );
  const [paymentMethod, setPaymentMethod] = useState(
    settings.paymentMethodPresets[0] || 'নগদ ক্যাশ (Cash)'
  );
  const [warrantyInfo, setWarrantyInfo] = useState(
    `1. ${settings.warrantyReplacement}\n2. ${settings.warrantyService}\n3. ${settings.warrantyExchangeDeduction}`
  );
  const [remarks, setRemarks] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!productToSell) return null;

  const salePrice = parseFloat(salePriceStr) || 0;
  const paidAmount = parseFloat(paidAmountStr) || 0;
  const dueAmount = Math.max(0, salePrice - paidAmount);
  const profit = salePrice - productToSell.purchasePrice;

  const handleSaleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setErrorMsg(isEnglish ? 'Please enter customer name.' : 'অনুগ্রহ করে ক্রেতার নাম লিখুন।');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg(isEnglish ? 'Please enter customer mobile number.' : 'অনুগ্রহ করে ক্রেতার মোবাইল নম্বর লিখুন।');
      return;
    }
    if (salePrice <= 0) {
      setErrorMsg(isEnglish ? 'Please enter a valid sale price.' : 'সঠিক বিক্রয় মূল্য লিখুন।');
      return;
    }

    setErrorMsg(null);

    recordSale({
      product: productToSell,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      salePrice,
      paidAmount,
      paymentMethod,
      warrantyInfo,
      remarks: remarks.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {t.checkoutTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {settings.shopName} • {t.invoiceTitle}
              </p>
            </div>
          </div>
          <button
            onClick={closeSaleCheckout}
            className="h-9 w-9 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSaleConfirm} className="overflow-y-auto p-6 space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Selected Device Preview Card */}
          <div className="p-4 bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {productToSell.company}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {productToSell.model}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {productToSell.variant} • {productToSell.color} • {productToSell.batteryHealth}
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{t.targetPriceLabel}</div>
                <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  ৳{formatBdt(productToSell.targetSalePrice, lang)}
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-blue-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{t.imeiLabel}</span>
              <span className="font-mono-code font-bold text-slate-800 dark:text-slate-200 tracking-wider">
                {productToSell.imei}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-3">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              {isEnglish ? 'Customer Information' : 'ক্রেতার তথ্য'}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.customerNameLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isEnglish ? 'e.g. Tanvir Ahmed' : 'যেমন: তানভীর আহমেদ'}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.customerPhoneLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.customerAddressLabel}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder={isEnglish ? 'Dhaka, Bangladesh' : 'ঢাকা, বাংলাদেশ'}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Due Calculation */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              {isEnglish ? 'Payment & Accounts' : 'পেমেন্ট ও হিসাব'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.salePriceLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={salePriceStr}
                    onChange={(e) => {
                      setSalePriceStr(e.target.value);
                      if (paidAmountStr === salePriceStr) {
                        setPaidAmountStr(e.target.value);
                      }
                    }}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.paidAmountLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={paidAmountStr}
                    onChange={(e) => setPaidAmountStr(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-emerald-600 dark:text-emerald-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Live Due & Profit indicator */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div
                className={`p-2.5 rounded-xl border flex flex-col justify-center ${
                  dueAmount > 0
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">
                  {dueAmount > 0 ? t.dueAmountLabel : t.paidInFull}
                </span>
                <span className="text-sm font-extrabold">
                  ৳{formatBdt(dueAmount, lang)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                  {isEnglish ? 'Sale Profit' : 'এই বিক্রয়ে লাভ'}
                </span>
                <span className={`text-sm font-extrabold ${profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  +৳{formatBdt(profit, lang)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.paymentMethodLabel}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {settings.paymentMethodPresets.map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    paymentMethod === method
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Warranty Terms */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.warrantyTermsLabel}
            </label>
            <textarea
              rows={3}
              value={warrantyInfo}
              onChange={(e) => setWarrantyInfo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium resize-none dark:text-white"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.remarksLabel}
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={isEnglish ? 'Optional memo remarks...' : 'বিশেষ কোনো শর্ত বা মন্তব্য...'}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Check className="h-5 w-5 stroke-[3]" />
              <span>{t.btnCompleteSale}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
