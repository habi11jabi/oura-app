import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, DollarSign, Check, AlertCircle } from 'lucide-react';
import { formatBdt } from '../utils/constants';

export const DuePaymentModal: React.FC = () => {
  const { saleForDuePayment, closeDuePayment, updateDuePayment, settings, t } = useInventory();
  const isEnglish = settings.appLanguage === 'EN';
  const lang = settings.appLanguage;

  const [paymentAmountStr, setPaymentAmountStr] = useState(() =>
    saleForDuePayment ? saleForDuePayment.dueAmount.toString() : ''
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!saleForDuePayment) return null;

  const amount = parseFloat(paymentAmountStr) || 0;
  const remainingDue = Math.max(0, saleForDuePayment.dueAmount - amount);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorMessage(isEnglish ? 'Please enter a valid amount.' : 'সঠিক টাকার পরিমাণ লিখুন।');
      return;
    }
    if (amount > saleForDuePayment.dueAmount) {
      setErrorMessage(
        isEnglish
          ? 'Payment cannot exceed current due balance.'
          : 'পরিশোধের পরিমাণ বর্তমান বকেয়া থেকে বেশি হতে পারে না।'
      );
      return;
    }

    setErrorMessage(null);
    updateDuePayment(saleForDuePayment.id, amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {t.duePaymentDialogTitle}
            </h3>
          </div>
          <button
            onClick={closeDuePayment}
            className="h-8 w-8 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer & Due Details Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl space-y-1 text-xs">
            <div className="text-slate-500 dark:text-slate-400 font-medium">
              {isEnglish ? 'Customer:' : 'ক্রেতার নাম:'}{' '}
              <span className="font-extrabold text-slate-900 dark:text-white">{saleForDuePayment.customerName}</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400 font-medium">
              {isEnglish ? 'Device:' : 'ডিভাইস:'}{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{saleForDuePayment.productDetails}</span>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 mt-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">{t.totalDueNowLabel}</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400">
                ৳{formatBdt(saleForDuePayment.dueAmount, lang)}
              </span>
            </div>
          </div>

          {/* Amount to pay input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.amountToPayLabel}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                ৳
              </span>
              <input
                type="number"
                value={paymentAmountStr}
                onChange={(e) => setPaymentAmountStr(e.target.value)}
                className="w-full pl-9 pr-3.5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-extrabold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Remaining Due Preview */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">{t.remainingDueLabel}</span>
            <span
              className={`font-extrabold ${
                remainingDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              ৳{formatBdt(remainingDue, lang)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>{t.btnConfirmDuePayment}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
