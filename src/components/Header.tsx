
import { Camera, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authState = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(authState === 'true');
    };
    
    checkAuth();
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-gray-900" />
            <span className="text-xl font-light text-gray-900">Studio</span>
          </a>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#home" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Home</a>
            <a href="/#portfolio" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Portfolio</a>
            <a href="/#about" className="text-gray-700 hover:text-gray-900 transition-colors font-light">About</a>
            <a href="/#contact" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Contact</a>
            
            {isAuthenticated ? (
              <a href="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors font-light">
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
            ) : (
              <a href="/auth" className="bg-gray-900 text-white px-4 py-2 font-light hover:bg-gray-800 transition-colors">
                Login
              </a>
            )}
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
              <a href="/#home" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Home</a>
              <a href="/#portfolio" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Portfolio</a>
              <a href="/#about" className="text-gray-700 hover:text-gray-900 transition-colors font-light">About</a>
              <a href="/#contact" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Contact</a>
              
              {isAuthenticated ? (
                <a href="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Dashboard</a>
              ) : (
                <a href="/auth" className="text-gray-700 hover:text-gray-900 transition-colors font-light">Login</a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
