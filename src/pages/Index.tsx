
import { useState } from 'react';
import PhotoGrid from '../components/PhotoGrid';
import CategoryFilter from '../components/CategoryFilter';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ImageSlideshow from '../components/ImageSlideshow';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
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
          <PhotoGrid selectedCategory={selectedCategory} />
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
            <div className="space-y-4">
              <p className="text-sm tracking-[0.1em] uppercase font-light text-gray-500">Email</p>
              <a href="mailto:hello@matsuya.com" className="text-lg font-light text-gray-900 hover:opacity-70 transition-opacity">
                hello@matsuya.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-8 text-center">
          <div className="text-2xl font-extralight tracking-[0.2em] text-gray-900 mb-4">MATSUYA</div>
          <p className="text-sm tracking-[0.1em] uppercase font-light text-gray-400">
            © 2024 All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
