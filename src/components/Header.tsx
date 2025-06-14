
import { Camera, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-gray-900" />
            <span className="text-xl font-light text-gray-900">Studio</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Home</a>
            <a href="#portfolio" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Portfolio</a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors font-light">About</a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Contact</a>
          </nav>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Home</a>
              <a href="#portfolio" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Portfolio</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors font-light">About</a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Contact</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
