
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePhotos } from '@/hooks/usePhotos';

interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  hidden?: boolean;
  featured?: boolean;
}

interface ImageSlideshowProps {
  selectedCategory: string;
}

const defaultPhotos: Photo[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Mountain landscape',
    category: 'landscape',
    title: 'Misty Mountains',
    description: 'Early morning fog rolling over mountain peaks',
    featured: true
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Portrait photography',
    category: 'portrait',
    title: 'Natural Portrait',
    description: 'Capturing authentic moments',
    featured: true
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Wedding photography',
    category: 'wedding',
    title: 'Wedding Moments',
    description: 'Beautiful wedding ceremony',
    featured: true
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Street photography',
    category: 'street',
    title: 'Urban Life',
    description: 'Capturing the essence of city life',
    featured: true
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Nature photography',
    category: 'nature',
    title: 'Ocean Wave',
    description: 'Powerful wave captured at the perfect moment',
    featured: true
  }
];

const ImageSlideshow = ({ selectedCategory }: ImageSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideshowPhotos, setSlideshowPhotos] = useState<Photo[]>([]);
  const { photos: dbPhotos } = usePhotos();

  // Function to get a random photo from an array
  const getRandomPhoto = (photos: Photo[]) => {
    if (photos.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * photos.length);
    return photos[randomIndex];
  };

  useEffect(() => {
    // Combine database photos with default photos
    const allPhotos = [...dbPhotos, ...defaultPhotos];
    
    // Get only featured photos
    const featuredPhotos = allPhotos.filter(photo => photo.featured);
    
    if (selectedCategory === 'all') {
      // For 'all' category, show one random featured photo per category
      const categories = ['portrait', 'landscape', 'wedding', 'street', 'nature'];
      const categoryFeatured: Photo[] = [];
      
      categories.forEach(category => {
        const categoryFeaturedPhotos = featuredPhotos.filter(photo => photo.category === category);
        
        if (categoryFeaturedPhotos.length > 0) {
          // Get random featured photo from this category
          const randomPhoto = getRandomPhoto(categoryFeaturedPhotos);
          if (randomPhoto) {
            categoryFeatured.push(randomPhoto);
          }
        } else {
          // Fall back to default photo for this category
          const defaultPhoto = defaultPhotos.find(photo => photo.category === category);
          if (defaultPhoto) {
            categoryFeatured.push(defaultPhoto);
          }
        }
      });
      
      setSlideshowPhotos(categoryFeatured);
    } else {
      // For specific category, show all featured photos from that category
      const categoryFeatured = featuredPhotos.filter(photo => photo.category === selectedCategory);
      setSlideshowPhotos(categoryFeatured);
    }
    
    setCurrentIndex(0);
  }, [selectedCategory, dbPhotos]);

  useEffect(() => {
    if (slideshowPhotos.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slideshowPhotos.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [slideshowPhotos.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slideshowPhotos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideshowPhotos.length);
  };

  if (slideshowPhotos.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-96 mb-12 overflow-hidden rounded-lg group">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 z-10"></div>
      
      {slideshowPhotos.map((photo, index) => (
        <div
          key={photo.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Navigation Buttons */}
      {slideshowPhotos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Photo Info Overlay */}
      {slideshowPhotos[currentIndex] && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h3 className="text-white text-xl font-light mb-1">
            {slideshowPhotos[currentIndex].title}
          </h3>
          <p className="text-white/80 text-sm font-light">
            {slideshowPhotos[currentIndex].description}
          </p>
        </div>
      )}

      {/* Dots Indicator */}
      {slideshowPhotos.length > 1 && (
        <div className="absolute bottom-4 right-6 z-20 flex space-x-2">
          {slideshowPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
