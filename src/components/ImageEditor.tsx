
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, RotateCw, Crop, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  hidden?: boolean;
  featured?: boolean;
}

interface ImageEditorProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPhoto: Photo) => void;
}

const ImageEditor = ({ photo, isOpen, onClose, onSave }: ImageEditorProps) => {
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // Reset state when photo changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle(photo.title);
      setDescription(photo.description);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setRotation(0);
      setImageLoaded(false);
    }
  }, [isOpen, photo]);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      loadImageToCanvas();
    }
  }, [isOpen, photo.src]);

  useEffect(() => {
    if (imageLoaded && canvasRef.current) {
      applyFiltersToCanvas();
    }
  }, [imageLoaded, brightness, contrast, saturation, rotation]);

  const loadImageToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create new image element
    const img = new Image();
    imageRef.current = img;
    
    // Set crossOrigin before setting src for external images
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      console.log('Image loaded successfully');
      // Set canvas dimensions
      canvas.width = Math.min(img.width, 600);
      canvas.height = (canvas.width / img.width) * img.height;

      // Clear canvas and draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      setImageLoaded(true);
    };

    img.onerror = (error) => {
      console.error('Failed to load image:', photo.src, error);
      
      // Try loading without crossOrigin for local/blob URLs
      if (img.crossOrigin) {
        img.crossOrigin = '';
        img.src = photo.src;
        return;
      }
      
      toast({
        title: "Image load failed",
        description: "Could not load the image for editing.",
        variant: "destructive"
      });
      setImageLoaded(false);
    };

    // Set image source
    img.src = photo.src;
  };

  const applyFiltersToCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();
    
    // Apply rotation
    if (rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Restore context state
    ctx.restore();
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convert canvas to blob and create object URL
      canvas.toBlob((blob) => {
        if (blob) {
          const editedImageUrl = URL.createObjectURL(blob);
          
          const updatedPhoto: Photo = {
            ...photo,
            title: title.trim(),
            description: description.trim(),
            src: editedImageUrl
          };

          // Update localStorage if this is an uploaded photo
          const savedPhotos = localStorage.getItem('uploadedPhotos');
          if (savedPhotos) {
            const photos = JSON.parse(savedPhotos);
            const updatedPhotos = photos.map((p: any) => 
              p.id === photo.id ? { ...p, title: title.trim(), description: description.trim() } : p
            );
            localStorage.setItem('uploadedPhotos', JSON.stringify(updatedPhotos));
            window.dispatchEvent(new CustomEvent('photosUpdated'));
          }

          onSave(updatedPhoto);
          onClose();
          
          toast({
            title: "Image updated",
            description: "Your image has been successfully edited."
          });
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your edited image.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Edit Image</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-gray-50 min-h-[300px] flex items-center justify-center">
              {!imageLoaded && (
                <div className="text-gray-500">Loading image...</div>
              )}
              <canvas
                ref={canvasRef}
                className={`w-full h-auto max-h-96 object-contain ${!imageLoaded ? 'hidden' : ''}`}
              />
            </div>

            {/* Image Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Brightness</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{brightness}%</span>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Contrast</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{contrast}%</span>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Saturation</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{saturation}%</span>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Rotation</label>
                <Button
                  onClick={handleRotate}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate 90°
                </Button>
              </div>
            </div>

            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              Reset All
            </Button>
          </div>

          {/* Text Editing */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter image title"
                maxLength={100}
              />
              <span className="text-xs text-gray-500">{title.length}/100</span>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter image description"
                rows={4}
                maxLength={500}
              />
              <span className="text-xs text-gray-500">{description.length}/500</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
