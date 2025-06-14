
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PhotoGrid from '@/components/PhotoGrid';
import { useAuth } from '@/contexts/AuthContext';
import { usePhotos } from '@/hooks/usePhotos';

const Index = () => {
  const { user } = useAuth();
  const { photos, loading, error } = usePhotos();

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
            <PhotoGrid photos={photos} />
            
            {photos.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 font-light">
                  No photos to display yet. Sign up to start sharing your work!
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-thin text-gray-900 mb-6">Portfolio</h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              A curated selection of my finest work, showcasing diverse styles and subjects 
              captured through my unique perspective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg bg-gray-200 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Landscape Photography"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-light mt-4 text-gray-900">Landscapes</h3>
              <p className="text-gray-600 font-light text-sm">Natural beauty captured in stunning detail</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg bg-gray-200 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Portrait Photography"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-light mt-4 text-gray-900">Portraits</h3>
              <p className="text-gray-600 font-light text-sm">Capturing human emotion and character</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg bg-gray-200 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Urban Photography"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-light mt-4 text-gray-900">Urban</h3>
              <p className="text-gray-600 font-light text-sm">City life through an artistic lens</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Photographer Portrait"
                  className="w-full rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-4xl font-thin text-gray-900 mb-6">About Me</h2>
                <div className="space-y-6 text-gray-600 font-light leading-relaxed">
                  <p>
                    I'm Ngoc Tuyen, a passionate photographer dedicated to capturing the extraordinary 
                    in everyday moments. With over a decade of experience, I specialize in landscape, 
                    portrait, and urban photography.
                  </p>
                  <p>
                    My work is driven by a deep appreciation for natural light, human emotion, and 
                    the stories that unfold in the spaces between planned moments. Each photograph 
                    is an opportunity to freeze time and share a unique perspective with the world.
                  </p>
                  <p>
                    When I'm not behind the camera, you can find me exploring new locations, 
                    studying the work of master photographers, or teaching workshops to share 
                    my passion for the art of photography.
                  </p>
                </div>
                <div className="mt-8">
                  <a 
                    href="#contact" 
                    className="inline-block text-sm tracking-[0.2em] uppercase font-light border border-gray-300 px-8 py-3 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-500"
                  >
                    Get In Touch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-thin text-gray-900 mb-6">Contact</h2>
              <p className="text-gray-600 font-light max-w-2xl mx-auto">
                Let's create something beautiful together. I'm always interested in new projects 
                and collaborations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-4">Get In Touch</h3>
                  <div className="space-y-4 text-gray-600 font-light">
                    <p>Email: hello@ngoctuyen.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Location: New York, NY</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-4">Services</h3>
                  <div className="space-y-2 text-gray-600 font-light">
                    <p>Portrait Photography</p>
                    <p>Wedding Photography</p>
                    <p>Commercial Photography</p>
                    <p>Fine Art Prints</p>
                    <p>Photography Workshops</p>
                  </div>
                </div>
              </div>
              
              <div>
                <form className="space-y-6">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 font-light"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 font-light"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Subject" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 font-light"
                    />
                  </div>
                  <div>
                    <textarea 
                      rows={6} 
                      placeholder="Your Message" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 font-light resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-gray-900 text-white py-3 px-8 text-sm tracking-[0.1em] uppercase font-light hover:bg-gray-800 transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
