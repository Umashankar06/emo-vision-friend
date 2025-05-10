
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmotionDetector from '@/components/EmotionDetector';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <section className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Advanced Emotion Recognition
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            FaceRecg uses advanced technology to detect and analyze emotions from your face.
            Try it now with your webcam or upload an image!
          </p>
        </section>
        
        <Separator className="my-8" />
        
        <section className="py-6">
          <EmotionDetector />
        </section>

        <section className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="bg-secondary/50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📷</span>
              </div>
              <h4 className="font-medium mb-2">Capture</h4>
              <p className="text-sm text-muted-foreground">
                Use your webcam or upload an image to begin the emotion analysis process.
              </p>
            </div>
            
            <div className="p-4">
              <div className="bg-secondary/50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="font-medium mb-2">Analyze</h4>
              <p className="text-sm text-muted-foreground">
                Our system detects facial features and analyzes them to determine your emotional state.
              </p>
            </div>
            
            <div className="p-4">
              <div className="bg-secondary/50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-medium mb-2">Result</h4>
              <p className="text-sm text-muted-foreground">
                View your emotion analysis with confidence scores and visual feedback.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
