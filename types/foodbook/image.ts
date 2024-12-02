export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type FallBackImage = {
  id?: string;
  src: string;
  alt: string;
  title?: string;
  className?: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'empty' | 'blur';
  onLoad?: () => void;
  onError?: () => void;
  itemProp?: string;
};

export type Resolutionimage = {
  pixelheight: string;
  pixelwidth: string;
  downloadurl: string;
};

export type ProductImageProps = {
  id: number;
  image: string;
  name: string;
  className?: string;
};
