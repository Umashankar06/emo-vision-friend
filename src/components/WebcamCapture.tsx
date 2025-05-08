
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { drawFacialLandmarks } from '@/utils/emotionUtils';
import { Camera, CameraOff } from 'lucide-react';

interface WebcamCaptureProps {
  onFrame: (videoElement: HTMLVideoElement) => void;
  isActive: boolean;
  currentEmotion: string | null;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onFrame, isActive, currentEmotion }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startWebcam = async () => {
    if (!videoRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setHasCamera(false);
      setError("Unable to access camera. Please make sure you have granted permission.");
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (!videoRef.current?.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreaming(false);
  };

  useEffect(() => {
    if (isActive && !isStreaming && hasCamera) {
      startWebcam();
    } else if (!isActive && isStreaming) {
      stopWebcam();
    }

    return () => {
      if (isStreaming) {
        stopWebcam();
      }
    };
  }, [isActive, hasCamera]);

  useEffect(() => {
    const processFrame = () => {
      if (isStreaming && videoRef.current && videoRef.current.readyState === 4) {
        if (canvasRef.current && videoRef.current) {
          drawFacialLandmarks(canvasRef.current, videoRef.current, currentEmotion as any);
        }
        onFrame(videoRef.current);
      }
      
      if (isStreaming) {
        requestAnimationFrame(processFrame);
      }
    };

    if (isStreaming) {
      requestAnimationFrame(processFrame);
    }
  }, [isStreaming, onFrame, currentEmotion]);

  return (
    <Card className={`shadow-lg ${isActive && isStreaming ? 'webcam-active' : ''}`}>
      <CardContent className="p-3">
        <div className="webcam-container aspect-video rounded-lg relative bg-black/5">
          {error && (
            <div className="absolute inset-0 flex items-center justify-center flex-col p-4">
              <CameraOff size={40} className="text-muted-foreground mb-2" />
              <p className="text-center text-muted-foreground">{error}</p>
            </div>
          )}
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`${error ? 'hidden' : 'block'}`}
            onPlay={() => setIsStreaming(true)}
          />
          <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
        <div className="flex justify-center mt-3">
          <Button 
            variant={isStreaming ? "destructive" : "default"}
            size="sm"
            onClick={isStreaming ? stopWebcam : startWebcam}
            disabled={!hasCamera && !isStreaming}
            className="flex gap-2 items-center"
          >
            {isStreaming ? (
              <>
                <CameraOff size={16} />
                <span>Stop Camera</span>
              </>
            ) : (
              <>
                <Camera size={16} />
                <span>Start Camera</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebcamCapture;
