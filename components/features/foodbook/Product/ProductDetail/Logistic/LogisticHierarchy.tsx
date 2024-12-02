'use client';

import {Culture, Logisticinfo, Logisticinfolist} from '@/types';
import {getTranslatedValue} from '@/utils/helpers';
import Link from 'next/link';
import {FC, memo} from 'react';

const CLASSES = {
  list: {
    base: 'list-none m-0 mb-4 p-0',
    indented: 'ml-4',
  },
  link: 'hover:text-ps-blue-400 transition-all duration-300 ease-in-out block py-1',
} as const;

type LogisticHierarchyItemProps = {
  logisticinfo: Logisticinfo;
  locale: keyof typeof Culture;
  depth: number;
};

type LogisticHierarchyProps = {
  logisticinfolist: Logisticinfolist;
  locale: keyof typeof Culture;
  depth?: number;
};

const getContentString = (
  logisticinfo: Logisticinfo,
  locale: keyof typeof Culture,
): string => {
  const productTypeName = logisticinfo.packagedproducttypename?.value;
  if (!productTypeName) return '';

  const gtin = logisticinfo.gtin ? ` - ${logisticinfo.gtin}` : '';
  const name = logisticinfo.name
    ? ` - ${getTranslatedValue(logisticinfo.name, locale)}`
    : '';

  return `${productTypeName}${gtin}${name}`;
};

const LogisticHierarchyItem: FC<LogisticHierarchyItemProps> = memo(
  ({logisticinfo, locale, depth}) => {
    if (!logisticinfo || logisticinfo.packagedproducttypeid === '4')
      return null;

    const content = getContentString(logisticinfo, locale);
    if (!content) return null;

    return (
      <li>
        <Link
          className={CLASSES.link}
          href={`#PP${logisticinfo.id}`}
          style={{paddingLeft: `${depth * 1}rem`}}
        >
          {content}
        </Link>

        {logisticinfo.logisticinfolist && (
          <LogisticHierarchy
            logisticinfolist={logisticinfo.logisticinfolist}
            locale={locale}
            depth={depth + 1}
          />
        )}
      </li>
    );
  },
);

const LogisticHierarchy: FC<LogisticHierarchyProps> = memo(
  ({logisticinfolist, locale, depth = 0}) => {
    if (!logisticinfolist?.logisticinfo) return null;

    return (
      <ul
        className={`${CLASSES.list.base} ${depth > 0 ? CLASSES.list.indented : ''}`}
      >
        <LogisticHierarchyItem
          logisticinfo={logisticinfolist.logisticinfo}
          locale={locale}
          depth={depth}
        />
      </ul>
    );
  },
);

LogisticHierarchyItem.displayName = 'LogisticHierarchyItem';
LogisticHierarchy.displayName = 'LogisticHierarchy';

export default LogisticHierarchy;
