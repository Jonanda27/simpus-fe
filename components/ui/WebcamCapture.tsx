import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (base64Image: string | null) => void;
  error?: string;
}

type FrameShape = 'oval' | 'rounded';
type ScanStatus = 'standby' | 'scanning' | 'success' | 'error';

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, error }) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  
  // State 1: Shape (Oval Vertikal vs Rounded Rectangle)
  const [shape, setShape] = useState<FrameShape>('oval');
  
  // State 2: Status Scanning & Feedback Warna (Standby / Scanning / Success / Error)
  const [status, setStatus] = useState<ScanStatus>('standby');
  const [instructionText, setInstructionText] = useState('Posisikan wajah di dalam bingkai');

  // Simulation effect saat kamera aktif
  useEffect(() => {
    if (imgSrc) return;

    // Simulasi mendeteksi wajah & merubah feedback
    setStatus('standby');
    setInstructionText('Posisikan wajah di dalam bingkai');

    const scanTimer = setTimeout(() => {
      setStatus('scanning');
      setInstructionText('Membaca fitur wajah pasien...');
      
      const successTimer = setTimeout(() => {
        setStatus('success');
        setInstructionText('Wajah pas & terverifikasi!');
      }, 1800);

      return () => clearTimeout(successTimer);
    }, 1200);

    return () => clearTimeout(scanTimer);
  }, [imgSrc, shape]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImgSrc(null);
    onCapture(null);
    setStatus('standby');
  };

  // Color Styles berdasarkan Status
  const statusStyles = {
    standby: {
      border: 'border-blue-400',
      textBg: 'bg-blue-600/90 text-white',
      badge: 'Standby',
      accent: '#3b82f6',
      icon: Sparkles
    },
    scanning: {
      border: 'border-amber-400 animate-pulse',
      textBg: 'bg-amber-500/90 text-white',
      badge: 'Memindai...',
      accent: '#f59e0b',
      icon: RefreshCw
    },
    success: {
      border: 'border-emerald-500',
      textBg: 'bg-emerald-600 text-white shadow-lg font-bold',
      badge: 'Wajah Pas',
      accent: '#10b981',
      icon: CheckCircle2
    },
    error: {
      border: 'border-red-500',
      textBg: 'bg-red-600/90 text-white',
      badge: 'Posisi Salah',
      accent: '#ef4444',
      icon: ShieldAlert
    }
  }[status];

  const StatusIcon = statusStyles.icon;

  return (
    <div className="space-y-4 w-full">
      {/* 1. Selector Bentuk Bingkai (Oval vs Rounded Rect) & Status */}
      {!imgSrc && (
        <div className="flex items-center justify-between bg-slate-50 p-2 border border-slate-200">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShape('oval')}
              className={`px-3 py-1 text-xs font-semibold rounded-none transition-all ${
                shape === 'oval' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Oval Vertikal
            </button>
            <button
              type="button"
              onClick={() => setShape('rounded')}
              className={`px-3 py-1 text-xs font-semibold rounded-none transition-all ${
                shape === 'rounded' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Rounded Rectangle
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 border border-slate-200 bg-white">
            <StatusIcon className={`w-3 h-3 ${status === 'scanning' ? 'animate-spin text-amber-500' : ''}`} />
            <span>{statusStyles.badge}</span>
          </div>
        </div>
      )}

      {/* 2. Container Kamera Video & Overlay Bingkai (Full-Width Sejajar Card Header) */}
      <div className={`relative w-full rounded-none overflow-hidden bg-slate-950 border-2 transition-colors duration-300 ${statusStyles.border}`}>
        {imgSrc ? (
          <div className="relative">
            <img src={imgSrc} alt="Foto Wajah Pasien" className="w-full h-auto object-cover aspect-video" />
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 flex items-center gap-1.5 shadow-md">
              <UserCheck className="w-3.5 h-3.5" /> Foto Berhasil Diambil
            </div>
          </div>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="w-full h-auto object-cover aspect-video"
            />

            {/* Overlay Bingkai Wajah Multi-Shape + Indicator Corner */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 400 225" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <mask id="face-scanner-mask">
                    <rect width="400" height="225" fill="white" />
                    {shape === 'oval' ? (
                      /* Bentuk Oval Vertikal Presisi Simetris */
                      <ellipse cx="200" cy="112.5" rx="55" ry="78" fill="black" />
                    ) : (
                      /* Bentuk Rounded Rectangle */
                      <rect x="135" y="25" width="130" height="175" rx="20" fill="black" />
                    )}
                  </mask>
                </defs>

                {/* Dark Mask Backdrop Outside Frame */}
                <rect width="400" height="225" fill="rgba(15, 23, 42, 0.55)" mask="url(#face-scanner-mask)" />

                {/* Garis Bingkai Utama (Umpan Balik Warna Status) */}
                {shape === 'oval' ? (
                  <ellipse 
                    cx="200" 
                    cy="112.5" 
                    rx="55" 
                    ry="78" 
                    stroke={statusStyles.accent} 
                    strokeWidth="2.5" 
                    strokeDasharray={status === 'scanning' ? '8 6' : 'none'} 
                    className={status === 'scanning' ? 'animate-pulse' : ''}
                  />
                ) : (
                  <rect 
                    x="135" 
                    y="25" 
                    width="130" 
                    height="175" 
                    rx="20" 
                    stroke={statusStyles.accent} 
                    strokeWidth="2.5" 
                    strokeDasharray={status === 'scanning' ? '8 6' : 'none'} 
                    className={status === 'scanning' ? 'animate-pulse' : ''}
                  />
                )}

                {/* Corner Marks (Garis Batas Sudut Pas di Sekitar Bingkai) */}
                <g stroke={statusStyles.accent} strokeWidth="3" strokeLinecap="round">
                  {/* Top-Left Corner */}
                  <path d="M 125 20 L 140 20 M 125 20 L 125 35" />
                  {/* Top-Right Corner */}
                  <path d="M 275 20 L 260 20 M 275 20 L 275 35" />
                  {/* Bottom-Left Corner */}
                  <path d="M 125 205 L 140 205 M 125 205 L 125 190" />
                  {/* Bottom-Right Corner */}
                  <path d="M 275 205 L 260 205 M 275 205 L 275 190" />
                </g>

                {/* Scanning Laser Line */}
                {status === 'scanning' && (
                  <line x1="130" y1="112.5" x2="270" y2="112.5" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
                )}
              </svg>

              {/* Teks Instruksi Melayang Presisi di Tengah Bawah */}
              <div className="absolute bottom-2.5 inset-x-0 flex justify-center items-center pointer-events-none">
                <div className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all rounded-full ${statusStyles.textBg}`}>
                  <span>{instructionText}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Teks Panduan & Tombol Aksi */}
      <div className="space-y-2">
        {!imgSrc && (
          <p className="text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-700">Tips:</span> Lepaskan masker/kacamata hitam & pastikan pencahayaan terang.
          </p>
        )}

        <div className="flex items-center gap-3">
          {imgSrc ? (
            <button
              type="button"
              onClick={retake}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-800 rounded-none hover:bg-slate-300 transition-colors text-sm font-semibold"
            >
              <RefreshCw className="w-4 h-4" /> Ulangi Foto Pasien
            </button>
          ) : (
            <button
              type="button"
              onClick={capture}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition-colors text-sm font-semibold shadow-xs"
            >
              <Camera className="w-4 h-4" /> Ambil Foto Wajah
            </button>
          )}
        </div>
      </div>
      
      {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
    </div>
  );
};
