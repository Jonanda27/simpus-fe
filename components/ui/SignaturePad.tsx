import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

interface SignaturePadProps {
  onEnd: (dataUrl: string) => void;
  error?: string;
}

export function SignaturePad({ onEnd, error }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    if ('touches' in e && e.touches.length > 0) {
      const bcr = canvas.getBoundingClientRect();
      return { 
        offsetX: e.touches[0].clientX - bcr.left, 
        offsetY: e.touches[0].clientY - bcr.top 
      };
    }
    const mouseEvent = e as React.MouseEvent;
    return { 
      offsetX: mouseEvent.nativeEvent.offsetX, 
      offsetY: mouseEvent.nativeEvent.offsetY 
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Prevent scrolling when touching the canvas
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        onEnd(canvas.toDataURL('image/png'));
      }
    }
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onEnd(''); // Pass empty string when cleared
      }
    }
  };

  return (
    <div className="w-full">
      <div className={`relative bg-white border-2 rounded-none overflow-hidden touch-none ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="w-full h-[200px] cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <button
          type="button"
          onClick={clear}
          className="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10 rounded-none shadow-sm flex items-center justify-center"
          title="Hapus Tanda Tangan"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
