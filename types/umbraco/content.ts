import {Form, PricingTableElement, Route} from '@/types';
import {ComponentType, SVGProps} from 'react';

export type UmbracoContent = {
  items: UmbracoContentItem[];
};

export type UmbracoContentItem = {
  content: UmbracoContentItemContent;
  settings: null;
};

export type UmbracoContentItemContent = {
  contentType: string;
  id: string;
  properties: UmbracoContentProperties;
};

export type UmbracoContentProperties = {
  blockTitle: string;
  blockSubtitle: string;
  blockContent: UmbracoText;
  blockButton: UmbracoLink[] | null;
  blockImage: UmbracoImage[];
  blockAlign: string;
  blockColor: string;
  footerBlockTitle: string;
  footerBlockText: UmbracoText | null;
  footerBlockLinks: UmbracoLink[] | null;
  footerBlockForm: Form;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  number: number;
  personName: string;
  personFunction: string;
  pricingActive: boolean;
  pricingTitle: string;
  pricingText: string;
  pricingTooltip: null | string;
  pricingTable: PricingTableElement[];
  quoteText: UmbracoText;
  quoteImage: UmbracoImage[];
  quoteVideoURL: UmbracoText;
  quoteAlign: string;
  targetGroupTitle: string;
  targetGroupContent: string;
  targetGroupBarColor: string;
  targetGroupLinks: UmbracoLink[];
  title: string;
};

export type UmbracoText = {
  markup: string;
  blocks: any[];
};

export type UmbracoImage = {
  focalPoint: null;
  crops: any[];
  id: string;
  name: string;
  mediaType: string;
  url: string;
  extension: string;
  width: number;
  height: number;
  bytes: number;
  properties: UmbracoImageProperties;
};

export type UmbracoImageProperties = {};

export type UmbracoLink = {
  url: null | string;
  queryString: null;
  title: string;
  target: null | string;
  destinationId: null | string;
  destinationType: null | string;
  route: Route | null;
  linkType: string;
};
