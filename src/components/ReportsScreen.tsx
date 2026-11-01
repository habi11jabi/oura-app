import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Package,
  Share2,
  Award
} from 'lucide-react';
import { formatBdt } from '../utils/constants';

export const ReportsScreen: React.FC = () => {
  const { reportData, dashboardMetrics, reportPeriod, setReportPeriod, settings, showToast, t } =
    useInventory();

  const isEnglish = settings.appLanguage === 'EN';
  const lang = settings.appLanguage;

  const handleShareReport = async () => {
    const text = `
📊 ${settings.shopName} - ${t.reportsTitle}
${isEnglish ? 'Period:' : 'সময়কাল:'} ${reportData.periodName}
----------------------------------------
📱 ${t.reportUnitsSold}: ${reportData.unitsSold}
💰 ${t.reportTotalRevenue}: ৳${formatBdt(reportData.totalRevenue, lang)}
📉 ${t.reportTotalCost}: ৳${formatBdt(reportData.totalCost, lang)}
✨ ${t.reportTotalProfit}: ৳${formatBdt(reportData.totalProfit, lang)}
📈 ${t.reportProfitMargin}: ${reportData.profitMarginPercent.toFixed(1)}%
💵 ${t.reportTotalPaid}: ৳${formatBdt(reportData.totalPaid, lang)}
⚠️ ${t.reportTotalDue}: ৳${formatBdt(reportData.totalDue, lang)}

[${isEnglish ? 'Current Inventory Stock Snapshot' : 'বর্তমান দোকানের স্টক স্ট্যাটাস'}]
• ${isEnglish ? 'In-Stock Phones:' : 'মজুদ ফোন:'} ${dashboardMetrics.inStockCount}
• ${isEnglish ? 'Stock Investment Value:' : 'স্টক ইনভেস্টমেন্ট মূল্য:'} ৳${formatBdt(dashboardMetrics.totalStockValue, lang)}
----------------------------------------
${settings.shopName}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${settings.shopName} Report`,
          text
        });
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast(isEnglish ? 'Report copied to clipboard!' : 'রিপোর্ট টেক্সট কপি করা হয়েছে!');
    } catch (_) {}
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.reportsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isEnglish
              ? 'Analyze sales performance, net profit margins, and cash collection'
              : 'দোকানের মোট বিক্রয়, নিট লাভ, খরচ ও বকেয়া আদায়ের বিস্তারিত হিসাব'}
          </p>
        </div>

        {/* Share Report Button */}
        <button
          onClick={handleShareReport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold shadow-xs transition-all active:scale-95"
        >
          <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>{t.btnShareReport}</span>
        </button>
      </div>

      {/* Period Filter Buttons */}
      <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
        <button
          onClick={() => setReportPeriod('THIS_MONTH')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportPeriod === 'THIS_MONTH'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.periodThisMonth}
        </button>
        <button
          onClick={() => setReportPeriod('LAST_MONTH')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportPeriod === 'LAST_MONTH'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.periodLastMonth}
        </button>
        <button
          onClick={() => setReportPeriod('ALL_TIME')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportPeriod === 'ALL_TIME'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.periodAllTime}
        </button>
      </div>

      {/* Net Profit Hero Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden ${
          reportData.totalProfit >= 0
            ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 shadow-emerald-600/20'
            : 'bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 shadow-rose-600/20'
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-100">
            {reportData.periodName}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-xs">
            {t.reportProfitMargin}: {reportData.profitMarginPercent.toFixed(1)}%
          </span>
        </div>

        <div className="mt-3">
          <div className="text-sm font-semibold text-emerald-100">
            {t.reportTotalProfit}
          </div>
          <div className="text-4xl sm:text-5xl font-black tracking-tight mt-1">
            ৳{formatBdt(reportData.totalProfit, lang)}
          </div>
          <div className="mt-3 text-xs text-emerald-100/80 font-medium">
            {t.reportTotalRevenue}: ৳{formatBdt(reportData.totalRevenue, lang)} • {t.reportTotalCost}: ৳
            {formatBdt(reportData.totalCost, lang)}
          </div>
        </div>
      </div>

      {/* Financial Statement Overview Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          {isEnglish ? 'Financial Breakdown Overview' : 'আর্থিক বিবরণী সারাংশ'}
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">{t.reportUnitsSold}</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {reportData.unitsSold} {isEnglish ? 'phones' : 'টি'}
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">{t.reportTotalRevenue}</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400">
              ৳{formatBdt(reportData.totalRevenue, lang)}
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">{t.reportTotalCost}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              ৳{formatBdt(reportData.totalCost, lang)}
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">{t.reportTotalPaid}</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              ৳{formatBdt(reportData.totalPaid, lang)}
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{t.reportTotalDue}</span>
            <span
              className={`font-black text-base ${
                reportData.totalDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              ৳{formatBdt(reportData.totalDue, lang)}
            </span>
          </div>
        </div>
      </div>

      {/* Current Inventory Valuation Snapshot */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-md shadow-slate-900/10 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-extrabold">
              {isEnglish ? 'Current Inventory Stock Snapshot' : 'বর্তমান দোকানের স্টক স্ট্যাটাস'}
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
            {dashboardMetrics.inStockCount} {isEnglish ? 'Phones' : 'টি'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-center sm:text-left">
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {isEnglish ? 'Total In-Stock Units' : 'মোট স্টক সংখ্যা'}
            </div>
            <div className="text-2xl font-black mt-1">
              {formatBdt(dashboardMetrics.inStockCount, lang)}{' '}
              <span className="text-xs text-slate-400 font-normal">
                {isEnglish ? 'Units' : 'টি'}
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {isEnglish ? 'Current Stock Investment' : 'মোট ইনভেস্টমেন্ট মূল্য'}
            </div>
            <div className="text-2xl font-black text-blue-400 mt-1">
              ৳{formatBdt(dashboardMetrics.totalStockValue, lang)}
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Phone Models Ranking */}
      {reportData.topSellingModels.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {t.topSellingModelsHeader}
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reportData.topSellingModels.map((item, index) => (
              <div key={item.modelName} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 w-5">#{index + 1}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.modelName}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  {item.count} {isEnglish ? 'sold' : 'টি বিক্রিত'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
