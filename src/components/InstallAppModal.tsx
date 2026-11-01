import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  X,
  Download,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Share2,
  Sparkles
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallAppModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { settings, showToast, t } = useInventory();
  const isEnglish = settings.appLanguage === 'EN';

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');

  useEffect(() => {
    // Check if already installed in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone) {
      setIsStandalone(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        showToast(isEnglish ? 'App installed on your home screen!' : 'অ্যাপটি আপনার মোবাইলে ইনস্টল হয়েছে!');
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      // Fallback instructions for manual home screen add
      showToast(
        isEnglish
          ? 'Tap Chrome menu (⋮) -> "Install App" or "Add to Home screen"'
          : 'ব্রাউজারের ৩ ডট মেনু (⋮) থেকে "Install App" বা "Add to Home screen" চাপুন'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {isEnglish ? 'Install on Mobile & APK Guide' : 'মোবাইলে ইনস্টল ও APK সমাধান'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isEnglish ? 'Run natively on Android & iOS without issues' : 'কোনো ঝামেলা ছাড়াই মোবাইলে অ্যাপ হিসেবে ব্যবহার করুন'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('pwa')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'pwa'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>{isEnglish ? '1-Tap Install (Recommended)' : '১-ট্যাপে ইনস্টল (সবচেয়ে সহজ)'}</span>
            </button>
            <button
              onClick={() => setActiveTab('apk')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'apk'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>{isEnglish ? 'Android APK Guide' : 'Android APK গাইড'}</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          {activeTab === 'pwa' ? (
            <div className="space-y-4">
              {/* App Card Info */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 rounded-2xl flex items-center gap-3.5">
                <img
                  src="/shop_logo.png"
                  alt="App Icon"
                  className="h-14 w-14 rounded-2xl object-contain bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {settings.shopName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {isEnglish ? 'Official Standalone Mobile App' : 'অফিসিয়াল স্ট্যান্ডঅ্যালোন মোবাইল অ্যাপ'}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isEnglish ? '100% Offline Capable & Auto Updates' : '১০০% অফলাইনে সচল ও সম্পূর্ণ সুরক্ষিত'}</span>
                  </div>
                </div>
              </div>

              {/* Install Trigger Button */}
              <div>
                <button
                  onClick={handleInstallPWA}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>{isEnglish ? 'Install App on Your Phone Now' : 'মোবাইলে অ্যাপ ইনস্টল করুন (Install App)'}</span>
                </button>
              </div>

              {/* Step by Step Instructions */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  {isEnglish ? 'How it installs on Android / iOS:' : 'যেভাবে কোনো ঝামেলা ছাড়া ইনস্টল হবে:'}
                </div>
                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                      ১
                    </span>
                    <p>
                      <strong>Android Chrome:</strong> উপরের বোতামে চাপ দিন অথবা ক্রোমের উপরের ৩-ডট মেনু (⋮) থেকে{' '}
                      <span className="font-bold text-slate-900 dark:text-white">"Install app" বা "Add to Home screen"</span> এ চাপ দিন।
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                      ২
                    </span>
                    <p>
                      এটি নিমেষেই ফোনের হোম স্ক্রিনে অ্যাপ আইকন তৈরি করে একটি ফুলস্ক্রিন নেটিভ অ্যাপের মতো চালু হবে। কোনো ফাইল ডাউনলোড বা পারমিশনের ঝামেলা নেই!
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                      ৩
                    </span>
                    <p>
                      <strong>iPhone (iOS Safari):</strong> নিচে Share বোতামে (⎋) চাপ দিয়ে{' '}
                      <span className="font-bold text-slate-900 dark:text-white">"Add to Home Screen (⊞)"</span> নির্বাচন করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 1-Click APK Generator (PWABuilder) */}
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/90 border border-indigo-100 dark:border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {isEnglish ? 'Instant APK Generator (PWABuilder)' : '১-ক্লিকে অনলাইন থেকে APK তৈরি করুন'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {isEnglish
                        ? 'Generate a signed or debug Android APK in 30 seconds'
                        : 'Microsoft PWABuilder দিয়ে ৩০ সেকেন্ডে সরাসরি মোবাইলের জন্য APK ফাইল ডাউনলোড করুন'}
                    </p>
                  </div>
                </div>

                {/* App URL and Copy */}
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="flex-1 bg-transparent border-none text-slate-600 dark:text-slate-300 font-mono text-[11px] outline-hidden truncate"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast(isEnglish ? 'App URL copied!' : 'অ্যাপের লিংক কপি করা হয়েছে!');
                    }}
                    className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Share2 className="h-3 w-3" />
                    <span>{isEnglish ? 'Copy' : 'কপি করুন'}</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={`https://www.pwabuilder.com/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                  >
                    <span>{isEnglish ? 'Build APK on PWABuilder' : 'PWABuilder-এ APK বানান'}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* APK Project Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Download className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {isEnglish ? 'Android Project Source (Kotlin / Gradle)' : 'অ্যান্ড্রয়েড প্রজেক্ট সোর্স (Kotlin / Gradle)'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        apple-area-bd__2__1__2f9816f5.zip
                      </p>
                    </div>
                  </div>
                  <a
                    href="/assets/aistudio/apple-area-bd__2__1__2f9816f5.zip"
                    download="apple-area-bd.zip"
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isEnglish ? 'Download ZIP' : 'ডাউনলোড জিপ'}</span>
                  </a>
                </div>
              </div>

              {/* Troubleshooting APK Warnings Guide */}
              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center gap-1.5 font-extrabold text-amber-900 dark:text-amber-400 text-xs">
                  <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>{isEnglish ? 'How to install APK without errors on Android:' : 'অ্যান্ড্রয়েডে APK ঝামেলা ছাড়া ইনস্টল করার নিয়ম:'}</span>
                </div>

                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                    <strong className="text-slate-900 dark:text-white block mb-0.5">
                      ১. Play Protect এর সতর্কতা বাইপাস করা:
                    </strong>
                    যদি ইনস্টলের সময় <em>"Blocked by Play Protect"</em> বা <em>"Unrecognized App"</em> বার্তা আসে, তবে ভয় পাওয়ার কিছু নেই (এটি প্লে স্টোরের বাইরের নিজস্ব বিল্ড হওয়ায় গুগল সতর্ক করে)। নিচে <span className="font-bold text-blue-600 dark:text-blue-400">"More details" (বিস্তারিত)</span> এ চাপ দিয়ে <span className="font-bold text-emerald-600 dark:text-emerald-400">"Install anyway" (তবুও ইনস্টল করুন)</span> নির্বাচন করুন।
                  </div>

                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                    <strong className="text-slate-900 dark:text-white block mb-0.5">
                      ২. Unknown Sources পারমিশন দেওয়া:
                    </strong>
                    ফোনের Settings &gt; Security &gt; <em>"Install unknown apps"</em> অথবা ব্রাউজারের নোটিফিকেশন আসলে <em>"Allow from this source"</em> অন করে দিন।
                  </div>

                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                    <strong className="text-slate-900 dark:text-white block mb-0.5">
                      ৩. অটোমেটিক APK তৈরি (GitHub Actions):
                    </strong>
                    প্রোজেক্টটির সাথে দেওয়া <code>.github/workflows/build-apk.yml</code> ফাইলটির মাধ্যমে গিটহাবে কোডটি আপলোড করলেই অটোমেটিক ক্লাউডে বিল্ড হয়ে সরাসরি <code>app-debug.apk</code> তৈরি হয়ে যায়।
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {isEnglish ? 'Need help? Contact support.' : 'যেকোনো সহযোগিতার জন্য যোগাযোগ করুন।'}
          </span>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
