
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, Edit3 } from 'lucide-react';
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
  const { toast } = useToast();

  // Reset state when photo changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle(photo.title);
      setDescription(photo.description);
    }
  }, [isOpen, photo]);

  const handleSave = () => {
    try {
      const updatedPhoto: Photo = {
        ...photo,
        title: title.trim(),
        description: description.trim()
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
        title: "Photo updated",
        description: "Photo title and description have been successfully updated."
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your changes.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5" />
            <span>Edit Photo Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Preview */}
          <div className="flex justify-center">
            <div className="w-48 h-48 border rounded-lg overflow-hidden bg-gray-50">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
            </div>
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
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
