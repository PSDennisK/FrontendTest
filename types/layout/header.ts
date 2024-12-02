import {Culture} from '@/types';

export type LayoutProps = {
  children: React.ReactNode;
  className?: string;
  locale: keyof typeof Culture;
};

export type HeaderProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export type NavProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};
