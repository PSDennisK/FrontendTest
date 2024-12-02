import {Brand, DigitalCatalogi} from '@/types';

export type Producer = {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  image: string;
  brands: Brand[];
  digitalCatalogi: DigitalCatalogi[];
};
