
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PhotoGrid from '@/components/PhotoGrid';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [photos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Migrate existing localStorage photos to show migration notice
    const savedPhotos = localStorage.getItem('uploadedPhotos');
    if (savedPhotos) {
      console.log('Found photos in localStorage - these will need to be re-uploaded to the database');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-thin text-gray-900 mb-4">Featured Work</h2>
          <p className="text-gray-600 font-light mb-8">
            Discover beautiful photography from our talented community
          </p>
          
          {!user && (
            <div className="space-x-4">
              <Link to="/auth">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white font-light">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="font-light">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
          
          {user && (
            <Link to="/dashboard">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white font-light">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>

        <PhotoGrid photos={photos} />
        
        {photos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 font-light">
              No photos to display yet. Sign up to start sharing your work!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
