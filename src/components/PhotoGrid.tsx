
import { useState, useEffect } from 'react';
import PhotoModal from './PhotoModal';

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

const defaultPhotos: Photo[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Mountain landscape',
    category: 'landscape',
    title: 'Misty Mountains',
    description: 'Early morning fog rolling over mountain peaks'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Ocean wave',
    category: 'nature',
    title: 'Ocean Wave',
    description: 'Powerful wave captured at the perfect moment'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Forest lake',
    category: 'landscape',
    title: 'Forest Reflection',
    description: 'Serene lake surrounded by autumn trees'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Forest sunbeam',
    category: 'nature',
    title: 'Forest Light',
    description: 'Sunbeam cutting through the forest canopy'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Mountain valley',
    category: 'landscape',
    title: 'Valley View',
    description: 'Aerial view of a mountain valley'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Rocky mountain',
    category: 'landscape',
    title: 'Rocky Peak',
    description: 'Dramatic rocky mountain against the sky'
  }
];

interface PhotoGridProps {
  selectedCategory: string;
}

const PhotoGrid = ({ selectedCategory }: PhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);

  const loadUploadedPhotos = () => {
    const savedPhotos = localStorage.getItem('uploadedPhotos');
    if (savedPhotos) {
      const parsedPhotos = JSON.parse(savedPhotos);
      // Convert uploaded photos to the Photo interface format and filter out hidden ones
      const convertedPhotos: Photo[] = parsedPhotos
        .filter((photo: any) => !photo.hidden) // Only show non-hidden photos
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
    // Load uploaded photos from localStorage on initial render
    loadUploadedPhotos();

    // Listen for photo updates
    const handlePhotosUpdated = () => {
      loadUploadedPhotos();
    };

    window.addEventListener('photosUpdated', handlePhotosUpdated);
    
    return () => {
      window.removeEventListener('photosUpdated', handlePhotosUpdated);
    };
  }, []);

  // Combine uploaded photos with default photos, sort by featured status
  const allPhotos = [...uploadedPhotos, ...defaultPhotos].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const filteredPhotos = selectedCategory === 'all' 
    ? allPhotos 
    : allPhotos.filter(photo => photo.category === selectedCategory);

  // Height variations for masonry effect
  const getImageHeight = (index: number) => {
    const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-60', 'h-88'];
    return heights[index % heights.length];
  };

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {filteredPhotos.map((photo, index) => (
          <div 
            key={photo.id}
            className="group cursor-pointer relative overflow-hidden break-inside-avoid mb-8"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className={`relative overflow-hidden bg-gray-100 ${getImageHeight(index)}`}>
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {photo.featured && (
                <div className="absolute top-4 left-4 bg-white/90 text-black px-3 py-1 text-xs tracking-[0.1em] uppercase font-light z-10">
                  Featured
                </div>
              )}
              
              {/* Overlay that appears on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                <div className="p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <h3 className="font-light text-xl mb-2 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {photo.title}
                  </h3>
                  <p className="text-gray-200 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                    {photo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoModal 
          photo={selectedPhoto}
          photos={filteredPhotos}
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
    </>
  );
};

export default PhotoGrid;
