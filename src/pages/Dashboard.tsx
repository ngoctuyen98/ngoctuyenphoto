import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import PhotoUpload from '@/components/PhotoUpload';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'photographer@example.com';

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('isAuthenticated');
    if (isAuth !== 'true') {
      navigate('/auth');
      return;
    }

    // Load photos from localStorage
    const savedPhotos = localStorage.getItem('uploadedPhotos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const handleUploadSuccess = (newPhotos: any[]) => {
    const allPhotos = [...photos, ...newPhotos];
    setPhotos(allPhotos);
    localStorage.setItem('uploadedPhotos', JSON.stringify(allPhotos));
    setShowUpload(false);
    
    // Dispatch a custom event to notify other components about the photo update
    window.dispatchEvent(new CustomEvent('photosUpdated'));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-thin text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 font-light">Welcome back, {userEmail}</p>
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
            {photos.length > 0 ? (
              <div>
                <h2 className="text-2xl font-thin text-gray-900 mb-6">Your Photos ({photos.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{photo.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {photo.category}
                        </span>
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
