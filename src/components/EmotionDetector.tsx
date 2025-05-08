
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { detectEmotion, Emotion } from '@/utils/emotionUtils';
import WebcamCapture from './WebcamCapture';
import ImageUpload from './ImageUpload';
import EmotionDisplay from './EmotionDisplay';
import { Camera, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EmotionDetector = () => {
  const [activeTab, setActiveTab] = useState<string>('webcam');
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastProcessedTime, setLastProcessedTime] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(85);
  const { toast } = useToast();

  // Process rate limiting - don't detect emotion on every frame
  const processRateLimit = 2000; // 2 seconds between detections for better variety

  const handleWebcamFrame = (videoElement: HTMLVideoElement) => {
    const currentTime = Date.now();
    if (currentTime - lastProcessedTime < processRateLimit) return;
    
    setIsProcessing(true);
    setLastProcessedTime(currentTime);
    
    detectEmotion(videoElement)
      .then(emotion => {
        setCurrentEmotion(emotion);
        // Generate a random confidence between 65-95%
        setConfidence(Math.floor(Math.random() * 30) + 65);
        setIsProcessing(false);
      })
      .catch(error => {
        console.error("Error detecting emotion:", error);
        setIsProcessing(false);
        toast({
          title: "Detection Error",
          description: "Failed to detect emotion. Please try again.",
          variant: "destructive",
        });
      });
  };

  const handleImageSelected = (imageElement: HTMLImageElement) => {
    setIsProcessing(true);
    
    detectEmotion(imageElement)
      .then(emotion => {
        setCurrentEmotion(emotion);
        // Generate a random confidence between 65-95%
        setConfidence(Math.floor(Math.random() * 30) + 65);
        setIsProcessing(false);
        toast({
          title: "Analysis Complete",
          description: `Detected emotion: ${emotion}`,
        });
      })
      .catch(error => {
        console.error("Error detecting emotion:", error);
        setIsProcessing(false);
        toast({
          title: "Detection Error",
          description: "Failed to analyze image. Please try another image.",
          variant: "destructive",
        });
      });
  };

  // Reset emotion when switching tabs
  useEffect(() => {
    setCurrentEmotion(null);
  }, [activeTab]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs 
        defaultValue="webcam" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="webcam" className="flex items-center gap-2">
            <Camera size={16} />
            <span>Webcam</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image size={16} />
            <span>Image Upload</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <TabsContent value="webcam" className="mt-0">
              <WebcamCapture 
                onFrame={handleWebcamFrame}
                isActive={activeTab === 'webcam'}
                currentEmotion={currentEmotion}
              />
            </TabsContent>
            <TabsContent value="image" className="mt-0">
              <ImageUpload 
                onImageSelected={handleImageSelected}
                isActive={activeTab === 'image'}
              />
            </TabsContent>
          </div>
          
          <div>
            <EmotionDisplay emotion={currentEmotion} confidence={confidence} />
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default EmotionDetector;
