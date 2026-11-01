import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Save, Trash2, AlertCircle } from 'lucide-react';
import { formatBdt } from '../utils/constants';

export const EditSaleModal: React.FC = () => {
  const { editingSale, closeEditSale, updateSale, deleteSale, settings, t } = useInventory();
  const isEnglish = settings.appLanguage === 'EN';
  const lang = settings.appLanguage;

  const [customerName, setCustomerName] = useState(() => (editingSale ? editingSale.customerName : ''));
  const [customerPhone, setCustomerPhone] = useState(() => (editingSale ? editingSale.customerPhone : ''));
  const [customerAddress, setCustomerAddress] = useState(() =>
    editingSale ? editingSale.customerAddress : ''
  );
  const [salePriceStr, setSalePriceStr] = useState(() =>
    editingSale ? editingSale.salePrice.toString() : ''
  );
  const [paidAmountStr, setPaidAmountStr] = useState(() =>
    editingSale ? editingSale.paidAmount.toString() : ''
  );
  const [paymentMethod, setPaymentMethod] = useState(() =>
    editingSale ? editingSale.paymentMethod : ''
  );
  const [warrantyInfo, setWarrantyInfo] = useState(() => (editingSale ? editingSale.warrantyInfo : ''));
  const [remarks, setRemarks] = useState(() => (editingSale ? editingSale.remarks : ''));
  const [restoreStock, setRestoreStock] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!editingSale) return null;

  const salePrice = parseFloat(salePriceStr) || 0;
  const paidAmount = parseFloat(paidAmountStr) || 0;
  const dueAmount = Math.max(0, salePrice - paidAmount);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || salePrice <= 0) return;

    updateSale({
      ...editingSale,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      salePrice,
      paidAmount,
      dueAmount,
      paymentMethod,
      warrantyInfo: warrantyInfo.trim(),
      remarks: remarks.trim()
    });
  };

  const handleDelete = () => {
    deleteSale(editingSale.id, restoreStock);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isEnglish ? 'Edit Sale & Memo' : 'বিক্রয় ও মেমো এডিট করুন'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.invoiceNoLabel}: #{editingSale.invoiceNumber}
            </p>
          </div>
          <button
            onClick={closeEditSale}
            className="h-8 w-8 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Device details */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="font-extrabold text-slate-900 dark:text-white">{editingSale.productDetails}</div>
            <div className="font-mono-code text-slate-500 dark:text-slate-400 mt-0.5">IMEI: {editingSale.imei}</div>
          </div>

          {/* Customer Name & Phone */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.customerNameLabel}</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.customerPhoneLabel}</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.customerAddressLabel}</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Price & Paid Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.salePriceLabel}</label>
              <input
                type="number"
                value={salePriceStr}
                onChange={(e) => setSalePriceStr(e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold dark:text-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.paidAmountLabel}</label>
              <input
                type="number"
                value={paidAmountStr}
                onChange={(e) => setPaidAmountStr(e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-emerald-600 dark:text-emerald-400"
                required
              />
            </div>
          </div>

          {/* Due Display */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">{t.dueAmountLabel}:</span>
            <span
              className={`font-extrabold ${
                dueAmount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              ৳{formatBdt(dueAmount, lang)}
            </span>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.paymentMethodLabel}</label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium dark:text-white"
            />
          </div>

          {/* Warranty Terms */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.warrantyTermsLabel}</label>
            <textarea
              rows={3}
              value={warrantyInfo}
              onChange={(e) => setWarrantyInfo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium resize-none dark:text-white"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.remarksLabel}</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
            />
          </div>

          {/* Delete confirmation section */}
          {showDeleteConfirm ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs font-bold">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {isEnglish
                    ? `Delete invoice #${editingSale.invoiceNumber}?`
                    : `মেমো #${editingSale.invoiceNumber} মুছে ফেলবেন?`}
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={restoreStock}
                  onChange={(e) => setRestoreStock(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>
                  {isEnglish
                    ? 'Restore phone back into In-Stock inventory'
                    : 'ফোনটিকে পুনরায় স্টকে (In-Stock) ফেরত নিন'}
                </span>
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                >
                  {isEnglish ? 'Yes, Delete' : 'হ্যাঁ, মুছুন'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Save className="h-4 w-4" />
                <span>{isEnglish ? 'Save Changes' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="py-3 px-4 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-2xl font-bold text-sm transition-all"
                title={t.btnDelete}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
