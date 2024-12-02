'use client';

import {Culture} from '@/types';
import i18next, {i18n} from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import {useEffect} from 'react';
import {initReactI18next, useTranslation as useTransAlias} from 'react-i18next';
import {getOptions, locales} from './settings';

const runsOnServerSide = typeof window === 'undefined';

// Initialize i18next for the client side
i18next
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: keyof typeof Culture, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined, // detect the language on the client
    detection: {
      order: ['path'],
    },
    preload: runsOnServerSide ? locales : [],
  });

export function useTranslation(lng: keyof typeof Culture, ns: string) {
  const translator = useTransAlias(ns);
  const {i18n} = translator;

  // Run content is being rendered on server side
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  } else {
    // Use our custom implementation when running on client side
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCustomTranslationImplem(i18n, lng);
  }
  return translator;
}

function useCustomTranslationImplem(i18n: i18n, lng: keyof typeof Culture) {
  // This effect changes the language of the application when the lng prop changes.
  useEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) return;
    i18n.changeLanguage(lng);
  }, [lng, i18n]);
}
