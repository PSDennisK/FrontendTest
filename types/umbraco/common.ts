import {
  Form,
  UmbracoContent,
  UmbracoImage,
  UmbracoLink,
  UmbracoText,
} from '@/types';

export type Cultures = {
  'en-US': Route;
  nl: Route;
  de: Route;
  fr: Route;
};

export type LocaleTypes = {
  en: 'en-US';
  nl: 'nl';
  fr: 'fr';
  de: 'de';
};

export enum PricingTableElement {
  Premium = '#Premium',
  PremiumPlus = '#PremiumPlus',
  Standard = '#Standard',
}

export type Route = {
  path: string;
  startItem: StartItem;
};

export type SiteProps = {
  site_name: string;
  site_description: string;
  site_domain: string;
  authors: {
    name: string;
    url: string;
  }[];
  default_image: string;
  google_analytics_id: string;
};

export type StartItem = {
  id: string;
  path: string;
};

export type Umbraco = {
  contentType: string;
  name: string;
  createDate: Date;
  updateDate: Date;
  route: Route;
  id: string;
  properties: UmbracoProperties;
  cultures: Cultures;
  visible: boolean;
};

export type UmbracoProperties = {
  seoMetaDescription: string;
  keywords: string;
  umbracoNavihide: boolean;
  targetGroups: UmbracoContent;
  contentBlocks: UmbracoContent;
  quotes: UmbracoContent;
  pageTitle: string;
  bodyText: UmbracoText;
  pageImage: UmbracoImage[];
  pageLinks: UmbracoLink[];
  pageLink: UmbracoLink;
  footerCtaBackground: UmbracoImage[];
  footerCtaImage: UmbracoImage[];
  greenTitle: string;
  greenText: UmbracoText;
  footerCtaTitle: string;
  footerCtaSubtitle: string;
  footerCtaText: UmbracoText;
  footerCtaButtonLink: UmbracoLink[];
  footerBlocks?: UmbracoContent;
  footerLinks: UmbracoLink[];
  footerScripts: string;
  showAppStoreButtons: boolean;
  counterItems: UmbracoContent;
  greenBlockHeader: string;
  greenBlockText: UmbracoText;
  heroHeader: string;
  heroDescription: UmbracoText;
  heroMedia: UmbracoImage[];
  heroCtalink: UmbracoLink[];
  employeesTitle: string;
  employees: UmbracoContent;
  photo: UmbracoImage[];
  fullName: string;
  function: string;
  email: string;
  phone: string;
  contactPhrase: string;
  contactInfo: UmbracoText;
  form: Form;
  registerForm: Form;
  faqCategory: string;
  faqQuestion: string;
  faqAnswer: UmbracoText;
  faqHide: boolean;
  priceStandard: string;
  pricePremium: string;
  pricePremiumplus: string;
  pricingTable: UmbracoContent;
  pricingFooterText: UmbracoText;
  pricingRegisterLink: UmbracoLink[];
  hTML: UmbracoText;
};

export type UmbracoItems = {
  total: number;
  items: Umbraco[];
};
