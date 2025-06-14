
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
    console.log('Generated photo URL:', data.publicUrl);
    return data.publicUrl;
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      console.log('Fetching photos... User authenticated:', !!user);
      
      // First, let's check ALL photos in the database for debugging
      const { data: allPhotos, error: allPhotosError } = await supabase
        .from('photos')
        .select('*');
      
      console.log('ALL photos in database:', { data: allPhotos, error: allPhotosError });
      console.log('Total photos in database:', allPhotos ? allPhotos.length : 0);
      
      if (allPhotos && allPhotos.length > 0) {
        console.log('Sample photo data:', allPhotos[0]);
        console.log('Hidden status of photos:', allPhotos.map(p => ({ id: p.id, title: p.title, hidden: p.hidden })));
      }
      
      // Now fetch non-hidden photos
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('hidden', false)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      console.log('Non-hidden photos query result:', { data, error });
      console.log('Number of non-hidden photos found:', data ? data.length : 0);

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
      console.log('Photo fetching completed');
    }
  };

  useEffect(() => {
    console.log('usePhotos hook mounted, starting fetch...');
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

  console.log('Returning mapped photos:', mappedPhotos.length);

  return {
    photos: mappedPhotos,
    loading,
    error,
    refetch: fetchPhotos
  };
};
