import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, QrCode, Sparkles, Check, AlertCircle } from 'lucide-react';
import { formatBdt } from '../utils/constants';

export const AddEditProductModal: React.FC = () => {
  const { isAddEditOpen, editingProduct, closeAddEdit, addProduct, updateProduct, settings, openScanner, t } =
    useInventory();

  const isEnglish = settings.appLanguage === 'EN';
  const lang = settings.appLanguage;

  const [company, setCompany] = useState('Apple');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('256GB');
  const [color, setColor] = useState('Natural Titanium');
  const [batteryHealth, setBatteryHealth] = useState('100%');
  const [boxCondition, setBoxCondition] = useState('ইনট্যাক্ট (Sealed Box)');
  const [supplier, setSupplier] = useState('Dubai Stock');
  const [purchasePriceStr, setPurchasePriceStr] = useState('');
  const [targetSalePriceStr, setTargetSalePriceStr] = useState('');
  const [imei, setImei] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setCompany(editingProduct.company);
      setModel(editingProduct.model);
      setVariant(editingProduct.variant);
      setColor(editingProduct.color);
      setBatteryHealth(editingProduct.batteryHealth);
      setBoxCondition(editingProduct.boxCondition);
      setSupplier(editingProduct.supplier);
      setPurchasePriceStr(editingProduct.purchasePrice.toString());
      setTargetSalePriceStr(editingProduct.targetSalePrice.toString());
      setImei(editingProduct.imei);
      setNotes(editingProduct.notes);
    } else {
      setCompany(settings.companyPresets[0] || 'Apple');
      setModel('');
      setVariant(settings.variantPresets[1] || '128GB');
      setColor(settings.colorPresets[0] || 'Natural Titanium');
      setBatteryHealth(settings.batteryPresets[0] || '100%');
      setBoxCondition(settings.boxConditionPresets[0] || 'ইনট্যাক্ট (Sealed Box)');
      setSupplier(settings.supplierPresets[0] || 'Dubai Stock');
      setPurchasePriceStr('');
      setTargetSalePriceStr('');
      setImei('');
      setNotes('USA LL/A, 1 Year Service Warranty');
    }
    setValidationError(null);
  }, [editingProduct, isAddEditOpen, settings]);

  if (!isAddEditOpen) return null;

  const cost = parseFloat(purchasePriceStr) || 0;
  const target = parseFloat(targetSalePriceStr) || 0;
  const estimatedProfit = target - cost;
  const profitMargin = target > 0 ? ((estimatedProfit / target) * 100).toFixed(1) : '0';

  const generateRandomImei = () => {
    const randomSuffix = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    setImei('35' + randomSuffix);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim() || !model.trim()) {
      setValidationError(isEnglish ? 'Please enter company and phone model name.' : 'অনুগ্রহ করে কোম্পানি ও মডেলের নাম লিখুন।');
      return;
    }
    if (cost <= 0) {
      setValidationError(isEnglish ? 'Please enter a valid purchase cost price.' : 'সঠিক কেনা দাম উল্লেখ করুন।');
      return;
    }
    if (target <= 0) {
      setValidationError(isEnglish ? 'Please enter a valid target sale price.' : 'সঠিক বিক্রয় মূল্য উল্লেখ করুন।');
      return;
    }
    if (!imei.trim()) {
      setValidationError(isEnglish ? 'Please enter or scan a 15-digit IMEI.' : 'IMEI বা বারকোড নম্বর লিখুন অথবা স্ক্যান করুন।');
      return;
    }

    setValidationError(null);

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        company: company.trim(),
        model: model.trim(),
        variant: variant.trim(),
        color: color.trim(),
        batteryHealth: batteryHealth.trim(),
        boxCondition: boxCondition.trim(),
        supplier: supplier.trim(),
        purchasePrice: cost,
        targetSalePrice: target,
        imei: imei.trim(),
        notes: notes.trim()
      });
    } else {
      addProduct({
        company: company.trim(),
        model: model.trim(),
        variant: variant.trim(),
        color: color.trim(),
        batteryHealth: batteryHealth.trim(),
        boxCondition: boxCondition.trim(),
        supplier: supplier.trim(),
        purchasePrice: cost,
        targetSalePrice: target,
        imei: imei.trim(),
        notes: notes.trim()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {editingProduct ? t.editProductTitle : t.addProductTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {settings.shopName} • {t.productFormSubtitle}
            </p>
          </div>
          <button
            onClick={closeAddEdit}
            className="h-9 w-9 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Validation banner */}
          {validationError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Company / Brand */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.companyLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {settings.companyPresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setCompany(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    company === preset
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Apple, Samsung"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* 2. Model */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.modelLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={isEnglish ? 'e.g. iPhone 15 Pro Max, Galaxy S24 Ultra' : 'যেমন: iPhone 15 Pro Max, Galaxy S24...'}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          {/* 3. Storage Variant & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.variantLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1 mb-1">
                {settings.variantPresets.map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      variant === v
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="128GB, 256GB..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.colorLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1 mb-1">
                {settings.colorPresets.slice(0, 4).map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      color === c
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Natural Titanium, Midnight..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
              />
            </div>
          </div>

          {/* 4. Battery Health & Box Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.batteryHealthLabel}
              </label>
              <div className="flex flex-wrap gap-1 mb-1">
                {settings.batteryPresets.map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setBatteryHealth(b)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      batteryHealth === b
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(e.target.value)}
                placeholder="100%, 95%..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.boxConditionLabel}
              </label>
              <div className="flex flex-wrap gap-1 mb-1">
                {settings.boxConditionPresets.slice(0, 3).map((box) => (
                  <button
                    type="button"
                    key={box}
                    onClick={() => setBoxCondition(box)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      boxCondition === box
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {box}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={boxCondition}
                onChange={(e) => setBoxCondition(e.target.value)}
                placeholder="ইনট্যাক্ট, মেচিং বক্স..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
              />
            </div>
          </div>

          {/* 5. Supplier / Source */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.supplierSourceLabel}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {settings.supplierPresets.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSupplier(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    supplier === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Dubai Stock, USA LL/A, Local Dealer..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
            />
          </div>

          {/* 6. Pricing (Cost & Target Selling Price) with Live Profit Preview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              {isEnglish ? 'Price & Profit Breakdown' : 'দাম ও লাভের হিসাব'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.purchasePriceInputLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={purchasePriceStr}
                    onChange={(e) => setPurchasePriceStr(e.target.value)}
                    placeholder="e.g. 125000"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.targetPriceInputLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-600 dark:text-blue-400 font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={targetSalePriceStr}
                    onChange={(e) => setTargetSalePriceStr(e.target.value)}
                    placeholder="e.g. 135000"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400"
                    required
                  />
                </div>
              </div>
            </div>

            {target > 0 && cost > 0 && (
              <div
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                  estimatedProfit >= 0
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                }`}
              >
                <span>{t.potentialProfitLabel}</span>
                <span>
                  ৳{formatBdt(estimatedProfit, lang)} ({profitMargin}%)
                </span>
              </div>
            )}
          </div>

          {/* 7. IMEI / Barcode with Camera Scan & Auto Generate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.imeiInputLabel} <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={generateRandomImei}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t.btnAutoGenImei}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="354891098234125"
                className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono-code font-bold tracking-wider dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => openScanner('imei-input')}
                className="h-10 px-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-1 text-xs font-bold transition-all"
                title={t.btnScanImei}
              >
                <QrCode className="h-4 w-4" />
                <span className="hidden sm:inline">{t.btnScanImei}</span>
              </button>
            </div>
          </div>

          {/* 8. Additional Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.notesLabel}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isEnglish ? 'e.g. USA LL/A, 10 days replacement...' : 'যেমন: USA LL/A, ১০ দিন রিপ্লেসমেন্ট...'}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>{editingProduct ? (isEnglish ? 'Update Product' : 'তথ্য আপডেট করুন') : t.btnSaveProduct}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
