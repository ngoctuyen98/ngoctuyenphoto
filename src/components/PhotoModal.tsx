
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
  const [transformOrigin, setTransformOrigin] = useState<string>('center');

  // Find the current photo index when the modal opens or photo changes
  useEffect(() => {
    const index = photos.findIndex(p => p.id === photo.id);
    setCurrentPhotoIndex(index);
    setIsZoomed(false); // Reset zoom state when photo changes
    setTransformOrigin('center'); // Reset transform origin
  }, [photo, photos]);

  const currentPhoto = photos[currentPhotoIndex] || photo;

  const goToPrevious = () => {
    const newIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photos.length - 1;
    setCurrentPhotoIndex(newIndex);
    setIsZoomed(false);
    setTransformOrigin('center');
  };

  const goToNext = () => {
    const newIndex = currentPhotoIndex < photos.length - 1 ? currentPhotoIndex + 1 : 0;
    setCurrentPhotoIndex(newIndex);
    setIsZoomed(false);
    setTransformOrigin('center');
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
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
      setTransformOrigin(`${originX}% ${originY}%`);
      setIsZoomed(true);
    } else {
      // Zooming OUT
      console.log('Zooming OUT');
      setTransformOrigin('center');
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

  const handleBackgroundClick = () => {
    if (isZoomed) {
      // If zoomed, zoom out first
      setTransformOrigin('center');
      setIsZoomed(false);
    } else {
      // If not zoomed, close modal
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
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
            className={`w-full h-auto max-h-[80vh] object-contain cursor-pointer transition-transform duration-300 ${
              isZoomed ? 'scale-200' : 'scale-100'
            }`}
            onClick={handleImageClick}
            style={{ transformOrigin: transformOrigin }}
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

      <div 
        className="absolute inset-0 -z-10" 
        onClick={handleBackgroundClick}
      ></div>
    </div>
  );
};

export default PhotoModal;
