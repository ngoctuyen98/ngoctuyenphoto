
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, EyeOff, Star } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  fileName: string;
  uploadedAt: string;
  hidden?: boolean;
  featured?: boolean;
}

interface PhotoManagerProps {
  photo: Photo;
  onPhotoUpdate: () => void;
}

const PhotoManager = ({ photo, onPhotoUpdate }: PhotoManagerProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updatePhoto = (updates: Partial<Photo>) => {
    const savedPhotos = localStorage.getItem('uploadedPhotos');
    if (savedPhotos) {
      const photos = JSON.parse(savedPhotos);
      const updatedPhotos = photos.map((p: Photo) => 
        p.id === photo.id ? { ...p, ...updates } : p
      );
      localStorage.setItem('uploadedPhotos', JSON.stringify(updatedPhotos));
      window.dispatchEvent(new CustomEvent('photosUpdated'));
      onPhotoUpdate();
    }
  };

  const deletePhoto = () => {
    setLoading(true);
    try {
      const savedPhotos = localStorage.getItem('uploadedPhotos');
      if (savedPhotos) {
        const photos = JSON.parse(savedPhotos);
        const filteredPhotos = photos.filter((p: Photo) => p.id !== photo.id);
        localStorage.setItem('uploadedPhotos', JSON.stringify(filteredPhotos));
        window.dispatchEvent(new CustomEvent('photosUpdated'));
        onPhotoUpdate();
        
        toast({
          title: "Photo deleted",
          description: "Photo has been removed from your portfolio."
        });
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the photo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleHidden = () => {
    const newHiddenState = !photo.hidden;
    updatePhoto({ hidden: newHiddenState });
    
    toast({
      title: newHiddenState ? "Photo hidden" : "Photo shown",
      description: newHiddenState 
        ? "Photo is now hidden from public view." 
        : "Photo is now visible to everyone."
    });
  };

  const toggleFeatured = () => {
    const newFeaturedState = !photo.featured;
    updatePhoto({ featured: newFeaturedState });
    
    toast({
      title: newFeaturedState ? "Photo featured" : "Photo unfeatured",
      description: newFeaturedState 
        ? "Photo will appear at the top of your portfolio." 
        : "Photo removed from featured section."
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={toggleFeatured}
        variant="outline"
        size="sm"
        className={`font-light ${photo.featured ? 'bg-yellow-100 text-yellow-800' : ''}`}
        disabled={loading}
      >
        <Star className={`w-4 h-4 mr-1 ${photo.featured ? 'fill-current' : ''}`} />
        {photo.featured ? 'Featured' : 'Feature'}
      </Button>
      
      <Button
        onClick={toggleHidden}
        variant="outline"
        size="sm"
        className={`font-light ${photo.hidden ? 'bg-gray-100 text-gray-600' : ''}`}
        disabled={loading}
      >
        <EyeOff className="w-4 h-4 mr-1" />
        {photo.hidden ? 'Hidden' : 'Hide'}
      </Button>
      
      <Button
        onClick={deletePhoto}
        variant="outline"
        size="sm"
        className="font-light text-red-600 hover:bg-red-50"
        disabled={loading}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Delete
      </Button>
    </div>
  );
};

export default PhotoManager;
