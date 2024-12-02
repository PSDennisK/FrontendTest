import {fallbackLng} from '@/i18n';
import {Culture, Translation, TranslationInput, UmbracoLink} from '@/types';

import {Locale} from 'date-fns';
import {enUS} from 'date-fns/locale/en-US';
import {nl} from 'date-fns/locale/nl';

export function getHomeUrl(locale: string) {
  if (locale === fallbackLng) {
    return '/';
  }
  return `/${locale}`;
}

export const convertToBoolean = (value: string | number | boolean): boolean => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
};

export const renderApplicable = (
  value: string | number | boolean,
  isSpecified: boolean = true,
  translations: {
    notFilledIn: string;
    yes: string;
    no: string;
  },
): string => {
  if (!isSpecified) return translations.notFilledIn;
  return convertToBoolean(value) ? translations.yes : translations.no;
};

export const isValueFilled = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (typeof value === 'number') return !isNaN(value);
  return true;
};

export const normalizeToArray = <T>(item: T | T[]): T[] =>
  Array.isArray(item) ? item : [item];

export const createSlug = (id: string, name: string) => {
  // Eerst naar lowercase en spaties naar streepjes
  var text = `${id}-${name}`.toLowerCase();

  // Vervang alle niet-alfanumerieke karakters (behalve - en _) door streepjes
  text = text.replace(/[^a-z0-9-_]/g, '-');

  // Vervang meerdere opeenvolgende streepjes door één streepje
  text = text.replace(/-+/g, '-');

  // Verwijder streepjes aan begin en eind
  text = text.replace(/^-+|-+$/g, '');

  return text;
};

export const splitHandle = (slug: string) => {
  const id = slug.substring(0, slug.indexOf('-'));

  return id;
};

export const camelCase = (string: string) => {
  return string
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const toHtmlEntities = (string: string) => {
  if (string) {
    string = string.replaceAll('{', '<strong>');
    string = string.replaceAll('}', '</strong>');
    string = string.replaceAll('\r\n', '<br />');
  }

  return string;
};

export const slugToText = (slug: string) => {
  let parts = [];
  if (slug) {
    parts = slug.split('-');
  }

  if (parts.length > 1) {
    slug = isNaN(Number(parts[0]))
      ? parts.slice(0).join(' ').trim()
      : parts.slice(1).join(' ').trim();
  }

  return slug;
};

function isTranslationArray(input: TranslationInput): input is Translation[] {
  return Array.isArray(input);
}

function isSingleTranslation(
  translation: Translation[] | Translation | undefined,
): translation is Translation {
  return (
    !Array.isArray(translation) &&
    translation !== undefined &&
    'culture' in translation
  );
}

const isValidValue = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== '';
};

export const getTranslationValue = (
  translationInput: TranslationInput,
  culture: keyof typeof Culture,
  fallback?: string,
): string => {
  if (!translationInput) {
    return fallback ?? '';
  }

  if (isTranslationArray(translationInput)) {
    const translation = translationInput.find(
      x => x.culture.toLowerCase() === Culture[culture].toLowerCase(),
    );

    return isValidValue(translation.value)
      ? translation.value
      : isValidValue(fallback)
        ? fallback
        : '';
  }

  const translationObject = translationInput;
  if (!translationObject.translation) {
    return isValidValue(translationObject.value)
      ? translationObject.value
      : isValidValue(fallback)
        ? fallback
        : '';
  }

  if (Array.isArray(translationObject.translation)) {
    const translation = translationObject.translation.find(
      x => x.culture.toLowerCase() === Culture[culture].toLowerCase(),
    );
    if (translationObject?.value === '') {
      return fallback;
    }
    return isValidValue(translation?.value)
      ? translation.value
      : isValidValue(translationObject.value)
        ? translationObject.value
        : isValidValue(fallback)
          ? fallback
          : '';
  }

  return isValidValue(translationObject.value)
    ? translationObject.value
    : isValidValue(fallback)
      ? fallback
      : '';
};
export const addFieldLabelElement = (fieldWrapperElement, field) => {
  const labelElement = document.createElement('label');
  labelElement.innerText = field.caption + ': ';
  const forAttr = document.createAttribute('for');
  forAttr.value = field.id;
  labelElement.setAttributeNode(forAttr);
  fieldWrapperElement.appendChild(labelElement);
  if (field.helpText && field.helpText.length > 0) {
    const helpTextElement = document.createElement('small');
    helpTextElement.innerText = field.helpText;
    fieldWrapperElement.appendChild(helpTextElement);
  }
};
export const addAttributeFromFieldSettings = (
  fieldElement,
  attrName,
  settings,
  settingKey,
  defaultValue,
) => {
  const attr = document.createAttribute(attrName);
  if (settings[settingKey] && settings[settingKey].length > 0) {
    attr.value = settings[settingKey];
  } else {
    attr.value = defaultValue;
  }
  if (attr.value !== '') {
    fieldElement.setAttributeNode(attr);
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatDate = (date: Date): string => {
  const dagen = [
    'zondag',
    'maandag',
    'dinsdag',
    'woensdag',
    'donderdag',
    'vrijdag',
    'zaterdag',
  ];
  const maanden = [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ];

  const dag = dagen[date.getDay()];
  const dagNummer = date.getDate();
  const maand = maanden[date.getMonth()];

  return `${dag} ${dagNummer} ${maand}`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const getDateFnsLocale = (lang: string): Locale => {
  switch (lang) {
    case 'nl':
      return nl as unknown as Locale;
    default:
      return enUS as unknown as Locale;
  }
};

export const getPsFoodbookTokenCookieName = (): string => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'PsFoodbookTokenD';
    case 'test':
      return 'PsFoodbookTokenT';
    // case 'preprod':
    //   return 'PsFoodbookTokenST';
    case 'production':
      return 'PsFoodbookToken';
    default:
      return 'PsFoodbookToken';
  }
};

export const getPsReturnUrlCookieName = (): string => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'PSReturnUrlD';
    case 'test':
      return 'PSReturnUrlT';
    // case 'preprod':
    //   return 'PSReturnUrlST';
    case 'production':
      return 'PSReturnUrl';
    default:
      return 'PSReturnUrl';
  }
};

export const getTranslatedValue = (
  input: TranslationInput,
  locale: keyof typeof Culture,
  fallback: string = '',
): string => {
  if (!input) return fallback;

  if (Array.isArray(input)) {
    return input.find(x => x.culture === Culture[locale])?.value || fallback;
  }

  if ('translation' in input && Array.isArray(input.translation)) {
    return (
      input.translation.find(x => x.culture === Culture[locale])?.value ||
      input.value ||
      fallback
    );
  }

  if ('value' in input) {
    return input.value || fallback;
  }

  return fallback;
};

export const parseId = (id: string): number => {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? -1 : parsed;
};

export const getHighResImageUrl = (url: string | undefined): string => {
  try {
    if (!url) {
      return '';
    }

    if (url.includes('?w=') && url.includes('&h=')) {
      return url.replace(/\?w=\d+&h=\d+/, '?w=800&h=800');
    }

    return url;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return url || '';
  }
};

export enum PackageTypeAbbreviation {
  CE = 'CE',
  HE = 'HE',
  OMDOOS = 'OMDOOS',
  PALLET = 'PALLET',
  DISPLAY = 'DISPLAY',
}

export function mapPackageTypeId(id: string): PackageTypeAbbreviation | null {
  if (!id) return null;

  switch (id) {
    case '1':
      return PackageTypeAbbreviation.CE;
    case '2':
      return PackageTypeAbbreviation.HE;
    case '3':
      return PackageTypeAbbreviation.OMDOOS;
    case '4':
      return PackageTypeAbbreviation.PALLET;
    case '5':
      return PackageTypeAbbreviation.DISPLAY;
    default:
      return null;
  }
}

const normalizeUrl = (url: string, isExternal: boolean = false): string => {
  if (isExternal) {
    return url;
  }

  const cleanUrl = url.replace(/\/+$/, '');

  if (cleanUrl.includes(`/${fallbackLng}/`)) {
    return cleanUrl.replace(`/${fallbackLng}/`, '/');
  }

  if (!cleanUrl) {
    return '/';
  }

  return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
};

export const getUrlFromPageLink = (pageLink: UmbracoLink): string => {
  if (!pageLink) {
    return '/';
  }

  if (pageLink.url) {
    return normalizeUrl(pageLink.url, pageLink.linkType === 'External');
  }

  if (!pageLink.route?.path) {
    return '/';
  }

  const normalizedPath = normalizeUrl(pageLink.route.path);

  if (pageLink.queryString) {
    return `${normalizedPath}${pageLink.queryString}`;
  }

  return normalizedPath;
};
