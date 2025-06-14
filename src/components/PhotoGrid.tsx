
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo) => (
          <div 
            key={photo.id}
            className="group cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-square overflow-hidden bg-gray-100 relative">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {photo.featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">
                  Featured
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="font-light text-lg text-gray-900">{photo.title}</h3>
              <p className="text-gray-600 text-sm font-light">{photo.description}</p>
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
