import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [transformOrigin, setTransformOrigin] = useState('center center');

  const zoomLevels = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5];
  const maxZoom = 5;
  const minZoom = 0.25;

  // Find the current photo index when the modal opens or photo changes
  useEffect(() => {
    const index = photos.findIndex(p => p.id === photo.id);
    setCurrentPhotoIndex(index);
    resetZoom();
  }, [photo, photos]);

  const currentPhoto = photos[currentPhotoIndex] || photo;

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setTransformOrigin('center center');
  };

  const goToPrevious = () => {
    const newIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photos.length - 1;
    setCurrentPhotoIndex(newIndex);
    resetZoom();
  };

  const goToNext = () => {
    const newIndex = currentPhotoIndex < photos.length - 1 ? currentPhotoIndex + 1 : 0;
    setCurrentPhotoIndex(newIndex);
    resetZoom();
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    
    if (zoomLevel === 1) {
      // Zoom in to 2x at the clicked position
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const originX = (x / rect.width) * 100;
      const originY = (y / rect.height) * 100;
      
      setTransformOrigin(`${originX}% ${originY}%`);
      setZoomLevel(2);
      // Reset pan offset when zooming in
      setPanOffset({ x: 0, y: 0 });
    } else {
      // Reset to fit view
      resetZoom();
    }
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    
    if (zoomLevel === 1) {
      // Double-click to zoom in to 3x
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const originX = (x / rect.width) * 100;
      const originY = (y / rect.height) * 100;
      
      setTransformOrigin(`${originX}% ${originY}%`);
      setZoomLevel(3);
      // Reset pan offset when zooming in
      setPanOffset({ x: 0, y: 0 });
    } else {
      resetZoom();
    }
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    
    const delta = event.deltaY > 0 ? -0.25 : 0.25;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel + delta));
    
    if (newZoom !== zoomLevel) {
      // If zooming out to 1x or less, reset pan offset
      if (newZoom <= 1) {
        setPanOffset({ x: 0, y: 0 });
        setTransformOrigin('center center');
      } else {
        // Set transform origin to mouse position for wheel zoom
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const originX = (x / rect.width) * 100;
        const originY = (y / rect.height) * 100;
        
        setTransformOrigin(`${originX}% ${originY}%`);
      }
      
      setZoomLevel(newZoom);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setLastPanPoint({ x: event.clientX, y: event.clientY });
      event.preventDefault();
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      const deltaX = event.clientX - lastPanPoint.x;
      const deltaY = event.clientY - lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const zoomIn = () => {
    const currentIndex = zoomLevels.findIndex(level => level >= zoomLevel);
    const nextIndex = Math.min(currentIndex + 1, zoomLevels.length - 1);
    const newZoom = zoomLevels[nextIndex];
    
    if (newZoom <= 1) {
      setPanOffset({ x: 0, y: 0 });
      setTransformOrigin('center center');
    }
    
    setZoomLevel(newZoom);
  };

  const zoomOut = () => {
    const currentIndex = zoomLevels.findIndex(level => level >= zoomLevel);
    const prevIndex = Math.max(currentIndex - 1, 0);
    const newZoom = zoomLevels[prevIndex];
    
    if (newZoom <= 1) {
      setPanOffset({ x: 0, y: 0 });
      setTransformOrigin('center center');
    }
    
    setZoomLevel(newZoom);
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
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.overflow = 'unset';
    };
  }, [currentPhotoIndex, photos.length, onClose, zoomLevel]);

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      if (zoomLevel > 1) {
        resetZoom();
      } else {
        onClose();
      }
    }
  };

  const getImageStyle = () => {
    if (zoomLevel <= 1) {
      return {
        transform: 'scale(1)',
        transformOrigin: 'center center',
        cursor: 'zoom-in'
      };
    }
    
    return {
      transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
      transformOrigin: transformOrigin,
      cursor: isPanning ? 'grabbing' : 'grab'
    };
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
    >
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-black/40 rounded-lg p-1">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= minZoom}
              className="text-white hover:text-gray-300 transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="text-white text-sm px-2 min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= maxZoom}
              className="text-white hover:text-gray-300 transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={resetZoom}
            className="text-white hover:text-gray-300 transition-colors bg-black/40 p-2 rounded-lg"
            title="Reset zoom (0)"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors bg-black/40 p-2 rounded-lg"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/40 hover:bg-black/60 p-3 rounded-full"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/40 hover:bg-black/60 p-3 rounded-full"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      <div className="max-w-4xl w-full h-full flex flex-col">
        <div 
          className="flex-1 flex items-center justify-center overflow-hidden"
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
        >
          <img
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out select-none"
            onClick={handleImageClick}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            style={getImageStyle()}
            draggable={false}
          />
        </div>
        
        <div className="text-center mt-4 text-white flex-shrink-0">
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
