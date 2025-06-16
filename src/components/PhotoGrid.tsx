
import { useState } from 'react';
import PhotoModal from './PhotoModal';
import LoadingSpinner from './LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Use passed photos or fall back to default photos, sort by featured status
  const allPhotos = photos.length > 0 ? photos.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  }) : defaultPhotos;

  const filteredPhotos = selectedCategory === 'all' 
    ? allPhotos 
    : allPhotos.filter(photo => photo.category === selectedCategory);

  // Use infinite scroll hook
  const { displayedItems: displayedPhotos, loading: infiniteLoading, hasMore } = useInfiniteScroll({
    items: filteredPhotos,
    itemsPerPage: 6,
    threshold: 200
  });

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleImageLoad = (photoId: string) => {
    setLoadedImages(prev => new Set(prev).add(photoId));
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
  };

  const handleImageError = (photoId: string) => {
    setFailedImages(prev => new Set(prev).add(photoId));
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
  };

  const handleImageLoadStart = (photoId: string) => {
    setLoadingImages(prev => new Set(prev).add(photoId));
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animate-gradient {
            animation: gradient 3s ease infinite;
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }

          .animate-slideInLeft {
            animation: slideInLeft 0.6s ease-out forwards;
          }
        `}
      </style>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedPhotos.map((photo, index) => (
          <div 
            key={photo.id}
            className="group cursor-pointer relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100 transform transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-xl"
            onClick={() => setSelectedPhoto(photo)}
            style={{ 
              animationDelay: `${(index % 6) * 100}ms`,
              animation: 'fadeInUp 0.8s ease-out forwards',
              opacity: 0
            }}
          >
            <div className="relative overflow-hidden">
              {/* Progressive loading skeleton */}
              {!loadedImages.has(photo.id) && !failedImages.has(photo.id) && (
                <div className="relative">
                  <Skeleton className="w-full h-64 rounded-lg" />
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_400%] animate-gradient rounded-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <div className="text-gray-400 text-sm font-light">Loading...</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error fallback with smooth transition */}
              {failedImages.has(photo.id) && (
                <div className="bg-gray-50 rounded-lg flex items-center justify-center min-h-[200px] transition-all duration-500">
                  <div className="text-gray-400 text-sm text-center p-4">
                    <div className="mb-2 opacity-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>Failed to load image</div>
                    <div className="text-xs opacity-0 animate-fadeIn" style={{ animationDelay: '400ms' }}>{photo.title}</div>
                  </div>
                </div>
              )}

              {/* Main image with progressive loading */}
              <div className="relative">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={`w-full h-auto object-cover transition-all duration-1000 ease-out group-hover:scale-105 rounded-lg ${
                    loadedImages.has(photo.id) 
                      ? 'opacity-100 blur-0 scale-100' 
                      : 'opacity-0 blur-sm scale-105'
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoadStart={() => handleImageLoadStart(photo.id)}
                  onLoad={() => handleImageLoad(photo.id)}
                  onError={() => handleImageError(photo.id)}
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: 'auto'
                  }}
                />
              </div>
              
              {/* Featured badge with entrance animation */}
              {photo.featured && loadedImages.has(photo.id) && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-black px-3 py-1 text-xs tracking-[0.1em] uppercase font-light z-10 rounded shadow-lg opacity-0 animate-slideInLeft" style={{ animationDelay: '600ms' }}>
                  Featured
                </div>
              )}
              
              {/* Enhanced overlay with staggered animations */}
              {loadedImages.has(photo.id) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out flex items-end rounded-lg">
                  <div className="p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 ease-out delay-100">
                    <h3 
                      className="font-light text-lg mb-2 tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform translate-y-4 group-hover:translate-y-0"
                      title={photo.title}
                    >
                      {truncateText(photo.title, 30)}
                    </h3>
                    <p 
                      className="text-gray-200 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 transform translate-y-4 group-hover:translate-y-0"
                      title={photo.description}
                    >
                      {truncateText(photo.description, 80)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Loading spinner for infinite scroll */}
      {infiniteLoading && <LoadingSpinner />}

      {/* End of content indicator */}
      {!hasMore && displayedPhotos.length > 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 font-light text-sm tracking-wide">
            You've reached the end
          </div>
        </div>
      )}

      {selectedPhoto && (
        <PhotoModal 
          photo={selectedPhoto}
          photos={displayedPhotos}
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
    </>
  );
};

export default PhotoGrid;
