import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Search,
  Receipt,
  Phone,
  DollarSign,
  Edit2,
  FileText,
  User
} from 'lucide-react';
import { formatBdt } from '../utils/constants';

export const SalesScreen: React.FC = () => {
  const { sales, filteredSales, searchQuery, setSearchQuery, openInvoice, openDuePayment, openEditSale, settings, t } =
    useInventory();

  const [showOnlyDue, setShowOnlyDue] = useState(false);
  const isEnglish = settings.appLanguage === 'EN';
  const lang = settings.appLanguage;

  const displaySales = filteredSales.filter((s) => !showOnlyDue || s.dueAmount > 0);

  const totalRevenue = sales.reduce((acc, s) => acc + s.salePrice, 0);
  const totalDue = sales.reduce((acc, s) => acc + s.dueAmount, 0);

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.salesHistoryTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {isEnglish
            ? 'Track customer cash memos, payment receipts, and outstanding dues'
            : 'বিক্রয় হিসাব, কাস্টমারদের ডিজিটাল ক্যাশ মেমো ও বকেয়া পাওনা পর্যবেক্ষণ'}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.invoiceSearchPlaceholder}
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-xs placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {isEnglish ? 'Clear' : 'মুছুন'}
          </button>
        )}
      </div>

      {/* Filter Tabs & Financial Summary Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnlyDue(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !showOnlyDue
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t.allSalesLabel} ({sales.length})
          </button>
          <button
            onClick={() => setShowOnlyDue(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              showOnlyDue
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t.dueSalesLabel} ({sales.filter((s) => s.dueAmount > 0).length})
          </button>
        </div>

        {/* Quick Revenue & Due Pill */}
        <div className="bg-white dark:bg-slate-900 rounded-xl px-3.5 py-2 border border-slate-200 dark:border-slate-800 flex items-center justify-between sm:justify-end gap-4 text-xs font-bold shadow-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400">{t.reportTotalRevenue}: </span>
            <span className="text-slate-900 dark:text-white font-extrabold">৳{formatBdt(totalRevenue, lang)}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">{t.reportTotalDue}: </span>
            <span className={`font-extrabold ${totalDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ৳{formatBdt(totalDue, lang)}
            </span>
          </div>
        </div>
      </div>

      {/* Sales Invoices List */}
      {displaySales.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
            <Receipt className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">{t.noSalesRecorded}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {isEnglish
              ? 'Complete your first sale from the Dashboard or Stock List to generate cash memos.'
              : 'ড্যাশবোর্ড অথবা স্টক তালিকা থেকে ফোন বিক্রয় করে ডিজিটাল ক্যাশ মেমো তৈরি করুন।'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displaySales.map((sale) => {
            const formattedDate = new Date(sale.soldAt).toLocaleString(
              isEnglish ? 'en-US' : 'bn-BD',
              { dateStyle: 'medium', timeStyle: 'short' }
            );

            return (
              <div
                key={sale.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Invoice # & Date */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-mono-code font-bold text-sm text-blue-700 dark:text-blue-400">
                        #{sale.invoiceNumber}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Customer Information & Quick Call */}
                  <div className="py-3 flex items-start justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>{sale.customerName}</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                        {sale.customerPhone}
                        {sale.customerAddress ? ` • ${sale.customerAddress}` : ''}
                      </div>
                    </div>
                    <a
                      href={`tel:${sale.customerPhone}`}
                      className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center justify-center transition-colors"
                      title={t.btnCallCustomer}
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Device Details Box */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{sale.productDetails}</div>
                    <div className="font-mono-code font-semibold text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {t.imeiLabel} {sale.imei}
                    </div>
                  </div>

                  {/* Financials Strip */}
                  <div className="mt-3 grid grid-cols-3 gap-2 p-2 bg-slate-100/60 dark:bg-slate-800/60 rounded-xl text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{t.totalSalePriceLabel}</div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">৳{formatBdt(sale.salePrice, lang)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{t.paidLabel}</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">৳{formatBdt(sale.paidAmount, lang)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {sale.dueAmount > 0 ? t.dueLabel : t.paidInFull}
                      </div>
                      <div
                        className={`font-black ${
                          sale.dueAmount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        ৳{formatBdt(sale.dueAmount, lang)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => openInvoice(sale)}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>{t.invoiceTitle}</span>
                  </button>

                  <button
                    onClick={() => openEditSale(sale)}
                    className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                    title={t.btnEditMemo}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t.btnEdit}</span>
                  </button>

                  {sale.dueAmount > 0 && (
                    <button
                      onClick={() => openDuePayment(sale)}
                      className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-xs"
                    >
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>{t.btnCollectDue}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
