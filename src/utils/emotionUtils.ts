
// List of emotions our system can detect
export const emotions = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'surprised', label: 'Surprised', emoji: '😲' },
  { id: 'fearful', label: 'Fearful', emoji: '😨' },
  { id: 'disgusted', label: 'Disgusted', emoji: '🤢' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
] as const;

export type Emotion = typeof emotions[number]['id'];

// A more advanced (but still simulated) emotion detection algorithm
// In a real app, this would use a pre-trained model like TensorFlow.js
export const detectEmotion = (imageElement: HTMLImageElement | HTMLVideoElement): Promise<Emotion> => {
  return new Promise((resolve) => {
    // Simulate detection delay
    setTimeout(() => {
      // For demo purposes, we'll use a more consistent approach
      // In a real implementation, this would analyze pixel data and facial features
      
      // Get the image/video dimensions for analysis
      const width = imageElement.naturalWidth || imageElement.videoWidth || 300;
      const height = imageElement.naturalHeight || imageElement.videoHeight || 300;
      
      // Create a canvas to process the image data
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        // Fallback if canvas context isn't available
        resolve('neutral');
        return;
      }
      
      // Set canvas dimensions to match image/video
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image/video to the canvas
      context.drawImage(imageElement, 0, 0, width, height);
      
      // Get the central portion of the face (roughly where features would be)
      const centerX = Math.floor(width / 2);
      const centerY = Math.floor(height / 2);
      const sampleSize = Math.min(width, height) / 5;
      
      // Get pixel data from the center region (simulating face detection)
      const faceRegion = context.getImageData(
        centerX - sampleSize / 2,
        centerY - sampleSize / 2,
        sampleSize,
        sampleSize
      );
      
      // Calculate average color values (this is a simple proxy for actual emotion detection)
      let totalR = 0, totalG = 0, totalB = 0;
      const pixelData = faceRegion.data;
      
      for (let i = 0; i < pixelData.length; i += 4) {
        totalR += pixelData[i];
        totalG += pixelData[i + 1];
        totalB += pixelData[i + 2];
      }
      
      const pixelCount = pixelData.length / 4;
      const avgR = totalR / pixelCount;
      const avgG = totalG / pixelCount;
      const avgB = totalB / pixelCount;
      
      // Calculate brightness and color balance
      const brightness = (avgR + avgG + avgB) / 3;
      const redGreenRatio = avgR / avgG;
      const blueGreenRatio = avgB / avgG;
      
      // Very simplified emotion detection based on color values
      // Note: This is *not* scientifically accurate, just for demo purposes
      
      // High brightness often correlates with 'happy' or 'surprised'
      if (brightness > 150) {
        if (redGreenRatio > 1.1) return resolve('happy');
        if (blueGreenRatio > 1.1) return resolve('surprised');
        return resolve('neutral');
      }
      
      // Lower brightness might indicate 'sad', 'fearful', or 'angry'
      if (brightness < 100) {
        if (redGreenRatio > 1.2) return resolve('angry');
        if (blueGreenRatio > 1.2) return resolve('fearful');
        return resolve('sad');
      }
      
      // Middle brightness with high red might be 'disgusted'
      if (redGreenRatio > 1.3 && brightness > 100) {
        return resolve('disgusted');
      }
      
      // Default to neutral
      resolve('neutral');
    }, 500);
  });
};

export const getEmotionDetails = (emotion: Emotion) => {
  return emotions.find(e => e.id === emotion) || emotions[6]; // Default to neutral
};

export const drawFacialLandmarks = (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  emotion: Emotion | null
) => {
  const context = canvas.getContext('2d');
  if (!context) return;

  // Clear previous drawing
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Only draw if we have an emotion to display
  if (emotion) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const faceSize = Math.min(canvas.width, canvas.height) * 0.3;
    
    // Draw face outline
    context.beginPath();
    context.arc(centerX, centerY, faceSize, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(130, 87, 229, 0.7)';
    context.lineWidth = 2;
    context.stroke();
    
    // Draw eyes - adjust based on emotion
    const eyeSize = faceSize * 0.15;
    const eyeOffsetX = faceSize * 0.3;
    const eyeOffsetY = faceSize * 0.1;
    
    // Different eye shapes for different emotions
    if (emotion === 'surprised' || emotion === 'fearful') {
      // Wide open eyes
      context.beginPath();
      context.arc(centerX - eyeOffsetX, centerY - eyeOffsetY, eyeSize * 1.2, 0, Math.PI * 2);
      context.arc(centerX + eyeOffsetX, centerY - eyeOffsetY, eyeSize * 1.2, 0, Math.PI * 2);
      context.fillStyle = 'rgba(130, 87, 229, 0.7)';
      context.fill();
    } else if (emotion === 'angry' || emotion === 'disgusted') {
      // Angled eyes for anger
      context.beginPath();
      
      // Left eye (angled)
      context.ellipse(
        centerX - eyeOffsetX,
        centerY - eyeOffsetY,
        eyeSize,
        eyeSize * 0.7,
        Math.PI / 6, // Angle
        0,
        Math.PI * 2
      );
      
      // Right eye (angled)
      context.ellipse(
        centerX + eyeOffsetX,
        centerY - eyeOffsetY,
        eyeSize,
        eyeSize * 0.7,
        -Math.PI / 6, // Opposite angle
        0,
        Math.PI * 2
      );
      
      context.fillStyle = 'rgba(130, 87, 229, 0.7)';
      context.fill();
    } else {
      // Normal eyes for other emotions
      context.beginPath();
      context.arc(centerX - eyeOffsetX, centerY - eyeOffsetY, eyeSize, 0, Math.PI * 2);
      context.arc(centerX + eyeOffsetX, centerY - eyeOffsetY, eyeSize, 0, Math.PI * 2);
      context.fillStyle = 'rgba(130, 87, 229, 0.7)';
      context.fill();
    }
    
    // Draw eyebrows based on emotion
    const eyebrowOffsetY = eyeOffsetY * 1.7;
    const eyebrowLength = eyeSize * 2;
    
    context.beginPath();
    context.lineWidth = 3;
    
    if (emotion === 'angry' || emotion === 'disgusted') {
      // Angled down in center (angry eyebrows)
      context.moveTo(centerX - eyeOffsetX - eyebrowLength/2, centerY - eyebrowOffsetY);
      context.lineTo(centerX - eyeOffsetX + eyebrowLength/2, centerY - eyebrowOffsetY - eyeSize/2);
      
      context.moveTo(centerX + eyeOffsetX - eyebrowLength/2, centerY - eyebrowOffsetY - eyeSize/2);
      context.lineTo(centerX + eyeOffsetX + eyebrowLength/2, centerY - eyebrowOffsetY);
    } else if (emotion === 'surprised' || emotion === 'fearful') {
      // High eyebrows (surprised)
      context.moveTo(centerX - eyeOffsetX - eyebrowLength/2, centerY - eyebrowOffsetY - eyeSize);
      context.lineTo(centerX - eyeOffsetX + eyebrowLength/2, centerY - eyebrowOffsetY - eyeSize);
      
      context.moveTo(centerX + eyeOffsetX - eyebrowLength/2, centerY - eyebrowOffsetY - eyeSize);
      context.lineTo(centerX + eyeOffsetX + eyebrowLength/2, centerY - eyebrowOffsetY - eyeSize);
    } else if (emotion === 'sad') {
      // Angled up in center (sad eyebrows)
      context.moveTo(centerX - eyeOffsetX - eyebrowLength/2, centerY - eyebrowOffsetY - eyeSize/2);
      context.lineTo(centerX - eyeOffsetX + eyebrowLength/2, centerY - eyebrowOffsetY);
      
      context.moveTo(centerX + eyeOffsetX - eyebrowLength/2, centerY - eyebrowOffsetY);
      context.lineTo(centerX + eyeOffsetX + eyebrowLength/2, centerY - eyebrowOffsetY - eyeSize/2);
    } else {
      // Normal eyebrows
      context.moveTo(centerX - eyeOffsetX - eyebrowLength/2, centerY - eyebrowOffsetY);
      context.lineTo(centerX - eyeOffsetX + eyebrowLength/2, centerY - eyebrowOffsetY);
      
      context.moveTo(centerX + eyeOffsetX - eyebrowLength/2, centerY - eyebrowOffsetY);
      context.lineTo(centerX + eyeOffsetX + eyebrowLength/2, centerY - eyebrowOffsetY);
    }
    
    context.strokeStyle = 'rgba(130, 87, 229, 0.7)';
    context.stroke();
    
    // Draw mouth based on emotion
    context.beginPath();
    if (emotion === 'happy') {
      // Big smile
      context.arc(centerX, centerY + faceSize * 0.2, faceSize * 0.4, 0, Math.PI);
    } else if (emotion === 'sad') {
      // Frown
      context.arc(centerX, centerY + faceSize * 0.6, faceSize * 0.4, Math.PI, Math.PI * 2);
    } else if (emotion === 'surprised' || emotion === 'fearful') {
      // O shaped mouth
      context.arc(centerX, centerY + faceSize * 0.3, faceSize * 0.2, 0, Math.PI * 2);
    } else if (emotion === 'angry') {
      // Angry grimace
      context.moveTo(centerX - faceSize * 0.3, centerY + faceSize * 0.3);
      context.lineTo(centerX, centerY + faceSize * 0.4);
      context.lineTo(centerX + faceSize * 0.3, centerY + faceSize * 0.3);
    } else if (emotion === 'disgusted') {
      // Disgust expression
      context.moveTo(centerX - faceSize * 0.3, centerY + faceSize * 0.3);
      context.quadraticCurveTo(
        centerX, centerY + faceSize * 0.5,
        centerX + faceSize * 0.3, centerY + faceSize * 0.2
      );
    } else {
      // Neutral line
      context.moveTo(centerX - faceSize * 0.3, centerY + faceSize * 0.3);
      context.lineTo(centerX + faceSize * 0.3, centerY + faceSize * 0.3);
    }
    
    context.strokeStyle = 'rgba(130, 87, 229, 0.7)';
    context.lineWidth = 3;
    context.stroke();
    
    // For certain emotions, add extra details
    if (emotion === 'fearful' || emotion === 'surprised') {
      // Add wrinkles above eyes for surprise/fear
      context.beginPath();
      context.moveTo(centerX - eyeOffsetX - eyeSize, centerY - eyeOffsetY - eyeSize * 1.5);
      context.quadraticCurveTo(
        centerX - eyeOffsetX, centerY - eyeOffsetY - eyeSize * 2,
        centerX - eyeOffsetX + eyeSize, centerY - eyeOffsetY - eyeSize * 1.5
      );
      
      context.moveTo(centerX + eyeOffsetX - eyeSize, centerY - eyeOffsetY - eyeSize * 1.5);
      context.quadraticCurveTo(
        centerX + eyeOffsetX, centerY - eyeOffsetY - eyeSize * 2,
        centerX + eyeOffsetX + eyeSize, centerY - eyeOffsetY - eyeSize * 1.5
      );
      
      context.strokeStyle = 'rgba(130, 87, 229, 0.4)';
      context.lineWidth = 1.5;
      context.stroke();
    }
  }
};
