import React, { useState, useCallback } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay, 
  FaPause, 
  FaExpand,
  FaCompress,
  FaRandom,
  FaTimes,
  FaCog
} from 'react-icons/fa';

const ImageGallery = ({ images = [], autoPlay = false, autoPlayInterval = 3000 }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Sample images if none provided
  const defaultImages = [
    {
      src: 'https://picsum.photos/800/600?random=1',
      alt: 'Nature Scene 1',
      title: 'Beautiful Landscape',
      description: 'A stunning natural landscape'
    },
    {
      src: 'https://picsum.photos/800/600?random=2',
      alt: 'Nature Scene 2',
      title: 'Mountain View',
      description: 'Majestic mountain peaks'
    },
    {
      src: 'https://picsum.photos/800/600?random=3',
      alt: 'Nature Scene 3',
      title: 'Forest Path',
      description: 'Peaceful forest trail'
    },
    {
      src: 'https://picsum.photos/800/600?random=4',
      alt: 'Nature Scene 4',
      title: 'Ocean Waves',
      description: 'Calming ocean waves'
    },
    {
      src: 'https://picsum.photos/800/600?random=5',
      alt: 'Nature Scene 5',
      title: 'Sunset',
      description: 'Golden hour beauty'
    },
    {
      src: 'https://picsum.photos/800/600?random=6',
      alt: 'Nature Scene 6',
      title: 'Wildlife',
      description: 'Animals in their habitat'
    }
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  // Shuffle images function
  const shuffleImages = useCallback(() => {
    const shuffled = [...displayImages].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    setShuffleMode(true);
  }, [displayImages]);

  // Reset to original order
  const resetOrder = useCallback(() => {
    setShuffleMode(false);
    setShuffledImages([]);
  }, []);

  // Get current image set
  const getCurrentImages = () => {
    return shuffleMode ? shuffledImages : displayImages;
  };

  // Handle image click
  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    setControlsVisible(true); // Show controls when lightbox opens
  };

  // Navigation functions
  const goToPrevious = useCallback(() => {
    const currentImages = getCurrentImages();
    setCurrentIndex((prev) => 
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  }, [shuffleMode, shuffledImages, displayImages]);

  const goToNext = useCallback(() => {
    const currentImages = getCurrentImages();
    setCurrentIndex((prev) => 
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  }, [shuffleMode, shuffledImages, displayImages]);

  // Auto-play functionality
  React.useEffect(() => {
    let interval;
    if (isPlaying && lightboxOpen) {
      interval = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, lightboxOpen, goToNext, autoPlayInterval]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'Escape':
          setLightboxOpen(false);
          break;
        case 'h':
        case 'H':
          setControlsVisible(!controlsVisible);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext, isPlaying, controlsVisible]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Toggle controls visibility
  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  // Hide controls after inactivity
  React.useEffect(() => {
    if (!lightboxOpen || !controlsVisible) return;

    const hideTimer = setTimeout(() => {
      setControlsVisible(false);
    }, 3000); // Hide after 3 seconds of inactivity

    return () => clearTimeout(hideTimer);
  }, [lightboxOpen, controlsVisible, currentIndex, isPlaying]);

  const currentImages = getCurrentImages();

  return (
    <div className="container-fluid">
      {/* Gallery Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Image Gallery</h2>
            <div className="btn-group" role="group">
              <button 
                className={`btn btn-outline-primary ${shuffleMode ? 'active' : ''}`}
                onClick={shuffleMode ? resetOrder : shuffleImages}
                title={shuffleMode ? 'Reset Order' : 'Shuffle Images'}
              >
                <FaRandom /> {shuffleMode ? ' Reset' : ' Shuffle'}
              </button>
              {autoPlay && (
                <button 
                  className={`btn btn-outline-success ${isPlaying ? 'active' : ''}`}
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'Pause Auto-play' : 'Start Auto-play'}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />} Auto-play
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="gallery-grid">
        {currentImages.map((image, index) => (
          <div 
            key={index}
            className="gallery-item"
            onClick={() => handleImageClick(index)}
          >
            <img 
              src={image.src} 
              alt={image.alt}
              className="img-fluid"
              loading="lazy"
            />
            <div className="gallery-overlay">
              <h6 className="mb-1">{image.title}</h6>
              <p className="mb-0 small">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentIndex}
        slides={currentImages.map(img => ({ src: img.src, alt: img.alt }))}
        render={{
          iconNext: () => <FaChevronRight />,
          iconPrev: () => <FaChevronLeft />,
        }}
        carousel={{
          finite: false,
          preload: 2,
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
        }}
        on={{
          view: ({ index }) => setCurrentIndex(index),
        }}
      />

      {/* Dismissable Controls Overlay */}
      {lightboxOpen && (
        <>
          {/* Controls Toggle Button (always visible) */}
          <button 
            className="gallery-controls-toggle"
            onClick={toggleControls}
            title={`${controlsVisible ? 'Hide' : 'Show'} Controls (H)`}
          >
            <FaCog />
          </button>

          {/* Main Controls */}
          <div className={`gallery-controls ${controlsVisible ? 'visible' : 'hidden'}`}>
            <button onClick={goToPrevious} title="Previous (←)">
              <FaChevronLeft />
            </button>
            
            <div className="gallery-counter">
              {currentIndex + 1} / {currentImages.length}
            </div>
            
            <button onClick={goToNext} title="Next (→)">
              <FaChevronRight />
            </button>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            
            <button 
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F11)'}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>

            <button 
              onClick={() => setControlsVisible(false)}
              title="Hide Controls"
              className="controls-close"
            >
              <FaTimes />
            </button>
          </div>
        </>
      )}

      {/* Instructions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h6>Gallery Controls:</h6>
            <ul className="mb-0 small">
              <li><strong>Click</strong> any image to open lightbox</li>
              <li><strong>Arrow keys</strong> to navigate</li>
              <li><strong>Spacebar</strong> to play/pause auto-play</li>
              <li><strong>H key</strong> to toggle controls visibility</li>
              <li><strong>Escape</strong> to close lightbox</li>
              <li><strong>Shuffle</strong> to randomize image order</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
