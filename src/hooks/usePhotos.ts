
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
      
      // Fetch photos regardless of authentication status
      // Only show non-hidden photos to maintain privacy
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('hidden', false) // Only show non-hidden photos
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
        // Don't throw error for unauthenticated users, just show empty array
        setPhotos([]);
        setError(null);
      } else {
        setPhotos(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      // For unauthenticated users, don't show error, just empty array
      setPhotos([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []); // Remove user dependency to fetch photos regardless of auth status

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
