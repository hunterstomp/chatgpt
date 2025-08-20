# Bootstrap Image Gallery with Lightbox

A modern, responsive image gallery built with React, Bootstrap, and advanced lightbox functionality featuring serial flow control.

## Features

### 🖼️ Image Gallery
- **Responsive Grid Layout**: Bootstrap-powered responsive grid that adapts to all screen sizes
- **Hover Effects**: Smooth animations and overlay information on image hover
- **Lazy Loading**: Images load as needed for better performance
- **Custom Image Support**: Pass your own image array or use built-in sample images

### 🔍 Lightbox Functionality
- **Full-Screen Viewing**: Click any image to open in a beautiful lightbox
- **Keyboard Navigation**: Arrow keys, spacebar, and escape for full control
- **Touch Support**: Swipe gestures on mobile devices
- **Backdrop Click**: Click outside to close

### 🎮 Serial Flow Control
- **Auto-Play Mode**: Automatic slideshow with customizable interval
- **Shuffle Mode**: Randomize image order for variety
- **Navigation Controls**: Previous/Next buttons with image counter
- **Fullscreen Toggle**: Enter/exit fullscreen mode
- **Play/Pause Control**: Start or stop auto-play at any time

### 🎨 Bootstrap Integration
- **Modern UI**: Clean, professional design using Bootstrap components
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Custom Styling**: Enhanced with custom CSS for unique appearance
- **Accessibility**: Built with accessibility best practices

## Installation

```bash
npm install
```

## Usage

### Basic Usage
```jsx
import ImageGallery from './components/ImageGallery';

function App() {
  return (
    <ImageGallery />
  );
}
```

### With Custom Images
```jsx
const customImages = [
  {
    src: 'path/to/image1.jpg',
    alt: 'Image 1',
    title: 'My Image',
    description: 'Description here'
  }
];

<ImageGallery 
  images={customImages}
  autoPlay={true}
  autoPlayInterval={3000}
/>
```

### Props
- `images` (array): Custom image array (optional)
- `autoPlay` (boolean): Enable auto-play mode (default: false)
- `autoPlayInterval` (number): Auto-play interval in milliseconds (default: 3000)

## Controls

### Keyboard Shortcuts
- **←/→**: Navigate between images
- **Spacebar**: Play/pause auto-play
- **Escape**: Close lightbox
- **F11**: Toggle fullscreen

### Mouse/Touch Controls
- **Click**: Open lightbox
- **Swipe**: Navigate on mobile
- **Click outside**: Close lightbox
- **Control buttons**: Use on-screen controls

## Dependencies

- React 19
- Bootstrap 5
- Yet Another React Lightbox
- React Icons
- Font Awesome

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Customization

The gallery is highly customizable through CSS variables and Bootstrap classes. Modify the styles in `src/index.css` to match your design requirements.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use in your projects!
