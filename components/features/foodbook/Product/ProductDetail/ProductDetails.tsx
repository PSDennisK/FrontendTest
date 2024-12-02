'use client';

import ProductSheetLink from '@/components/features/foodbook/Product/ProductDetail/ProductSheetLink';
import PSImpactScore from '@/components/features/foodbook/Product/ProductDetail/Scores/PSImpactScore';
import {Container, Section} from '@/components/ui/Layout';
import ModalForm from '@/components/ui/Modal';
import Form from '@/components/website/form';
import '@/node_modules/flag-icons/css/flag-icons.min.css';
import {foodbookService} from '@/services';
import {
  Brand,
  Culture,
  Logisticinfo,
  ProductClass,
  SearchProduct,
  Summary,
} from '@/types';
import {
  createSlug,
  getTranslatedValue,
  mapPackageTypeId,
} from '@/utils/helpers';
import Link from 'next/link';
import {FC, memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FaEnvelopeOpenText} from 'react-icons/fa6';
import 'tippy.js/dist/tippy.css';

const CLASSES = {
  section: 'mb-8 print:-mt-8',
  container: 'product-details relative w-full mt-10 lg:mt-0',
  header: 'flex flex-wrap items-center',
  brandLink:
    'text-sm md:text-xs font-bold uppercase inline-block pt-1 pb-[3px] mx-0.5 mb-2 hover:text-ps-blue-500',
  title: 'text-2xl font-semibold mb-4 print:text-lg',
  infoContainer: 'md:flex mb-6 border-b pb-4 items-top',
  infoSection: 'flex-1 mb-4 md:mb-0',
  infoItem: {
    container: 'flex-1 mb-4 md:mb-0 text-sm leading-5',
    label: 'block font-semibold',
  },
  button: `
  flex align-middle bg-ps-blue-400 text-white hover:bg-ps-blue-500 
  font-medium px-4 py-2 rounded items-center whitespace-nowrap 
  transition-all duration-300 ease-in-out transform
`,
  formButton: `
  inline-flex mb-2 md:mb-0 mt-4 bg-ps-green-500 text-white 
  border border-ps-green-500 text-md leading-6 rounded-md py-2 px-3 
  transition-all duration-300 ease-in-out transform 
  hover:bg-white hover:border hover:text-ps-green-500 disabled:cursor-not-allowed disabled:opacity-50
`,
} as const;

type GtinInfo = {
  gtin: string;
  packageType: string;
};

type InfoItemProps = {
  label: string | null;
  value?: string;
};

type ProductDetailsProps = {
  params: {
    locale: keyof typeof Culture;
  };
  productsummary: Summary;
  logisticInfo: Logisticinfo;
  isAuthenticated: boolean;
  mongoDbId: string;
  showSheetLink: boolean;
};

const extractGtins = (logisticinfo: Logisticinfo): GtinInfo[] => {
  const gtins: GtinInfo[] = [];

  const processLogisticInfo = (info: Logisticinfo) => {
    if (info.gtin) {
      gtins.push({
        gtin: info.gtin,
        packageType: mapPackageTypeId(info.packagedproducttypeid),
      });
    }

    if (info.logisticinfolist?.logisticinfo) {
      const nestedInfo = info.logisticinfolist.logisticinfo;
      if (Array.isArray(nestedInfo)) {
        nestedInfo.forEach(processLogisticInfo);
      } else {
        processLogisticInfo(nestedInfo);
      }
    }
  };

  if (logisticinfo) {
    Array.isArray(logisticinfo)
      ? logisticinfo.forEach(processLogisticInfo)
      : processLogisticInfo(logisticinfo);
  }

  return gtins;
};

const InfoItem: FC<InfoItemProps> = memo(({label, value}) => {
  if (!value) return null;

  return (
    <p className={CLASSES.infoItem.container}>
      {label && <span className={CLASSES.infoItem.label}>{label}:</span>}
      {value}
    </p>
  );
});

const ProductDetails: FC<ProductDetailsProps> = memo(
  ({
    params,
    productsummary,
    logisticInfo,
    isAuthenticated,
    mongoDbId,
    showSheetLink,
  }) => {
    const {t} = useTranslation('common');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [brand, setBrand] = useState<Brand>(null);
    const [relatedProduct, setRelatedProduct] = useState<ProductClass>(null);
    const gtins = extractGtins(logisticInfo);
    const productName = getTranslatedValue(logisticInfo.name, params.locale);
    const isAskQuestionEnabled =
      process.env.NEXT_PUBLIC_ASK_QUESTION_ENABLED === 'true';

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    useEffect(() => {
      if (gtins.length > 0) {
        const fetchRelatedProduct = async () => {
          try {
            const searchResult = await foodbookService.fetchProductByEan(
              gtins[0].gtin,
            );
            if (searchResult?.products?.length > 0) {
              const otherProduct = searchResult.products.find(
                (product: SearchProduct) =>
                  product.id.toString() !== productsummary.id,
              );
              if (otherProduct) {
                const {product: relatedProduct} =
                  await foodbookService.fetchProductById(
                    otherProduct.id.toString(),
                  );
                setRelatedProduct(relatedProduct);
              }
            }
          } catch (error) {
            console.error('Failed to fetch related products:', error);
          }
        };

        fetchRelatedProduct();
      }
    }, [gtins, productsummary.id]);

    useEffect(() => {
      if (productsummary?.brandid) {
        const fetchbrand = async () => {
          try {
            const brand = await foodbookService.fetchBrandById(
              productsummary.brandid,
            );
            setBrand(brand);
          } catch (error) {
            console.error('Failed to fetch brand:', error);
          }
        };

        fetchbrand();
      }
    }, [productsummary?.brandid]);

    const BrandLink = productsummary?.brandname && (
      <Link
        itemProp="brand"
        href={`/${params.locale}/brand/${createSlug(
          productsummary.brandid,
          productsummary.brandname,
        )}`}
        className={CLASSES.brandLink}
        title={`${t('product.moreProductsFrom')} ${productsummary.brandname}`}
      >
        {productsummary.brandname}
      </Link>
    );

    return (
      <Section className={CLASSES.section}>
        <Container className={CLASSES.container}>
          <Container className={CLASSES.header}>
            {BrandLink}
            <ProductSheetLink
              showSheetLink={showSheetLink}
              isAuthenticated={isAuthenticated}
              productsummary={productsummary}
              params={params}
            />
          </Container>

          {isAskQuestionEnabled && (
            <Container className="hidden md:flex absolute -top-14 mt-6 mb-4 left-0 md:right-0 md:left-auto md:mt-1">
              <button
                className={CLASSES.button}
                onClick={handleOpenModal}
                title={t('producer.askQuestion')}
                aria-label={t('producer.askQuestion')}
              >
                {t('producer.askQuestion')}
                <FaEnvelopeOpenText className="ml-2" aria-hidden="true" />
              </button>
            </Container>
          )}

          {productsummary?.name?.value && (
            <h2 itemProp="name" className={CLASSES.title}>
              {productName}
            </h2>
          )}
        </Container>

        <Container className={CLASSES.infoContainer}>
          <Container className={CLASSES.infoSection}>
            {gtins.map((gtin, index) => (
              <InfoItem
                key={index}
                label={index === 0 ? t('product.ean') : null}
                value={`${gtin.gtin} ${gtin.packageType}`}
              />
            ))}
          </Container>

          <InfoItem
            label={t('product.itemNumber')}
            value={logisticInfo?.number}
          />

          {productsummary?.targetmarketisocode && (
            <p className={CLASSES.infoItem.container}>
              <span className={CLASSES.infoItem.label}>{t('product.tm')}:</span>
              <span className="flex items-center gap-2">
                {productsummary?.targetmarketisocode}

                {relatedProduct && (
                  <>
                    <span className="">/</span>
                    <Link
                      key={relatedProduct.summary?.id}
                      href={`/${params.locale}/product/${createSlug(relatedProduct.summary?.id.toString(), relatedProduct.summary?.name?.value)}`}
                      title={t('product.switchToTM', {
                        tm: relatedProduct.summary?.targetmarketisocode,
                        interpolation: {escapeValue: false},
                      })}
                      className="text-ps-blue-400 hover:text-ps-blue-600 transition-colors duration-200"
                    >
                      {relatedProduct.summary?.targetmarketisocode}
                    </Link>
                  </>
                )}
              </span>
            </p>
          )}

          <PSImpactScore mongoDbId={mongoDbId} />

          {isAskQuestionEnabled && (
            <button
              className={`${CLASSES.button} md:hidden flex`}
              onClick={handleOpenModal}
              title={t('producer.askQuestion')}
              aria-label={t('producer.askQuestion')}
            >
              {t('producer.askQuestion')}
              <FaEnvelopeOpenText className="ml-2" aria-hidden="true" />
            </button>
          )}

          <ModalForm
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={t('producer.askQuestionProducer')}
            modalClass="max-w-3xl"
          >
            <Form
              params={{
                locale: params.locale,
                formid: process.env.NEXT_PUBLIC_ASK_QUESTION_FORMID,
              }}
              formHeaderText={t('producer.askQuestionDescription')}
              recipientEmail={brand?.email}
              brandName={brand?.name}
              productDescription={`${productName} / ${gtins[0]?.gtin}`}
              formButtonClass={CLASSES.formButton}
              thankYouClass="mb-6 mt-4 text-md font-semibold text-center"
            />
          </ModalForm>
        </Container>
      </Section>
    );
  },
);

InfoItem.displayName = 'InfoItem';
ProductDetails.displayName = 'ProductDetails';

export default ProductDetails;
