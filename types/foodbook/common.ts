import {ReactNode} from 'react';

export type BreadCrumb = {
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
  locale: keyof typeof Culture;
};

export type BreadCrumbItem = {
  href: string;
  label: string;
  isLast: boolean;
};

export type Description = {
  value: string;
  translation: Translation[];
};

export type Functionalname = {
  value: string;
  translation: Translation;
};

export type Name = {
  value: null | string;
};

export type SEO = {
  title: string;
  description: string;
};

export type Translation = {
  value: string;
  culture: Culture;
};

export type TranslationInput = Translation[] | TranslationObject;

export type TranslationObject = {
  value?: string;
  translation?: Translation[] | Translation;
};

export enum Culture {
  fr = 'fr-FR',
  nl = 'nl-NL',
  de = 'de-DE',
  en = 'en-US',
}
