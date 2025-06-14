
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PhotoGrid from '@/components/PhotoGrid';
import ImageSlideshow from '@/components/ImageSlideshow';
import CategoryFilter from '@/components/CategoryFilter';
import { useAuth } from '@/contexts/AuthContext';
import { usePhotos } from '@/hooks/usePhotos';

const Index = () => {
  const { user } = useAuth();
  const { photos, loading, error } = usePhotos();
  const [selectedCategory, setSelectedCategory] = useState('all');

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

        <PhotoGrid />
      </main>

      {/* About Section */}
      <section id="about" className="py-32 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extralight mb-8 tracking-[0.02em] text-gray-900">
              Philosophy
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-12"></div>
            <p className="text-lg md:text-xl font-light leading-relaxed text-gray-600 max-w-3xl mx-auto">
              Every photograph tells a story. Through careful composition, natural lighting, and authentic moments, 
              we create images that transcend time and speak to the soul. Our approach is rooted in simplicity, 
              elegance, and the belief that true beauty lies in the unguarded moment.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <main id="portfolio" className="py-32">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extralight mb-8 tracking-[0.02em] text-gray-900">
              Portfolio
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-12"></div>
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <div className="mb-20">
            <ImageSlideshow selectedCategory={selectedCategory} />
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-500 font-light">Loading photos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 font-light">{error}</p>
            </div>
          ) : (
            <>
              <PhotoGrid selectedCategory={selectedCategory} photos={photos} />
              
              {photos.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 font-light">
                    No photos to display yet. Sign up to start sharing your work!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extralight mb-8 tracking-[0.02em] text-gray-900">
              Contact
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-12"></div>
            <p className="text-lg font-light leading-relaxed text-gray-600 mb-8">
              Let's create something beautiful together. Reach out to discuss your vision and how we can bring it to life.
            </p>
            <div className="space-y-8">
              <div>
                <p className="text-sm tracking-[0.1em] uppercase font-light text-gray-500 mb-2">Email</p>
                <a href="mailto:98nguyenngoctuyen@gmail.com" className="text-lg font-light text-gray-900 hover:opacity-70 transition-opacity">
                  98nguyenngoctuyen@gmail.com
                </a>
              </div>
              <div>
                <p className="text-sm tracking-[0.1em] uppercase font-light text-gray-500 mb-4">Follow</p>
                <div className="flex justify-center space-x-8">
                  <a 
                    href="https://www.instagram.com/98_ngoc_tuyen/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="text-sm tracking-[0.1em] uppercase font-light">Instagram</span>
                  </a>
                  <a 
                    href="https://www.facebook.com/98.ngoc.tuyen/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="text-sm tracking-[0.1em] uppercase font-light">Facebook</span>
                  </a>
                  <a 
                    href="https://www.tiktok.com/@tuyenphoto98" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    <span className="text-sm tracking-[0.1em] uppercase font-light">TikTok</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-8 text-center">
          <div className="text-2xl font-extralight tracking-[0.2em] text-gray-900 mb-4">NGOC TUYEN</div>
          <p className="text-sm tracking-[0.1em] uppercase font-light text-gray-400">
            © 2024 All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
