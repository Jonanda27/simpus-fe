import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (base64Image: string | null) => void;
  error?: string;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, error }) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

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
  };

  return (
    <div className="space-y-3">
      <div className="relative w-full max-w-sm rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
        {imgSrc ? (
          <img src={imgSrc} alt="Tangkapan Kamera" className="w-full h-auto object-cover aspect-video" />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="w-full h-auto object-cover aspect-video"
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        {imgSrc ? (
          <button
            type="button"
            onClick={retake}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Ulangi Foto
          </button>
        ) : (
          <button
            type="button"
            onClick={capture}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Camera className="w-4 h-4" /> Ambil Foto
          </button>
        )}
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
