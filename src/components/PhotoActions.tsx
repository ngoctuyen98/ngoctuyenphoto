
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, EyeOff, Eye, Star, Edit3, StarOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ImageEditor from './ImageEditor';

interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  file_path: string;
  file_name: string;
  featured: boolean;
  hidden: boolean;
  created_at: string;
}

interface PhotoActionsProps {
  photo: Photo;
  onPhotoUpdate: () => void;
}

const PhotoActions = ({ photo, onPhotoUpdate }: PhotoActionsProps) => {
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const { toast } = useToast();

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage.from('photos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const updatePhoto = async (updates: Partial<Photo>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('photos')
        .update(updates)
        .eq('id', photo.id);

      if (error) {
        throw error;
      }

      onPhotoUpdate();
      
      toast({
        title: "Photo updated",
        description: "Photo has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating the photo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async () => {
    setLoading(true);
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete record from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) {
        throw dbError;
      }

      onPhotoUpdate();
      
      toast({
        title: "Photo deleted",
        description: "Photo has been removed from your portfolio."
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
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
    updatePhoto({ hidden: !photo.hidden });
  };

  const toggleFeatured = () => {
    updatePhoto({ featured: !photo.featured });
  };

  const handleEditorSave = (updatedPhoto: any) => {
    updatePhoto({
      title: updatedPhoto.title,
      description: updatedPhoto.description,
      category: updatedPhoto.category
    });
    setShowEditor(false);
  };

  // Convert Photo to the format expected by ImageEditor
  const editorPhoto = {
    id: photo.id,
    src: getPhotoUrl(photo.file_path),
    alt: photo.title,
    category: photo.category,
    title: photo.title,
    description: photo.description || '',
    hidden: photo.hidden,
    featured: photo.featured
  };

  return (
    <>
      <div className="flex items-center space-x-2 flex-wrap gap-2">
        <Button
          onClick={() => setShowEditor(true)}
          variant="outline"
          size="sm"
          className="font-light"
          disabled={loading}
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Edit
        </Button>

        <Button
          onClick={toggleFeatured}
          variant="outline"
          size="sm"
          className={`font-light ${photo.featured ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}`}
          disabled={loading}
        >
          {photo.featured ? (
            <StarOff className="w-4 h-4 mr-1" />
          ) : (
            <Star className="w-4 h-4 mr-1" />
          )}
          {photo.featured ? 'Unfeature' : 'Feature'}
        </Button>
        
        <Button
          onClick={toggleHidden}
          variant="outline"
          size="sm"
          className={`font-light ${photo.hidden ? 'bg-gray-100 text-gray-600 border-gray-300' : ''}`}
          disabled={loading}
        >
          {photo.hidden ? (
            <Eye className="w-4 h-4 mr-1" />
          ) : (
            <EyeOff className="w-4 h-4 mr-1" />
          )}
          {photo.hidden ? 'Show' : 'Hide'}
        </Button>
        
        <Button
          onClick={deletePhoto}
          variant="outline"
          size="sm"
          className="font-light text-red-600 hover:bg-red-50 border-red-200"
          disabled={loading}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>

      {showEditor && (
        <ImageEditor
          photo={editorPhoto}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleEditorSave}
        />
      )}
    </>
  );
};

export default PhotoActions;
