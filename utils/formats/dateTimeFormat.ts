import {Culture} from '@/types';
import {Locale} from 'date-fns';
import {enUS} from 'date-fns/locale/en-US';
import {nl} from 'date-fns/locale/nl';

export const formatShortDate = (
  inputDate: Date,
  locale: keyof typeof Culture,
) => {
  try {
    const dateObject =
      inputDate instanceof Date ? inputDate : new Date(inputDate);

    if (isNaN(dateObject.getTime())) {
      return String(inputDate);
    }

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObject);
  } catch (error) {
    console.error('Error formatting shortdate:', error);
    return String(inputDate);
  }
};

export const formatLongDate = (date: Date): string => {
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
