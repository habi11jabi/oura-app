import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Plus, QrCode, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { settings, updateSettings, toggleTheme, isDark, openAddProduct, openScanner, t } =
    useInventory();
  const isEnglish = settings.appLanguage === 'EN';

  const todayStr = new Date().toLocaleDateString(isEnglish ? 'en-US' : 'bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const toggleLanguage = (lang: 'BN' | 'EN') => {
    updateSettings({ ...settings, appLanguage: lang });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer flex-shrink-0">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20">
                <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                  <img
                    src="/shop_logo.png"
                    alt="Zafrin Electronics Logo"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/shop_icon_canvas.png';
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {settings.shopName}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t.offlineReady}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {settings.shopTagline} • <span className="text-slate-400 dark:text-slate-500">{todayStr}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium sm:hidden">
                {todayStr}
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 transition-all flex items-center gap-1.5"
              title={t.toggleTheme}
              aria-label={t.toggleTheme}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 animate-in spin-in-180 duration-300" />
              )}
              <span className="text-xs font-bold hidden lg:inline">
                {isDark ? (isEnglish ? 'Light' : 'লাইট') : (isEnglish ? 'Dark' : 'ডার্ক')}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/70 dark:border-slate-700">
              <button
                onClick={() => toggleLanguage('BN')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  !isEnglish
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="বাংলা ভাষায় পরিবর্তন করুন"
              >
                বাংলা
              </button>
              <button
                onClick={() => toggleLanguage('EN')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  isEnglish
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Quick Barcode Scanner button */}
            <button
              onClick={() => openScanner('search')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
              title={t.actionScanBarcode}
            >
              <QrCode className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline">{t.actionScanBarcode}</span>
            </button>

            {/* Quick Add Stock button */}
            <button
              onClick={openAddProduct}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span className="hidden xs:inline">{t.actionAddStock}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
