
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const CATEGORIES = [
  'Landscape',
  'Portrait',
  'Nature',
  'Architecture',
  'Street',
  'Wildlife',
  'Abstract',
  'Travel',
  'Macro',
  'Black & White',
  'Other'
];

const ImageEditor = ({ photo, isOpen, onClose, onSave }: ImageEditorProps) => {
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description);
  const [category, setCategory] = useState(photo.category);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Reset state when photo changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle(photo.title);
      setDescription(photo.description);
      setCategory(photo.category);
    }
  }, [isOpen, photo]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the photo.",
        variant: "destructive"
      });
      return;
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for the photo.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const updatedPhoto: Photo = {
        ...photo,
        title: title.trim(),
        description: description.trim(),
        category: category
      };

      onSave(updatedPhoto);
      
      toast({
        title: "Photo updated",
        description: "Photo details have been successfully updated."
      });
    } catch (error) {
      console.error('Error saving photo:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your changes.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" onKeyDown={handleKeyDown}>
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
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter image title"
                maxLength={100}
                className="focus:ring-2 focus:ring-gray-500"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{title.length}/100</span>
                {!title.trim() && <span className="text-xs text-red-500">Title is required</span>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category *</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="focus:ring-2 focus:ring-gray-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!category && <span className="text-xs text-red-500 mt-1 block">Category is required</span>}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter image description"
                rows={4}
                maxLength={500}
                className="focus:ring-2 focus:ring-gray-500"
              />
              <span className="text-xs text-gray-500">{description.length}/500</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleSave} 
              className="flex-1"
              disabled={saving || !title.trim() || !category}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1" disabled={saving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to save quickly
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
