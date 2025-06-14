
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage.from('photos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      console.log('Fetching photos...');
      
      // Fetch non-hidden photos (RLS policy handles the filtering automatically)
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      console.log('Photos query result:', { data, error });
      console.log('Number of photos found:', data ? data.length : 0);

      if (error) {
        console.error('Error fetching photos:', error);
        setPhotos([]);
        setError(error.message);
      } else {
        console.log('Setting photos:', data || []);
        setPhotos(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setPhotos([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const mappedPhotos = photos.map(photo => ({
    id: photo.id,
    src: getPhotoUrl(photo.file_path),
    alt: photo.title,
    category: photo.category,
    title: photo.title,
    description: photo.description || '',
    featured: photo.featured,
    hidden: photo.hidden
  }));

  return {
    photos: mappedPhotos,
    loading,
    error,
    refetch: fetchPhotos
  };
};
