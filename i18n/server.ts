import {getOptions, LocaleTypes} from '@/i18n';
import {createInstance} from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import {initReactI18next} from 'react-i18next/initReactI18next';

const initI18next = async (lang: LocaleTypes, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: typeof ns) =>
          import(`./locales/${language}/${namespace}.json`),
      ),
    )
    .init(getOptions(lang, ns));

  return i18nInstance;
};

// export async function createTranslation(lang: LocaleTypes, ns: string) {
//   const i18nextInstance = await initI18next(lang, ns);

//   return {
//     t: i18nextInstance.getFixedT(lang, Array.isArray(ns) ? ns[0] : ns),
//   };
// }

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
          import(`./locales/${language}/${namespace}.json`),
      ),
    )
    .init(getOptions(lang, ns));

  return i18nInstance.t;
};
