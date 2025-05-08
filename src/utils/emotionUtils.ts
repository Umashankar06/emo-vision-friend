
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

// A more advanced emotion detection algorithm
// In a real app, this would use a pre-trained model like TensorFlow.js
export const detectEmotion = (imageElement: HTMLImageElement | HTMLVideoElement): Promise<Emotion> => {
  return new Promise((resolve) => {
    // Simulate detection delay
    setTimeout(() => {
      // For demo purposes, we'll use a more consistent approach
      // In a real implementation, this would analyze pixel data and facial features
      
      // Get the image/video dimensions for analysis
      const width = imageElement instanceof HTMLImageElement 
        ? imageElement.naturalWidth 
        : imageElement instanceof HTMLVideoElement 
          ? imageElement.videoWidth 
          : 300;
      
      const height = imageElement instanceof HTMLImageElement 
        ? imageElement.naturalHeight 
        : imageElement instanceof HTMLVideoElement 
          ? imageElement.videoHeight 
          : 300;
      
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
      
      // Use a larger sample area for better analysis
      const sampleSize = Math.min(width, height) / 3;
      
      // Get pixel data from the center region (simulating face detection)
      const faceRegion = context.getImageData(
        centerX - sampleSize / 2,
        centerY - sampleSize / 2,
        sampleSize,
        sampleSize
      );
      
      // Calculate average color values and variations
      let totalR = 0, totalG = 0, totalB = 0;
      let varianceR = 0, varianceG = 0, varianceB = 0;
      const pixelData = faceRegion.data;
      
      // First pass: calculate averages
      for (let i = 0; i < pixelData.length; i += 4) {
        totalR += pixelData[i];
        totalG += pixelData[i + 1];
        totalB += pixelData[i + 2];
      }
      
      const pixelCount = pixelData.length / 4;
      const avgR = totalR / pixelCount;
      const avgG = totalG / pixelCount;
      const avgB = totalB / pixelCount;
      
      // Second pass: calculate variance
      for (let i = 0; i < pixelData.length; i += 4) {
        varianceR += Math.pow(pixelData[i] - avgR, 2);
        varianceG += Math.pow(pixelData[i + 1] - avgG, 2);
        varianceB += Math.pow(pixelData[i + 2] - avgB, 2);
      }
      
      varianceR = Math.sqrt(varianceR / pixelCount);
      varianceG = Math.sqrt(varianceG / pixelCount);
      varianceB = Math.sqrt(varianceB / pixelCount);
      
      // Calculate brightness, color balance, and variance metrics
      const brightness = (avgR + avgG + avgB) / 3;
      const redGreenRatio = avgR / (avgG || 1); // Avoid division by zero
      const blueGreenRatio = avgB / (avgG || 1);
      const colorVariance = (varianceR + varianceG + varianceB) / 3;
      
      // Advanced emotion detection heuristics
      
      // Upper region for eyebrows/forehead analysis
      const upperRegion = context.getImageData(
        centerX - sampleSize / 3,
        centerY - sampleSize / 2,
        sampleSize / 1.5,
        sampleSize / 3
      );
      
      // Lower region for mouth analysis
      const lowerRegion = context.getImageData(
        centerX - sampleSize / 3,
        centerY + sampleSize / 6,
        sampleSize / 1.5,
        sampleSize / 3
      );
      
      // Calculate upper and lower region metrics
      let upperBrightness = 0;
      let lowerBrightness = 0;
      
      for (let i = 0; i < upperRegion.data.length; i += 4) {
        upperBrightness += (upperRegion.data[i] + upperRegion.data[i + 1] + upperRegion.data[i + 2]) / 3;
      }
      
      for (let i = 0; i < lowerRegion.data.length; i += 4) {
        lowerBrightness += (lowerRegion.data[i] + lowerRegion.data[i + 1] + lowerRegion.data[i + 2]) / 3;
      }
      
      upperBrightness /= upperRegion.data.length / 4;
      lowerBrightness /= lowerRegion.data.length / 4;
      
      // Brightness ratio between upper and lower face regions
      const verticalBrightnessRatio = upperBrightness / (lowerBrightness || 1);
      
      // More sophisticated emotion detection with multiple features considered
      
      // Weighted scoring system
      let scores = {
        happy: 0,
        sad: 0,
        angry: 0,
        surprised: 0,
        fearful: 0,
        disgusted: 0,
        neutral: 0
      };
      
      // High brightness often correlates with 'happy' or 'surprised'
      if (brightness > 150) {
        scores.happy += 3;
        scores.surprised += 2;
      }
      
      // Lower brightness might indicate 'sad', 'fearful', or 'angry'
      if (brightness < 100) {
        scores.sad += 2;
        scores.fearful += 2;
        scores.angry += 1;
      }
      
      // High red component often indicates 'happy' or 'angry'
      if (redGreenRatio > 1.1) {
        scores.happy += 2;
        scores.angry += 2;
      }
      
      // High blue component might suggest 'surprised' or 'fearful'
      if (blueGreenRatio > 1.1) {
        scores.surprised += 3;
        scores.fearful += 2;
      }
      
      // High color variance can indicate 'surprised' or 'disgusted'
      if (colorVariance > 50) {
        scores.surprised += 2;
        scores.disgusted += 3;
      }
      
      // Lower region brighter than upper can suggest 'happy'
      if (verticalBrightnessRatio < 0.9) {
        scores.happy += 4;
      }
      
      // Upper region brighter than lower can suggest 'surprised'
      if (verticalBrightnessRatio > 1.2) {
        scores.surprised += 3;
        scores.fearful += 2;
      }
      
      // Balanced metrics often suggest 'neutral'
      if (Math.abs(redGreenRatio - 1) < 0.1 && 
          Math.abs(blueGreenRatio - 1) < 0.1 &&
          Math.abs(verticalBrightnessRatio - 1) < 0.1) {
        scores.neutral += 4;
      }
      
      // Middle brightness with high red might be 'disgusted'
      if (redGreenRatio > 1.1 && brightness > 100 && brightness < 150) {
        scores.disgusted += 3;
      }
      
      // Find the emotion with the highest score
      let highestScore = 0;
      let detectedEmotion: Emotion = 'neutral';
      
      for (const [emotion, score] of Object.entries(scores)) {
        if (score > highestScore) {
          highestScore = score;
          detectedEmotion = emotion as Emotion;
        }
      }
      
      // If no clear winner, default to neutral
      if (highestScore < 2) {
        detectedEmotion = 'neutral';
      }
      
      resolve(detectedEmotion);
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
