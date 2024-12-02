import {ReactElement} from 'react';

export type Brand = {
  id: number[];
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  producerId: number;
  producerName: string;
  isprivatelabel: string;
  brandownerid: string;
  brandownername: string;
  brandownergln: string;
  image: string;
  numberOfProducts: number;
  products: any[];
};

export type SimplifiedBrand = {
  id: number;
  name: string;
};

export type ContactItem = {
  value: string;
  icon: ReactElement;
  href: string;
  itemProp: 'telephone' | 'email' | 'url';
  label: string;
};
