
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import PhotoUpload from '@/components/PhotoUpload';
import PhotoActions from '@/components/PhotoActions';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const Dashboard = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage.from('photos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const loadPhotos = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', user.id)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPhotos(data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Error loading photos",
        description: "There was an error loading your photos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadPhotos();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleUploadSuccess = () => {
    loadPhotos();
    setShowUpload(false);
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-thin text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 font-light">Welcome back, {user.email}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowUpload(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white font-light"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="font-light"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {showUpload ? (
          <div className="mb-8">
            <Button
              onClick={() => setShowUpload(false)}
              variant="outline"
              className="mb-6 font-light"
            >
              ← Back to Dashboard
            </Button>
            <PhotoUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-600 font-light">Loading your photos...</p>
              </div>
            ) : photos.length > 0 ? (
              <div>
                <h2 className="text-2xl font-thin text-gray-900 mb-6">Your Photos ({photos.length})</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {photos.map((photo) => (
                    <div key={photo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={getPhotoUrl(photo.file_path)}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-1">
                          {photo.featured && (
                            <div className="bg-yellow-500 text-white px-2 py-1 text-xs rounded">
                              Featured
                            </div>
                          )}
                          {photo.hidden && (
                            <div className="bg-gray-500 text-white px-2 py-1 text-xs rounded">
                              Hidden
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{photo.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {photo.category}
                          </span>
                        </div>
                        <PhotoActions 
                          photo={photo} 
                          onPhotoUpdate={loadPhotos} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-thin text-gray-900 mb-4">Your Portfolio</h2>
                <p className="text-gray-600 font-light mb-8">
                  Start building your photography portfolio by uploading your first photos.
                </p>
                <Button
                  onClick={() => setShowUpload(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-light"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First Photos
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
