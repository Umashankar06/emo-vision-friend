
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

// This is a placeholder for the actual emotion detection logic
// In a real app, this would use a pre-trained model like TensorFlow.js
export const detectEmotion = (imageElement: HTMLImageElement | HTMLVideoElement): Promise<Emotion> => {
  return new Promise((resolve) => {
    // Simulate detection delay
    setTimeout(() => {
      // For demo purposes, return a random emotion
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)].id;
      resolve(randomEmotion);
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

  // For demonstration, we'll draw a simple face outline
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
    
    // Draw eyes
    const eyeSize = faceSize * 0.15;
    const eyeOffsetX = faceSize * 0.3;
    const eyeOffsetY = faceSize * 0.1;
    
    context.beginPath();
    context.arc(centerX - eyeOffsetX, centerY - eyeOffsetY, eyeSize, 0, Math.PI * 2);
    context.arc(centerX + eyeOffsetX, centerY - eyeOffsetY, eyeSize, 0, Math.PI * 2);
    context.fillStyle = 'rgba(130, 87, 229, 0.7)';
    context.fill();
    
    // Draw mouth based on emotion
    context.beginPath();
    if (emotion === 'happy' || emotion === 'surprised') {
      // Smile
      context.arc(centerX, centerY + eyeOffsetY, faceSize * 0.4, 0, Math.PI);
    } else if (emotion === 'sad') {
      // Frown
      context.arc(centerX, centerY + faceSize * 0.6, faceSize * 0.4, Math.PI, Math.PI * 2);
    } else {
      // Straight line for neutral, etc.
      context.moveTo(centerX - faceSize * 0.4, centerY + faceSize * 0.3);
      context.lineTo(centerX + faceSize * 0.4, centerY + faceSize * 0.3);
    }
    context.strokeStyle = 'rgba(130, 87, 229, 0.7)';
    context.lineWidth = 3;
    context.stroke();
  }
};
