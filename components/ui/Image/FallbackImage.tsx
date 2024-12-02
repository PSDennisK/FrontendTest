'use client';

import noImage from '@/public/images/no-image-available.jpg';
import {FallBackImage} from '@/types';
import Image from 'next/image';
import React, {useCallback, useEffect, useState} from 'react';
import {AiOutlineLoading3Quarters} from 'react-icons/ai';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde tussen retries

const FallbackImage: React.FC<FallBackImage> = ({
  src,
  alt,
  onLoad,
  onError,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const checkImageUrl = useCallback(async (url: string) => {
    try {
      const response = await fetch(url, {method: 'HEAD'});
      return response.ok;
    } catch (error) {
      return false;
    }
  }, []);

  const retryLoadImage = useCallback(async () => {
    if (src && retryCount < MAX_RETRIES) {
      const isAvailable = await checkImageUrl(src);

      if (isAvailable) {
        setImgSrc(src);
        setRetryCount(0);
      } else {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          retryLoadImage();
        }, RETRY_DELAY);
      }
    } else if (retryCount >= MAX_RETRIES) {
      console.error(`Failed to load image after ${MAX_RETRIES} retries:`, src);
      setImgSrc(noImage as unknown as string);
      onError?.();
    }
  }, [src, retryCount, checkImageUrl, onError]);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setRetryCount(0);
  }, [src]);

  const handleError = async () => {
    setIsLoading(false);

    if (retryCount === 0) {
      retryLoadImage();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setRetryCount(0);
    onLoad?.();
  };

  return (
    <>
      <Image
        {...rest}
        itemProp="image"
        alt={alt ? alt : 'image'}
        src={imgSrc ? imgSrc : noImage}
        onError={handleError}
        onLoad={handleLoad}
      />
      {isLoading && retryCount > 0 && (
        <div className="text-sm text-gray-500">
          <AiOutlineLoading3Quarters />
        </div>
      )}
    </>
  );
};

export default FallbackImage;
