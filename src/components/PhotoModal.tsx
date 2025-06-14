
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

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
  onClose: () => void;
}

const PhotoModal = ({ photo, onClose }: PhotoModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X className="h-8 w-8" />
      </button>

      <div className="max-w-4xl w-full">
        <div className="relative">
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>
        
        <div className="text-center mt-6 text-white">
          <h3 className="text-2xl font-light mb-2">{photo.title}</h3>
          <p className="text-gray-300 font-light">{photo.description}</p>
        </div>
      </div>

      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      ></div>
    </div>
  );
};

export default PhotoModal;
