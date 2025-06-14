
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    description: 'Early morning fog rolling over mountain peaks'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Ocean wave',
    category: 'nature',
    title: 'Ocean Wave',
    description: 'Powerful wave captured at the perfect moment'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Forest lake',
    category: 'landscape',
    title: 'Forest Reflection',
    description: 'Serene lake surrounded by autumn trees'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Forest sunbeam',
    category: 'nature',
    title: 'Forest Light',
    description: 'Sunbeam cutting through the forest canopy'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Mountain valley',
    category: 'landscape',
    title: 'Valley View',
    description: 'Aerial view of a mountain valley'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Rocky mountain',
    category: 'landscape',
    title: 'Rocky Peak',
    description: 'Dramatic rocky mountain against the sky'
  }
];

const ImageSlideshow = ({ selectedCategory }: ImageSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [slideshowPhotos, setSlideshowPhotos] = useState<Photo[]>([]);

  const loadUploadedPhotos = () => {
    const savedPhotos = localStorage.getItem('uploadedPhotos');
    if (savedPhotos) {
      const parsedPhotos = JSON.parse(savedPhotos);
      const convertedPhotos: Photo[] = parsedPhotos
        .filter((photo: any) => !photo.hidden)
        .map((photo: any) => ({
          id: photo.id.toString(),
          src: photo.url,
          alt: photo.title,
          category: photo.category,
          title: photo.title,
          description: photo.description,
          featured: photo.featured
        }));
      setUploadedPhotos(convertedPhotos);
    }
  };

  useEffect(() => {
    loadUploadedPhotos();

    const handlePhotosUpdated = () => {
      loadUploadedPhotos();
    };

    window.addEventListener('photosUpdated', handlePhotosUpdated);
    return () => {
      window.removeEventListener('photosUpdated', handlePhotosUpdated);
    };
  }, []);

  useEffect(() => {
    const allPhotos = [...uploadedPhotos, ...defaultPhotos];
    const filteredPhotos = selectedCategory === 'all' 
      ? allPhotos 
      : allPhotos.filter(photo => photo.category === selectedCategory);
    
    // Shuffle the photos randomly
    const shuffled = [...filteredPhotos].sort(() => Math.random() - 0.5);
    setSlideshowPhotos(shuffled);
    setCurrentIndex(0);
  }, [selectedCategory, uploadedPhotos]);

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
