
import { useState } from 'react';
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
  photos?: Photo[];
  selectedCategory?: string;
}

const PhotoGrid = ({ photos = [], selectedCategory = 'all' }: PhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Use passed photos or fall back to default photos, sort by featured status
  const allPhotos = photos.length > 0 ? photos.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  }) : defaultPhotos;

  const filteredPhotos = selectedCategory === 'all' 
    ? allPhotos 
    : allPhotos.filter(photo => photo.category === selectedCategory);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 lg:gap-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {filteredPhotos.map((photo) => (
          <div 
            key={photo.id}
            className="group cursor-pointer relative overflow-hidden break-inside-avoid mb-4 sm:mb-6 lg:mb-8"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative overflow-hidden bg-gray-100 rounded-lg">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {photo.featured && (
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/90 text-black px-2 sm:px-3 py-1 text-xs tracking-[0.1em] uppercase font-light z-10 rounded">
                  Featured
                </div>
              )}
              
              {/* Overlay that appears on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end rounded-lg">
                <div className="p-3 sm:p-4 lg:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <h3 
                    className="font-light text-lg sm:text-xl mb-1 sm:mb-2 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"
                    title={photo.title}
                  >
                    {truncateText(photo.title, 30)}
                  </h3>
                  <p 
                    className="text-gray-200 text-xs sm:text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"
                    title={photo.description}
                  >
                    {truncateText(photo.description, 80)}
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
