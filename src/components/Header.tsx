
import { Camera, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authState = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(authState === 'true');
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100/50' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center space-x-3">
            <div className={`text-2xl font-extralight tracking-[0.2em] transition-colors ${
              isScrolled ? 'text-black' : 'text-white'
            }`}>
              NGOC TUYEN
            </div>
          </a>
          
          <nav className="hidden md:flex items-center space-x-12">
            <a href="/#home" className={`text-sm tracking-[0.1em] uppercase font-light transition-colors hover:opacity-70 ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}>Work</a>
            <a href="/#about" className={`text-sm tracking-[0.1em] uppercase font-light transition-colors hover:opacity-70 ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}>About</a>
            <a href="/#contact" className={`text-sm tracking-[0.1em] uppercase font-light transition-colors hover:opacity-70 ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}>Contact</a>
            
            {isAuthenticated ? (
              <a href="/dashboard" className={`flex items-center space-x-2 text-sm tracking-[0.1em] uppercase font-light transition-colors hover:opacity-70 ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}>
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
            ) : (
              <a href="/auth" className={`text-sm tracking-[0.1em] uppercase font-light border px-6 py-2 transition-all duration-300 hover:opacity-70 ${
                isScrolled ? 'text-gray-800 border-gray-300' : 'text-white border-white/30'
              }`}>
                Login
              </a>
            )}
          </nav>

          <button 
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? 'text-black' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100/20">
            <nav className="flex flex-col space-y-6">
              <a href="/#home" className={`text-sm tracking-[0.1em] uppercase font-light transition-colors hover:opacity-70 ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}>Work</a>
              <a href="/#about" className={`text-sm tracking-[0.1em] uppercase font-light transition-colors hover:opacity-70 ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}>About</a>
              <a href="/#contact" className={`text-sm tracking-[0.1em] uppercase font-light transition-colors hover:opacity-70 ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}>Contact</a>
              
              {isAuthenticated ? (
                <a href="/dashboard" className={`text-sm tracking-[0.1em] uppercase font-light transition-colors hover:opacity-70 ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                }`}>Dashboard</a>
              ) : (
                <a href="/auth" className={`text-sm tracking-[0.1em] uppercase font-light transition-colors hover:opacity-70 ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                }`}>Login</a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
