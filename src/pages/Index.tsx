
import { useState } from 'react';
import { Camera, Grid, User, Mail } from 'lucide-react';
import PhotoGrid from '../components/PhotoGrid';
import CategoryFilter from '../components/CategoryFilter';
import Header from '../components/Header';
import Hero from '../components/Hero';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-16">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <PhotoGrid selectedCategory={selectedCategory} />
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 Your Photography Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
