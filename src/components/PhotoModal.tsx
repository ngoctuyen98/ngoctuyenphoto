
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
}

interface PhotoModalProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
}

const PhotoModal = ({ photo, photos, onClose }: PhotoModalProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{
    transform: string;
    transformOrigin: string;
  }>({
    transform: 'scale(1)',
    transformOrigin: 'center center'
  });

  // Find the current photo index when the modal opens or photo changes
  useEffect(() => {
    const index = photos.findIndex(p => p.id === photo.id);
    setCurrentPhotoIndex(index);
    setIsZoomed(false);
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center center'
    });
  }, [photo, photos]);

  const currentPhoto = photos[currentPhotoIndex] || photo;

  const goToPrevious = () => {
    const newIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photos.length - 1;
    setCurrentPhotoIndex(newIndex);
    setIsZoomed(false);
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center center'
    });
  };

  const goToNext = () => {
    const newIndex = currentPhotoIndex < photos.length - 1 ? currentPhotoIndex + 1 : 0;
    setCurrentPhotoIndex(newIndex);
    setIsZoomed(false);
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center center'
    });
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation(); // Prevent background click
    console.log('Image clicked, current zoom state:', isZoomed);
    
    if (!isZoomed) {
      // Zooming IN - calculate the click position relative to the image
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Convert to percentages for transform-origin
      const originX = (x / rect.width) * 100;
      const originY = (y / rect.height) * 100;
      
      console.log('Zooming IN at:', `${originX}% ${originY}%`);
      
      setZoomStyle({
        transform: 'scale(2)',
        transformOrigin: `${originX}% ${originY}%`
      });
      setIsZoomed(true);
    } else {
      // Zooming OUT
      console.log('Zooming OUT');
      setZoomStyle({
        transform: 'scale(1)',
        transformOrigin: 'center center'
      });
      setIsZoomed(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentPhotoIndex, photos.length, onClose]);

  const handleBackgroundClick = (event: React.MouseEvent) => {
    // Only close if clicking the background, not the image container
    if (event.target === event.currentTarget) {
      if (isZoomed) {
        // If zoomed, zoom out first
        setZoomStyle({
          transform: 'scale(1)',
          transformOrigin: 'center center'
        });
        setIsZoomed(false);
      } else {
        // If not zoomed, close modal
        onClose();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      <div className="max-w-4xl w-full">
        <div className="relative overflow-hidden">
          <img
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            className="w-full h-auto max-h-[80vh] object-contain cursor-pointer transition-transform duration-300 ease-out"
            onClick={handleImageClick}
            style={zoomStyle}
          />
        </div>
        
        <div className="text-center mt-6 text-white">
          <h3 className="text-2xl font-light mb-2">{currentPhoto.title}</h3>
          <p className="text-gray-300 font-light">{currentPhoto.description}</p>
          {photos.length > 1 && (
            <p className="text-gray-400 text-sm mt-2">
              {currentPhotoIndex + 1} of {photos.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
