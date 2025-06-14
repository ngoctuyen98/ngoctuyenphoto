
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import PhotoUpload from '@/components/PhotoUpload';
import Header from '@/components/Header';

const Dashboard = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [user] = useState({ email: 'photographer@example.com' }); // Mock user

  const handleLogout = () => {
    // TODO: Add Supabase logout logic
    console.log('Logout');
    window.location.href = '/';
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    // TODO: Refresh photo list
  };

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
              Upload Photo
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
          <div className="text-center py-16">
            <h2 className="text-2xl font-thin text-gray-900 mb-4">Your Portfolio</h2>
            <p className="text-gray-600 font-light mb-8">
              Start building your photography portfolio by uploading your first photo.
            </p>
            <Button
              onClick={() => setShowUpload(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white font-light"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Your First Photo
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
