import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import type { TraitSelection } from '../types';

interface AvatarPreviewProps {
  selections: TraitSelection;
  onPreviewReady: (canvas: HTMLCanvasElement | null) => void;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({ selections, onPreviewReady }) => {
  const stageRef = useRef<any>(null);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 300, height: 300 });

  // Layer order for proper rendering - matching the original config.js order
  const layerOrder = [
    '00background',
    '01body',
    '02face',
    '03hair',
    '03body hoodie',
    '04mouth',
    '05eye',
    '06accessory',
    '07facemask'
  ];

  useEffect(() => {
    // Set responsive size - explicit sizing to prevent canvas mismatch
    const updateSize = () => {
      const isMobile = window.innerWidth < 1024;
      // Canvas size should match display size exactly
      const size = isMobile ? 280 : 400;
      setStageSize({ width: size, height: size });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);


  useEffect(() => {
    loadImages();
  }, [selections]);

  useEffect(() => {
    // Export canvas when images are ready
    if (Object.keys(images).length > 0 && stageRef.current) {
      // Create high-resolution canvas for download (1000x1000)
      const originalScale = stageRef.current.scaleX();
      const exportScale = 1000 / stageSize.width;

      stageRef.current.scale({ x: exportScale, y: exportScale });

      const canvas = stageRef.current.toCanvas({
        width: 1000,
        height: 1000,
        pixelRatio: 1
      });

      // Restore original scale
      stageRef.current.scale({ x: originalScale, y: originalScale });

      onPreviewReady(canvas);
    }
  }, [images, onPreviewReady, stageSize]);

  const loadImages = async () => {
    setIsLoading(true);
    const newImages: Record<string, HTMLImageElement> = {};

    const loadPromises = layerOrder.map((category) => {
      return new Promise<void>((resolve) => {
        const selection = getSelectionForCategory(category);
        if (!selection) {
          resolve();
          return;
        }

        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          newImages[category] = img;
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${selection.path}`);
          resolve();
        };
        img.src = selection.path;
      });
    });

    await Promise.all(loadPromises);
    setImages(newImages);
    setIsLoading(false);
  };

  const getSelectionForCategory = (category: string) => {
    const categoryMap: Record<string, keyof TraitSelection> = {
      '00background': 'background',
      '01body': 'body',
      '02face': 'face',
      '03hair': 'hair',
      '03body hoodie': 'bodyHoodie',
      '04mouth': 'mouth',
      '05eye': 'eye',
      '06accessory': 'accessory',
      '07facemask': 'facemask'
    };

    const key = categoryMap[category];
    return key ? selections[key] : null;
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-luxury border border-white/30 relative overflow-hidden">
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-rose-200/30 to-transparent rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-pink-200/30 to-transparent rounded-full"></div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-rose-500 mx-auto mb-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl animate-pulse">✨</span>
                </div>
              </div>
              <p className="text-rose-600 font-elegant font-semibold text-lg">Creating magic...</p>
              <p className="text-rose-400 font-elegant text-sm mt-1">Your avatar is being crafted</p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-white via-rose-50/30 to-pink-50/30 rounded-3xl p-3 lg:p-4 shadow-inner border border-white/50">
          <div
            className="rounded-3xl bg-gradient-to-br from-pearl to-white shadow-elegant overflow-hidden border-2 border-white/80 relative"
            style={{
              width: stageSize.width,
              height: stageSize.height,
              position: 'relative'
            }}
          >
            {/* Canvas container with premium styling */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-rose-100/20 pointer-events-none"></div>

            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              pixelRatio={window.devicePixelRatio || 1}
            >
            <Layer>
              {layerOrder.map((category) => {
                const image = images[category];
                if (!image) return null;

                return (
                  <KonvaImage
                    key={category}
                    image={image}
                    width={stageSize.width}
                    height={stageSize.height}
                    x={0}
                    y={0}
                  />
                );
              })}
            </Layer>
            </Stage>

            {/* Subtle frame overlay */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none"></div>
          </div>
        </div>

        {/* Premium label */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full border border-rose-200/50">
            <span className="text-sm">👑</span>
            <span className="font-elegant text-sm font-medium text-rose-700">Live Preview</span>
            <span className="text-sm">👑</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarPreview;