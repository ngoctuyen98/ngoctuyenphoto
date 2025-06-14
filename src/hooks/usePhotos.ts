
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
      
      // Fetch photos regardless of authentication status
      // Only show non-hidden photos to maintain privacy
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('hidden', false) // Only show non-hidden photos
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      console.log('Supabase query result:', { data, error });
      console.log('Number of photos found:', data ? data.length : 0);

      if (error) {
        console.error('Error fetching photos:', error);
        // Don't throw error for unauthenticated users, just show empty array
        setPhotos([]);
        setError(null);
      } else {
        console.log('Setting photos:', data || []);
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
      console.log('Photo fetching completed');
    }
  };

  useEffect(() => {
    console.log('usePhotos hook mounted, starting fetch...');
    fetchPhotos();
  }, []); // Remove user dependency to fetch photos regardless of auth status

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
