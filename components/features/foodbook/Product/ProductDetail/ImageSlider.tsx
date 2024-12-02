'use client';

import FallbackImage from '@/components/ui/Image/FallbackImage';
import {Container, Section} from '@/components/ui/Layout';
import {Assetinfo, Summary} from '@/types';
import {getHighResImageUrl} from '@/utils/helpers';
import Image from 'next/image';
import {FC, memo, useEffect, useMemo, useState} from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import {FreeMode, Mousewheel, Navigation, Thumbs} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

const CLASSES = {
  section: 'w-full lg:w-1/4 xl:mr-[70px] lg:mr-[50px] print:hidden',
  container: 'w-full',
  mainSlider: 'border rounded mb-4',
  slide: {
    base: 'm-0 items-center justify-center',
    main: 'min-h-[350px] max-h-[350px]',
    thumb: 'min-h-[65px] max-h-[65px] border rounded-xl cursor-pointer',
  },
  image: {
    base: 'p-2 max-h-full max-w-full h-auto w-auto',
    cover: 'object-cover',
    contain: 'object-contain',
  },
  fallbackContainer:
    'swiper swiper-initialized swiper-horizontal swiper-backface-hidden border rounded-xl mb-4',
  fallbackWrapper: 'swiper-wrapper',
  fallbackSlide:
    'swiper-slide swiper-slide-active m-0 max-w-[350px] max-h-[350px] items-center justify-center',
} as const;

const ENDPOINTS = {
  youtube: {
    thumb:
      process.env.NEXT_PUBLIC_YOUTUBE_THUMBNAIL_BASE_URL ||
      'https://img.youtube.com/vi',
    embed:
      process.env.NEXT_PUBLIC_YOUTUBE_EMBED_BASE_URL ||
      'https://www.youtube.com/embed',
  },
  vimeo: {
    thumb:
      process.env.NEXT_PUBLIC_VIMEO_THUMBNAIL_BASE_URL ||
      'https://vumbnail.com',
    embed:
      process.env.NEXT_PUBLIC_VIMEO_EMBED_BASE_URL ||
      'https://player.vimeo.com/video',
  },
} as const;

type ImageSliderProps = {
  thumbnails: Assetinfo[];
  videos?: Assetinfo[];
  productsummary: Summary;
  showNavigation?: boolean;
};

const OptimizedImage: FC<{item: Assetinfo; thumbSize?: boolean}> = memo(
  ({item, thumbSize}) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <Image
        itemProp="image"
        src={getHighResImageUrl(item.downloadurl)}
        alt={item.labelname?.value || ''}
        className={`${CLASSES.image.base} ${CLASSES.image.cover} ${!thumbSize ? 'my-0' : ''}`}
        width={thumbSize ? 65 : 350}
        height={thumbSize ? 65 : 350}
        priority
        loading="eager"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        sizes={thumbSize ? '65px' : '350px'}
      />
    );
  },
);

const getVideoUrls = (item: Assetinfo) => {
  const isYoutube = item.formattypeid === '301';
  const isVimeo = item.formattypeid === '302';
  const id = item.externalreferenceid;

  return {
    thumbnail: isYoutube
      ? `${ENDPOINTS.youtube.thumb}/${id}/default.jpg`
      : isVimeo
        ? `${ENDPOINTS.vimeo.thumb}/${id}.jpg`
        : '/placeholder-video-thumb.jpg',
    embed: isYoutube
      ? `${ENDPOINTS.youtube.embed}/${id}`
      : isVimeo
        ? `${ENDPOINTS.vimeo.embed}/${id}`
        : '',
  };
};

const ImageSlider: FC<ImageSliderProps> = memo(
  ({thumbnails, videos = [], productsummary, showNavigation = true}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const assets = useMemo(() => {
      const validThumbnails = Array.isArray(thumbnails) ? thumbnails : [];
      const validVideos = Array.isArray(videos) ? videos : [];
      return [...validThumbnails, ...validVideos];
    }, [thumbnails, videos]);

    useEffect(() => {
      const preloadImages = async () => {
        setIsLoading(true);
        try {
          await Promise.all(
            assets.map(item => {
              if (!item.downloadurl) return Promise.resolve();

              return new Promise<void>((resolve, reject) => {
                const image = document.createElement('img');
                image.onload = () => resolve();
                image.onerror = () => reject();
                image.src = getHighResImageUrl(item.downloadurl);
              });
            }),
          );
        } catch (error) {
          console.error('Error preloading images:', error);
        }
        setIsLoading(false);
      };

      preloadImages();
    }, [assets]);

    const renderSlides = (items: Assetinfo[], isThumb = false) =>
      items.map(item => {
        const {thumbnail, embed} = getVideoUrls(item);
        const slideClass = `${CLASSES.slide.base} ${isThumb ? CLASSES.slide.thumb : CLASSES.slide.main}`;

        return (
          <SwiperSlide key={item.id} className={slideClass}>
            {item.typeid === '3' ? (
              isThumb ? (
                <Image
                  src={thumbnail}
                  alt={
                    item.title?.value ||
                    item.labelname?.value ||
                    'Video thumbnail'
                  }
                  width={65}
                  height={65}
                  className={`${CLASSES.image.base} ${CLASSES.image.cover} mx-auto`}
                  loading="eager"
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                />
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={embed}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : (
              <OptimizedImage item={item} thumbSize={isThumb} />
            )}
          </SwiperSlide>
        );
      });

    if (assets.length === 0) {
      return (
        <Section className={CLASSES.section}>
          <Container className={CLASSES.fallbackContainer}>
            <Container className={CLASSES.fallbackWrapper}>
              <Container className={CLASSES.fallbackSlide}>
                <FallbackImage
                  itemProp="image"
                  id={productsummary?.id}
                  src={getHighResImageUrl(productsummary?.packshot)}
                  alt={productsummary?.name.value ?? ''}
                  className={`${CLASSES.image.base} ${CLASSES.image.contain}`}
                  width={350}
                  height={350}
                  priority
                  loading="eager"
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                />
              </Container>
            </Container>
          </Container>
        </Section>
      );
    }

    return (
      <Section className={CLASSES.section}>
        <Container className={CLASSES.container}>
          <Swiper
            loop
            spaceBetween={0}
            thumbs={{swiper: thumbsSwiper}}
            modules={[Navigation, Mousewheel, FreeMode, Thumbs]}
            mousewheel
            navigation={showNavigation}
            className={CLASSES.mainSlider}
            onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
          >
            {renderSlides(assets)}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            loop
            spaceBetween={10}
            slidesPerView={4}
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Thumbs]}
          >
            {renderSlides(assets, true)}
          </Swiper>
        </Container>
      </Section>
    );
  },
);

OptimizedImage.displayName = 'OptimizedImage';
ImageSlider.displayName = 'ImageSlider';

export default ImageSlider;
