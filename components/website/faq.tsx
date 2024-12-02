'use client';

import {Container} from '@/components/ui/Layout';

import {useTranslation} from '@/i18n/client';
import {LocaleTypes} from '@/i18n/settings';
import {umbracoService} from '@/services';
import {Culture, Umbraco, UmbracoItems} from '@/types';
import {useParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {
  FaChevronDown,
  FaChevronRight,
  FaMagnifyingGlass,
  FaXmark,
} from 'react-icons/fa6';

type CollapsiblePanelProps = {
  title: string;
  children: string;
  initiallyExpanded?: boolean;
  visible: boolean;
};

const Faq = ({
  params,
}: {
  params: {slug: string; locale: keyof typeof Culture};
}) => {
  let locale = useParams()?.locale as LocaleTypes;
  const {t} = useTranslation(locale, 'website');

  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState<Umbraco[] | null>(null);
  const [categories, setCategories] = useState<string[] | null>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const faqs: UmbracoItems = await umbracoService.fetchChildrenBySlug(
        params.slug,
        params.locale,
        999,
      );
      setFaqs(faqs.items);

      const uniqueCategories = Array.from(
        new Set(faqs.items.map(item => item.properties.faqCategory)),
      );
      setCategories(uniqueCategories);
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      filterFAQItems(searchTerm);
      setIsSearching(true);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    resetFAQItems();
    setIsSearching(false);
  };

  const filterFAQItems = (term: string) => {
    const filteredItems = faqs.map(item => {
      const questionMatch = item.properties.faqQuestion
        .toLowerCase()
        .includes(term.toLowerCase());
      const answerMatch = item.properties.faqAnswer.markup
        .toLowerCase()
        .includes(term.toLowerCase());
      return {
        ...item,
        visible: (questionMatch || answerMatch) && !item.properties.faqHide,
      };
    });

    setFaqs(filteredItems);
  };

  const resetFAQItems = () => {
    const resetItems = faqs.map(item => ({
      ...item,
      visible: !item.properties.faqHide,
    }));
    setFaqs(resetItems);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
      <Container className="w-full">
        <Container className="mb-8 faqSearchForm">
          <h3 className="text-xl font-bold mb-2">{t('faq.searchTitle')}</h3>
          <Container className="relative flex items-stretch w-full input-group-lg">
            <input
              className="block appearance-none w-full h-14 py-1 px-4 mb-1 text-base leading-normal bg-slate-50 text-gray-800 border border-gray-200 focus:border-gray-400 focus:outline-gray-200 outline-1 rounded input-lg"
              id="keyword"
              name="keyword"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={t('faq.searchFor')}
              type="text"
              autoComplete="false"
            />
            <span className="absolute flex right-0 h-full">
              <button
                className={`inline-block align-middle text-center select-none font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline btn-default btn-clear ${isSearching ? '' : 'hidden'}`}
                type="button"
                onClick={handleReset}
              >
                <FaXmark size={20} />
              </button>
              <button
                className="inline-block align-middle text-center select-none font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline btn-default"
                type="button"
                onClick={handleSearch}
              >
                <FaMagnifyingGlass size={20} />
              </button>
            </span>
          </Container>
        </Container>
      </Container>

      <Container className="space-y-6">
        {categories.map(category => {
          const categoryItems = faqs.filter(
            item =>
              item.properties.faqCategory === category &&
              item.visible !== false,
          );

          if (categoryItems.length === 0) return null;

          return (
            <Container key={category} className="category">
              <h2 className="text-xl font-bold mb-2">
                {t(`faqCategories.${category}`)}
              </h2>
              {categoryItems.map(item => (
                <FaqItem key={item?.id} faq={item} />
              ))}
            </Container>
          );
        })}
      </Container>
    </>
  );
};

const FaqItem = ({faq}: {faq: Umbraco}) => {
  return (
    <CollapsiblePanel title={faq.properties.faqQuestion} visible={faq.visible}>
      {faq.properties.faqAnswer.markup}
    </CollapsiblePanel>
  );
};

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  visible,
  children,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [height, setHeight] = useState<number | undefined>(
    initiallyExpanded ? undefined : 0,
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      const contentEl = contentRef.current;
      if (contentEl) {
        setHeight(contentEl.scrollHeight);
      }
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Container
      className={`mb-1 border border-gray-200 overflow-hidden faqitem ${visible !== false ? '' : 'hidden'}`}
    >
      <Container
        className="bg-gray-100 px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={togglePanel}
      >
        <h3 className="text-sm">{title}</h3>
        <Container className="text-gray-500 transition-transform duration-300 ease-in-out transform">
          {isExpanded ? (
            <FaChevronDown size={15} />
          ) : (
            <FaChevronRight size={15} />
          )}
        </Container>
      </Container>
      <Container
        className="transition-[max-height] duration-300 ease-in-out"
        style={{maxHeight: height}}
      >
        <div
          ref={contentRef}
          className="prose prose-sm hover:prose-a:text-ps-blue-400 px-4 py-3 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: children,
          }}
        ></div>
      </Container>
    </Container>
  );
};

export {Faq, FaqItem};
