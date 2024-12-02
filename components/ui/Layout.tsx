import GoogleTagManager from '@/components/GoogleTagManager';
import {fallbackLng} from '@/i18n';
import {
  ArticleProps,
  AsideProps,
  ContainerProps,
  FooterProps,
  HeaderProps,
  LayoutProps,
  MainProps,
  NavProps,
  SectionProps,
} from '@/types';
import {dir} from 'i18next';
import {forwardRef} from 'react';

const Layout = ({children, className, locale = fallbackLng}: LayoutProps) => {
  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className="text-ps-darkgray"
      suppressHydrationWarning
    >
      <body className={`${className}`}>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        {children}
      </body>
    </html>
  );
};

const Header = ({children, className, id}: HeaderProps) => {
  return (
    <header className={className} id={id}>
      {children}
    </header>
  );
};

const Nav = ({children, className, id}: NavProps) => {
  return (
    <nav className={className} id={id}>
      {children}
    </nav>
  );
};

const Main = ({children, className, id}: MainProps) => {
  return (
    <main className={className} id={id}>
      {children}
    </main>
  );
};

const Aside = ({children, className, id}: AsideProps) => {
  return (
    <aside className={className} id={id}>
      {children}
    </aside>
  );
};

const Section = ({children, className, id, itemType, style}: SectionProps) => {
  return (
    <section
      className={className}
      id={id}
      {...(itemType && {itemScope: true, itemType})}
      style={style}
    >
      {children}
    </section>
  );
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      className,
      id,
      tabIndex,
      itemType,
      itemProp,
      onClick,
      style,
      role,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={className}
        id={id}
        tabIndex={tabIndex}
        {...(itemType && {itemScope: true, itemType})}
        itemProp={itemProp}
        onClick={onClick}
        style={style}
        ref={ref}
        role={role}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// Add display name to Container component
Container.displayName = 'Container';

const Article = ({
  children,
  className,
  id,
  itemType,
  onClick,
}: ArticleProps) => {
  return (
    <article
      className={className}
      id={id}
      {...(itemType && {itemScope: true, itemType})}
      onClick={onClick}
    >
      {children}
    </article>
  );
};

const Footer = ({children, className, id}: FooterProps) => {
  return (
    <footer className={className} id={id}>
      {children}
    </footer>
  );
};

export {Article, Aside, Container, Footer, Header, Layout, Main, Nav, Section};
