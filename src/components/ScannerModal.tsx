import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Camera, Flashlight, Sparkles, Check, AlertCircle } from 'lucide-react';

export const ScannerModal: React.FC = () => {
  const { isScannerOpen, closeScanner, onScannerBarcodeFound, settings, t } = useInventory();
  const isEnglish = settings.appLanguage === 'EN';

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualImei, setManualImei] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isScannerOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let isMounted = true;

    async function initCamera() {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        setHasPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Check if BarcodeDetector is natively supported
        if ('BarcodeDetector' in window) {
          try {
            // @ts-expect-error BarcodeDetector browser experimental API
            const barcodeDetector = new window.BarcodeDetector({
              formats: ['code_128', 'ean_13', 'qr_code', 'upc_a']
            });

            const scanInterval = setInterval(async () => {
              if (!isMounted || !videoRef.current || videoRef.current.readyState < 2) return;
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const val = barcodes[0].rawValue;
                  if (val) {
                    clearInterval(scanInterval);
                    if ('vibrate' in navigator) navigator.vibrate(80);
                    onScannerBarcodeFound(val);
                  }
                }
              } catch (_) {}
            }, 500);

            return () => clearInterval(scanInterval);
          } catch (_) {}
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setHasPermission(false);
        setCameraError(
          err instanceof Error ? err.message : (isEnglish ? 'Camera access failed' : 'ক্যামেরা সংযোগ করা যায়নি')
        );
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isScannerOpen, isEnglish]);

  if (!isScannerOpen) return null;

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        // @ts-expect-error Torch constraint
        await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
        setTorchOn(!torchOn);
      } catch (_) {}
    }
  };

  const handleManualConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualImei.trim()) return;
    if ('vibrate' in navigator) navigator.vibrate(60);
    onScannerBarcodeFound(manualImei.trim());
  };

  const generateAutoImei = () => {
    const randomSuffix = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    const generated = '35' + randomSuffix;
    setManualImei(generated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 text-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t.scannerTitle}</h3>
              <p className="text-[11px] text-slate-400">{t.scannerSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {hasPermission && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-2 rounded-full transition-colors ${
                  torchOn ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
                title="Toggle Flashlight"
              >
                <Flashlight className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={closeScanner}
              className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Camera Viewfinder Box */}
        <div className="p-4">
          <div className="relative w-full h-64 sm:h-72 bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {hasPermission === false || cameraError ? (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <Camera className="h-10 w-10 mx-auto text-slate-600 mb-1" />
                <p className="text-xs font-semibold">{t.scannerPermissionRequired}</p>
                <p className="text-[11px] text-slate-500">
                  {isEnglish
                    ? 'You can enter the IMEI number manually or use the generator below.'
                    : 'নিচের বক্সে সরাসরি IMEI নম্বর লিখুন অথবা অটো-জেনারেটর ব্যবহার করুন।'}
                </p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Viewfinder Reticle Target Frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-56 h-36 border-2 border-blue-500/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    {/* Corner Reticles */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>

                    {/* Animated Scanning Laser Line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_#38bdf8]"></div>
                  </div>
                </div>

                {/* Instruction Pill */}
                <div className="absolute bottom-3 px-3 py-1 bg-black/60 backdrop-blur-xs rounded-full text-[11px] font-medium text-slate-200">
                  {t.scannerFrameHint}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Manual Input & Auto Generate Box */}
        <form onSubmit={handleManualConfirm} className="p-4 pt-0 space-y-3">
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">{t.scannerManualTitle}</span>
              <button
                type="button"
                onClick={generateAutoImei}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isEnglish ? 'Generate IMEI' : 'অটো তৈরি করুন'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualImei}
                onChange={(e) => setManualImei(e.target.value)}
                placeholder={t.scannerManualPlaceholder}
                className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono-code font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="submit"
                disabled={!manualImei.trim()}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <Check className="h-4 w-4" />
                <span>{t.confirm}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
