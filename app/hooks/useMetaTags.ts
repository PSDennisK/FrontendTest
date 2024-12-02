import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

interface MetaTagsConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  noindex?: boolean;
  alternateLangs?: {[key: string]: string};
}

interface UseMetaTagsProps {
  config: Partial<MetaTagsConfig>;
  variables?: Record<string, string>;
  translationPrefix?: string;
}

const updateMetaTag = (name: string, content?: string) => {
  if (!content) return;

  let element =
    document.querySelector(`meta[name="${name}"]`) ||
    document.querySelector(`meta[property="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(name.includes('og:') ? 'property' : 'name', name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const updateLinkTag = (rel: string, href?: string) => {
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

export const useMetaTags = ({
  config,
  variables = {},
  translationPrefix,
}: UseMetaTagsProps) => {
  const {t} = useTranslation('common');

  useEffect(() => {
    // Helper function to get translated content
    const getContent = (key: string, defaultValue?: string): string => {
      if (!translationPrefix) return defaultValue || '';

      const translationKey = `${translationPrefix}.${key}`;
      const translation = t(translationKey, variables);

      return translation !== translationKey ? translation : defaultValue || '';
    };

    // Update document title
    const title = config.title || getContent('title');
    if (title) document.title = title;

    // Basic meta tags
    updateMetaTag(
      'description',
      config.description || getContent('description'),
    );
    if (config.keywords) updateMetaTag('keywords', config.keywords);

    // Open Graph tags
    updateMetaTag('og:title', config.ogTitle || title);
    updateMetaTag('og:description', config.ogDescription || config.description);
    updateMetaTag('og:image', config.ogImage);
    updateMetaTag('og:url', config.ogUrl);

    // Twitter Card tags
    updateMetaTag('twitter:card', config.twitterCard || 'summary_large_image');
    updateMetaTag('twitter:title', config.twitterTitle || title);
    updateMetaTag(
      'twitter:description',
      config.twitterDescription || config.description,
    );
    updateMetaTag('twitter:image', config.twitterImage || config.ogImage);

    // Canonical and alternate language links
    if (config.canonical) {
      updateLinkTag('canonical', config.canonical);
    }

    if (config.alternateLangs) {
      Object.entries(config.alternateLangs).forEach(([lang, url]) => {
        updateLinkTag('alternate', url);
        const element = document.querySelector(`link[href="${url}"]`);
        if (element) element.setAttribute('hreflang', lang);
      });
    }

    // Robots meta tag for noindex
    if (config.noindex) {
      updateMetaTag('robots', 'noindex,nofollow');
    }

    // Cleanup function
    return () => {
      // Optional: Remove dynamic meta tags on unmount
      // Note: Usually not needed as they will be updated by the next page
    };
  }, [config, t, variables, translationPrefix]);
};
