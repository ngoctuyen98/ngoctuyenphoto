
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  file_path: string;
  featured: boolean;
  hidden: boolean;
  created_at: string;
}

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage.from('photos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('hidden', false) // Only show non-hidden photos
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPhotos(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return {
    photos: photos.map(photo => ({
      id: photo.id,
      src: getPhotoUrl(photo.file_path),
      alt: photo.title,
      category: photo.category,
      title: photo.title,
      description: photo.description || '',
      featured: photo.featured,
      hidden: photo.hidden
    })),
    loading,
    error,
    refetch: fetchPhotos
  };
};
