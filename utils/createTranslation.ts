import {getOptions} from '@/i18n/settings';
import {createInstance} from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import {initReactI18next} from 'react-i18next';

export const createTranslation = async (
  lang: string,
  ns: string,
  options: any = {},
) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/app/i18n/locales/${language}/${namespace}.json`),
      ),
    )
    .init(getOptions(lang, ns));

  return i18nInstance.t;
};
