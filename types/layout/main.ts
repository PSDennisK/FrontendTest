export type MainProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export type AsideProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  itemType?: string;
  style?: React.CSSProperties;
};

export type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tabIndex?: number;
  itemType?: string;
  itemProp?: string;
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
  role?: string;
};

export type ArticleProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  itemType?: string;
  onClick?: React.MouseEventHandler;
};
