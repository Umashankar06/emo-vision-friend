
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (imageElement: HTMLImageElement) => void;
  isActive: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isActive }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
        
        // Create image element for detection
        const img = new Image();
        img.onload = () => onImageSelected(img);
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`shadow-lg ${!isActive ? 'opacity-70' : ''}`}>
      <CardContent className="p-3">
        {!previewUrl ? (
          <div
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer aspect-video
              ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={40} className="text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-1">
              Drag and drop your image here
            </p>
            <p className="text-center text-xs text-muted-foreground/80">
              or click to select a file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              disabled={!isActive}
            />
          </div>
        ) : (
          <div className="relative">
            <img
              ref={imageRef}
              src={previewUrl}
              alt="Uploaded"
              className="w-full rounded-lg aspect-video object-contain bg-black/5"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
              onClick={clearImage}
            >
              <X size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
