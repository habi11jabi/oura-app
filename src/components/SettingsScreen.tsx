import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Globe,
  Store,
  ShieldCheck,
  Sliders,
  Database,
  Save,
  RotateCcw,
  Plus,
  X,
  AlertTriangle,
  DownloadCloud,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { ShopSettings, ThemeMode } from '../types';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, resetSettings, clearAllData, loadDemoData, themeMode, setThemeMode, t } =
    useInventory();
  const isEnglish = settings.appLanguage === 'EN';

  const [formData, setFormData] = useState<ShopSettings>(() => ({ ...settings }));

  // New preset inputs
  const [newCompany, setNewCompany] = useState('');
  const [newVariant, setNewVariant] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newBox, setNewBox] = useState('');
  const [newSupplier, setNewSupplier] = useState('');
  const [newPayment, setNewPayment] = useState('');

  // Dialog states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLoadDemoConfirm, setShowLoadDemoConfirm] = useState(false);

  const handleLanguageChange = (lang: 'BN' | 'EN') => {
    setFormData((prev) => ({ ...prev, appLanguage: lang }));
    updateSettings({ ...formData, appLanguage: lang });
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setFormData((prev) => ({ ...prev, themeMode: mode }));
    setThemeMode(mode);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  // Helper for chip addition and removal
  const addChip = (key: keyof ShopSettings, val: string, clearFn: () => void) => {
    if (!val.trim()) return;
    const currentList = (formData[key] as string[]) || [];
    if (!currentList.includes(val.trim())) {
      setFormData({
        ...formData,
        [key]: [...currentList, val.trim()]
      });
    }
    clearFn();
  };

  const removeChip = (key: keyof ShopSettings, val: string) => {
    const currentList = (formData[key] as string[]) || [];
    setFormData({
      ...formData,
      [key]: currentList.filter((item) => item !== val)
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.settingsSubtitle}</p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Section: Theme Mode (Light / Dark / System) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{t.themeSectionTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.themeSectionSubtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
            {/* Light Mode Button */}
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                themeMode === 'light'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>{t.themeLight}</span>
            </button>

            {/* Dark Mode Button */}
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                themeMode === 'dark'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>{t.themeDark}</span>
            </button>

            {/* System Default */}
            <button
              type="button"
              onClick={() => handleThemeChange('system')}
              className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                themeMode === 'system'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span>{t.themeSystem}</span>
            </button>
          </div>
        </div>

        {/* Section 1: Language Switcher */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{t.languageSectionTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.languageSectionSubtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => handleLanguageChange('BN')}
              className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all ${
                formData.appLanguage === 'BN'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              বাংলা (Bengali)
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('EN')}
              className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all ${
                formData.appLanguage === 'EN'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Section 2: Shop Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{t.shopProfileSection}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isEnglish ? 'Details shown on digital invoices and header' : 'ক্যাশ মেমো ও হেডারে প্রদর্শিত তথ্য'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.shopNameLabel}</label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.shopTaglineLabel}</label>
              <input
                type="text"
                value={formData.shopTagline}
                onChange={(e) => setFormData({ ...formData, shopTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.shopPhoneLabel}</label>
              <input
                type="text"
                value={formData.shopPhone}
                onChange={(e) => setFormData({ ...formData, shopPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.shopAddressLabel}</label>
              <input
                type="text"
                value={formData.shopAddress}
                onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Warranty Policy Customization */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{t.warrantyCustomizationSection}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.warrantyDesc}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.warrantyReplacementLabel}
              </label>
              <input
                type="text"
                value={formData.warrantyReplacement}
                onChange={(e) => setFormData({ ...formData, warrantyReplacement: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.warrantyServiceLabel}
              </label>
              <input
                type="text"
                value={formData.warrantyService}
                onChange={(e) => setFormData({ ...formData, warrantyService: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.warrantyExchangeLabel}
              </label>
              <input
                type="text"
                value={formData.warrantyExchangeDeduction}
                onChange={(e) => setFormData({ ...formData, warrantyExchangeDeduction: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
              />
            </div>

            {/* Live Cash Memo Warranty Preview Box */}
            <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-2xl text-xs space-y-1 text-slate-800 dark:text-slate-200">
              <span className="font-bold text-amber-900 dark:text-amber-400 block">{t.warrantyLivePreview}</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                1. {formData.warrantyReplacement}
                <br />
                2. {formData.warrantyService}
                <br />
                3. {formData.warrantyExchangeDeduction}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Customize Preset Options & Input Windows */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{t.presetsSection}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isEnglish
                  ? 'Add or remove options appearing in dropdowns and fast chip pickers'
                  : 'প্রোডাক্ট যুক্ত করার সময় দ্রুত নির্বাচনের জন্য অপশন যুক্ত বা বাদ দিন'}
              </p>
            </div>
          </div>

          <div className="space-y-5 divide-y divide-slate-100 dark:divide-slate-800">
            {/* Companies */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.companyLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {formData.companyPresets.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeChip('companyPresets', c)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Motorola, Asus..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => addChip('companyPresets', newCompany, () => setNewCompany(''))}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isEnglish ? 'Add' : 'যুক্ত করুন'}</span>
                </button>
              </div>
            </div>

            {/* Storage Variants */}
            <div className="space-y-2 pt-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.variantLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {formData.variantPresets.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {v}
                    <button
                      type="button"
                      onClick={() => removeChip('variantPresets', v)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newVariant}
                  onChange={(e) => setNewVariant(e.target.value)}
                  placeholder="e.g. 2TB, 16GB..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => addChip('variantPresets', newVariant, () => setNewVariant(''))}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isEnglish ? 'Add' : 'যুক্ত করুন'}</span>
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2 pt-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.colorLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {formData.colorPresets.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeChip('colorPresets', c)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="e.g. Rose Gold, Green..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => addChip('colorPresets', newColor, () => setNewColor(''))}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isEnglish ? 'Add' : 'যুক্ত করুন'}</span>
                </button>
              </div>
            </div>

            {/* Box Conditions */}
            <div className="space-y-2 pt-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.boxConditionLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {formData.boxConditionPresets.map((box) => (
                  <span
                    key={box}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {box}
                    <button
                      type="button"
                      onClick={() => removeChip('boxConditionPresets', box)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newBox}
                  onChange={(e) => setNewBox(e.target.value)}
                  placeholder="e.g. ফ্রেশ কন্ডিশন..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => addChip('boxConditionPresets', newBox, () => setNewBox(''))}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isEnglish ? 'Add' : 'যুক্ত করুন'}</span>
                </button>
              </div>
            </div>

            {/* Suppliers */}
            <div className="space-y-2 pt-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.supplierSourceLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {formData.supplierPresets.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeChip('supplierPresets', s)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  placeholder="e.g. Hong Kong ZA/A..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => addChip('supplierPresets', newSupplier, () => setNewSupplier(''))}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isEnglish ? 'Add' : 'যুক্ত করুন'}</span>
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2 pt-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t.paymentMethodLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {formData.paymentMethodPresets.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {m}
                    <button
                      type="button"
                      onClick={() => removeChip('paymentMethodPresets', m)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newPayment}
                  onChange={(e) => setNewPayment(e.target.value)}
                  placeholder="e.g. City Bank Card, Upay..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => addChip('paymentMethodPresets', newPayment, () => setNewPayment(''))}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isEnglish ? 'Add' : 'যুক্ত করুন'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Data Management & Reset */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{t.dataManagementSection}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.dataManagementSubtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowLoadDemoConfirm(true)}
              className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-transparent dark:border-slate-700"
            >
              <DownloadCloud className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{t.btnLoadDemoData}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="py-3 px-4 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <span>{t.btnClearAllData}</span>
            </button>
          </div>
        </div>

        {/* Actions Bar: Save and Reset */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            className="w-full sm:flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{t.btnSaveSettings}</span>
          </button>
          <button
            type="button"
            onClick={resetSettings}
            className="w-full sm:w-auto py-3.5 px-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t.btnResetDefaults}</span>
          </button>
        </div>
      </form>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{t.confirmClearTitle}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.confirmClearText}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowClearConfirm(false);
                  clearAllData();
                }}
                className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                {t.delete}
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Demo Data Confirmation Modal */}
      {showLoadDemoConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <DownloadCloud className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{t.confirmLoadDemoTitle}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.confirmLoadDemoText}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowLoadDemoConfirm(false);
                  loadDemoData();
                }}
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                {t.confirm}
              </button>
              <button
                type="button"
                onClick={() => setShowLoadDemoConfirm(false)}
                className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
