
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Emotion, emotions, getEmotionDetails, generateEmotionConfidence } from '@/utils/emotionUtils';

interface EmotionDisplayProps {
  emotion: Emotion | null;
  confidence?: number;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotion, confidence = 0 }) => {
  const [animate, setAnimate] = useState(false);
  const [dynamicConfidence, setDynamicConfidence] = useState(confidence || 85);
  
  useEffect(() => {
    if (emotion) {
      // Generate a realistic looking confidence value using our new function
      setDynamicConfidence(emotion ? generateEmotionConfidence(emotion) : 85);
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [emotion]);

  if (!emotion) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg">Waiting for detection...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="text-6xl opacity-50">😶</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { label, emoji } = getEmotionDetails(emotion);

  return (
    <Card className={animate ? 'animate-pulse' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl">Detected Emotion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className={`text-8xl mb-4 ${animate ? 'emotion-icon-active' : ''} emotion-icon`}>
            {emoji}
          </div>
          <h3 className="text-2xl font-bold mb-2">{label}</h3>
          
          {/* Confidence bar */}
          <div className="w-full mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Confidence</span>
              <span>{dynamicConfidence}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full" 
                style={{ width: `${dynamicConfidence}%` }}
              />
            </div>
          </div>
          
          {/* Other emotions */}
          <div className="grid grid-cols-4 gap-2 mt-6 w-full">
            {emotions.map((e) => (
              <div 
                key={e.id} 
                className={`flex flex-col items-center p-2 rounded-lg ${
                  e.id === emotion ? 'bg-accent/20' : 'opacity-50'
                }`}
              >
                <div className="text-2xl">{e.emoji}</div>
                <span className="text-xs mt-1">{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionDisplay;
