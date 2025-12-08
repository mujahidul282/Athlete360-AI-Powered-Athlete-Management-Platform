import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Video as VideoIcon, StopCircle, PlayCircle, Loader2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

const PracticeCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'live' | 'upload'>('live');

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setAnalysisResult(null);
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    // Draw video frame to canvas
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);

    // Get Base64
    const imageBase64 = canvasRef.current.toDataURL('image/jpeg');

    // Send to Gemini
    const result = await GeminiService.analyzePracticeFrame(imageBase64);
    setAnalysisResult(result || "Analysis failed.");
    setAnalyzing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await GeminiService.analyzePracticeFrame(base64);
        setAnalysisResult(result || "Analysis failed.");
        setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Practice Capture & AI Analysis</h2>
      
      {/* Mode Toggle */}
      <div className="flex gap-4">
        <button 
            onClick={() => setMode('live')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${mode === 'live' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
        >
            <div className="flex items-center justify-center gap-2">
                <Camera size={20} /> Live Camera
            </div>
        </button>
        <button 
            onClick={() => { setMode('upload'); stopCamera(); }}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${mode === 'upload' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
        >
            <div className="flex items-center justify-center gap-2">
                <Upload size={20} /> Upload Media
            </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Capture Area */}
        <div className="bg-black rounded-xl overflow-hidden aspect-video relative flex items-center justify-center shadow-lg">
            {mode === 'live' ? (
                <>
                    {isCameraActive ? (
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <VideoIcon size={48} className="mx-auto text-slate-500 mb-2" />
                            <p className="text-slate-400">Camera is off</p>
                        </div>
                    )}
                    
                    {/* Controls Overlay */}
                    <div className="absolute bottom-6 left-0 w-full flex justify-center gap-4">
                        {!isCameraActive ? (
                            <button onClick={startCamera} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors">
                                <PlayCircle size={20} /> Start Camera
                            </button>
                        ) : (
                            <>
                                <button onClick={captureAndAnalyze} disabled={analyzing} className="bg-white text-emerald-600 hover:bg-gray-100 px-6 py-2 rounded-full flex items-center gap-2 font-bold transition-colors">
                                    {analyzing ? <Loader2 className="animate-spin" size={20} /> : <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />}
                                    Analyze Form
                                </button>
                                <button onClick={stopCamera} className="bg-slate-800/80 hover:bg-slate-800 text-white px-4 py-2 rounded-full transition-colors">
                                    <StopCircle size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2">
                        <Upload size={20} /> Select Image/Video Frame
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <p className="text-slate-500 text-sm mt-4">Upload a frame from your training video</p>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Results Area */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">
                Vision Analysis
            </h3>
            
            <div className="flex-1 overflow-y-auto">
                {analyzing ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Loader2 className="animate-spin mb-2 text-emerald-500" size={32} />
                        <p>Gemini is analyzing your technique...</p>
                    </div>
                ) : analysisResult ? (
                    <div className="prose dark:prose-invert">
                        <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                            {analysisResult}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Camera size={32} className="mb-2 opacity-20" />
                        <p>Capture or upload media to see insights.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeCapture;