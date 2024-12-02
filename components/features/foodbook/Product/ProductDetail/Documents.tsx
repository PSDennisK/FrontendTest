'use client';

import {Container} from '@/components/ui/Layout';
import {Assetinfo} from '@/types';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {FaFile} from 'react-icons/fa6';

const CLASSES = {
  container: 'mr-6',
  content: 'mx-auto relative mb-8 lg:mb-10 xl:mb-12',
  title: 'flex text-xl font-semibold leading-6 mb-4',
  titleIcon: 'ml-2',
  list: 'space-y-2',
  listItem: 'flex items-center space-x-2',
  link: 'link inline-flex items-center hover:underline',
} as const;

type DocumentLinkProps = {
  document: Assetinfo;
  t: (key: string) => string;
};

type DocumentsProps = {
  documents: Assetinfo[];
};

const DocumentLink: FC<DocumentLinkProps> = memo(({document, t}) => (
  <li className={CLASSES.listItem}>
    <a
      href={document.downloadurl}
      target="_blank"
      rel="noopener noreferrer"
      className={CLASSES.link}
      download
    >
      <span>{document.title?.value || t('product.untitledDocument')}</span>
    </a>
  </li>
));

const Documents: FC<DocumentsProps> = memo(({documents}) => {
  const {t} = useTranslation('common');

  if (!documents?.length) return null;

  return (
    <Container id="documents" className={CLASSES.container}>
      <Container className={CLASSES.content}>
        <h2 className={CLASSES.title}>
          {t('product.documents')}
          <FaFile className={CLASSES.titleIcon} aria-hidden="true" />
        </h2>

        <ul className={CLASSES.list}>
          {documents.map(document => (
            <DocumentLink key={document.id} document={document} t={t} />
          ))}
        </ul>
      </Container>
    </Container>
  );
});

DocumentLink.displayName = 'DocumentLink';
Documents.displayName = 'Documents';

export default Documents;
