'use client';
import {Assetinfo, Summary} from '@/types';
import {getHighResImageUrl} from '@/utils/helpers';
import {useEffect} from 'react';

interface ImagePreloaderProps {
  thumbnails: Assetinfo[];
  productSummary: Summary;
}

const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  thumbnails,
  productSummary,
}) => {
  useEffect(() => {
    const preloadImages = async () => {
      try {
        // Preload main packshot
        if (productSummary?.packshot) {
          await preloadImage(getHighResImageUrl(productSummary.packshot));
        }

        // Preload all thumbnails
        const thumbnailPromises = thumbnails.map(thumbnail =>
          preloadImage(getHighResImageUrl(thumbnail.downloadurl)),
        );

        await Promise.all(thumbnailPromises);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadImages();
  }, [productSummary?.packshot, thumbnails]);

  // This component doesn't render anything
  return null;
};

export default ImagePreloader;
