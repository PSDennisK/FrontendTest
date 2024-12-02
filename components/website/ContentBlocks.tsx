import styles from '@/app/styles/colors.module.css';
import {Container, Section} from '@/components/ui/Layout';
import {umbraco} from '@/foodbook.config';
import {UmbracoContent, UmbracoImage, UmbracoLink} from '@/types';
import {getUrlFromPageLink} from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import {memo, useMemo} from 'react';

interface ContentBlockProps {
  contentBlock: UmbracoContent['items'][number];
}

const BlockMedia = memo(({media}: {media: UmbracoImage[]}) => {
  const images = useMemo(
    () => media?.filter(i => i.mediaType === 'Image'),
    [media],
  );
  const videos = useMemo(
    () => media?.filter(v => v.mediaType === 'umbracoMediaVideo'),
    [media],
  );

  if (!media?.length) return null;

  if (videos?.length === 1) {
    return (
      <video
        className="w-auto min-w-full max-w-full rounded-xl mb-5"
        autoPlay
        controls
        loop
        muted
        src={`${umbraco.site_domain}${videos[0].url}`}
      />
    );
  }

  if (images?.length === 1) {
    return (
      <Image
        width={720}
        height={400}
        alt={images[0].name}
        src={`${umbraco.site_domain}${images[0].url}`}
        className="rounded-xl"
        loading="lazy"
      />
    );
  }

  return (
    <>
      {images?.map(blockImage => (
        <Image
          key={blockImage.id}
          width={555}
          height={400}
          alt={blockImage.name}
          src={`${umbraco.site_domain}${blockImage.url}`}
          className="rounded-xl mb-4 last:mb-0"
          loading="lazy"
        />
      ))}
    </>
  );
});

const BlockContent = memo(({contentBlock}: ContentBlockProps) => {
  const {blockTitle, blockSubtitle, blockContent, blockButton, blockColor} =
    contentBlock.content.properties;

  const buttonElements = useMemo(() => {
    return blockButton?.map((link: UmbracoLink) => (
      <Link
        key={link.destinationId}
        href={getUrlFromPageLink(link)}
        title={link.title}
        className="inline-flex bg-ps-green-500 text-white border border-ps-green-500 text-lg leading-6 rounded-md py-3 px-4 transition-all duration-300 ease-in-out transform hover:bg-white hover:border hover:text-ps-green-500"
        target={link.target}
      >
        {link.title}
      </Link>
    ));
  }, [blockButton]);

  return (
    <>
      <h3 className={`${styles[blockColor]} text-xs uppercase font-bold`}>
        {blockSubtitle}
      </h3>
      <h2 className="mt-5 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
        {blockTitle}
      </h2>
      {blockContent && (
        <div
          className="prose prose-md prose-ul:m-0 prose-li:m-0 prose-li:marker:text-ps-blue-400 pt-4 pb-8 m-0 text-gray-700 border-0 border-gray-300 sm:pr-12"
          dangerouslySetInnerHTML={{__html: blockContent.markup}}
        />
      )}
      {blockButton && (
        <div className="flex flex-wrap gap-2">{buttonElements}</div>
      )}
    </>
  );
});

const ContentBlock = memo(({contentBlock}: ContentBlockProps) => {
  const isRightAligned = useMemo(
    () => contentBlock.content.properties.blockAlign.toLowerCase() === 'right',
    [contentBlock.content.properties.blockAlign],
  );

  return (
    <Container className="flex flex-col md:flex-row items-center content-center mx-auto leading-6 text-black">
      <Container
        className={`w-full max-w-md px-4 mt-5 mb-4 text-center md:mt-0 md:max-w-none lg:mb-0 md:w-1/2 ${
          isRightAligned ? 'md:order-1' : 'md:order-2'
        }`}
      >
        <BlockMedia media={contentBlock.content.properties.blockImage} />
      </Container>
      <Container
        className={`w-full text-black md:w-1/2 px-4 ${
          isRightAligned ? 'md:order-2' : 'md:order-1'
        }`}
      >
        <BlockContent contentBlock={contentBlock} />
      </Container>
    </Container>
  );
});

const ContentBlocks = memo(
  ({contentBlocks}: {contentBlocks: UmbracoContent}) => {
    return (
      <Section
        id="contentblocks"
        className="relative max-w-7xl space-y-16 md:space-y-28"
      >
        {contentBlocks?.items?.map(contentBlock => (
          <ContentBlock
            key={contentBlock?.content?.id}
            contentBlock={contentBlock}
          />
        ))}
      </Section>
    );
  },
);

BlockMedia.displayName = 'BlockMedia';
BlockContent.displayName = 'BlockContent';
ContentBlock.displayName = 'ContentBlock';
ContentBlocks.displayName = 'ContentBlocks';

export default ContentBlocks;
