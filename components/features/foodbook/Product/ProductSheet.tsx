import ProductNotFound from '@/app/[locale]/product-not-found';
import ProductComponents from '@/components/features/foodbook/Product/ProductComponents';
import {Container, Section} from '@/components/ui/Layout';
import {createTranslation} from '@/i18n';
import {getServerAuthStatus} from '@/lib/auth/server';
import {
  Assetinfo,
  Characteristicinfo,
  Commercialinfo,
  Culture,
  Ingredientset,
  Logisticinfo,
  Nutrientset,
  ProductClass,
  Productinfo,
  Specificationinfo,
  Summary,
} from '@/types';
import {redirect} from 'next/navigation';

interface ProductSheetViewProps {
  params: {
    slug: string;
    locale: keyof typeof Culture;
  };
  product: ProductClass;
}

interface ProductData {
  summary: Summary;
  logisticInfo: Logisticinfo;
  specificationInfo: Specificationinfo;
  nutrientSet: Nutrientset;
  ingredientset: Ingredientset;
  commercialInfo: Commercialinfo;
  productInfo: Productinfo;
  characteristics: Characteristicinfo[];
  assets: {
    thumbnails: Assetinfo[];
    documents: Assetinfo[];
    videos: Assetinfo[];
    links: Assetinfo[];
  };
}

const ASSET_TYPES = {
  THUMBNAIL: '1',
  DOCUMENT: '2',
  VIDEO: '3',
  LINK: '4',
} as const;

type AssetType = (typeof ASSET_TYPES)[keyof typeof ASSET_TYPES];

const getAssetsByType = (
  assetInfo: Assetinfo[] = [],
  type: AssetType,
): Assetinfo[] => {
  if (!Array.isArray(assetInfo)) return [];
  return assetInfo.filter(x => x.typeid === type);
};

const extractProductInfo = (product: ProductClass): ProductData => {
  const {
    summary,
    logisticinfolist,
    specificationinfolist,
    commercialinfolist,
    productinfolist,
  } = product;

  const logisticInfo = logisticinfolist?.logisticinfo;
  const specificationInfo = specificationinfolist?.specificationinfo;
  const assetInfo = logisticInfo?.assetinfolist?.assetinfo;

  return {
    summary,
    logisticInfo,
    specificationInfo,
    nutrientSet: specificationInfo?.nutrientset,
    ingredientset: specificationInfo?.ingredientset,
    commercialInfo: commercialinfolist?.commercialinfo,
    productInfo: productinfolist?.productinfo,
    characteristics:
      productinfolist?.productinfo?.characteristicinfolist?.characteristicinfo,
    assets: {
      thumbnails: getAssetsByType(assetInfo, ASSET_TYPES.THUMBNAIL),
      documents: getAssetsByType(assetInfo, ASSET_TYPES.DOCUMENT),
      videos: getAssetsByType(assetInfo, ASSET_TYPES.VIDEO),
      links: getAssetsByType(assetInfo, ASSET_TYPES.LINK),
    },
  };
};

const ProductSheetView = async ({params, product}: ProductSheetViewProps) => {
  if (!product) {
    return <ProductNotFound />;
  }

  const authStatus = await getServerAuthStatus();
  if (!authStatus.isAuthenticated) {
    const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL;
    if (!loginUrl) {
      throw new Error('Login URL not configured');
    }
    redirect(loginUrl);
  }

  const productData = extractProductInfo(product);

  const t = await createTranslation(params.locale, 'common');

  return (
    <Container
      className="flex flex-wrap w-full"
      itemType="https://schema.org/Product"
    >
      <ProductComponents.ImageSection
        productsummary={productData.summary}
        thumbnails={productData.assets.thumbnails}
      />

      <Section className="flex-1">
        <ProductComponents.MainDetails
          params={params}
          product={product}
          productData={productData}
          isAuthenticated={authStatus.isAuthenticated}
          showSheetLink={false}
        />
      </Section>

      <div className="flex-basis h-0" aria-hidden="true" />

      <Container className="w-full xl:px-2 py-11 lg:py-14 xl:py-16 sm:px-0">
        <ProductComponents.DetailSection
          params={params}
          product={product}
          productData={productData}
        />
        <Container className="mt-6 text-xs">
          &copy; {new Date().getFullYear()} {t('common.psInFoodService')}.{' '}
          <span className="block sm:inline">
            {t('footer.allRightsReserved')}.
          </span>
        </Container>
      </Container>
    </Container>
  );
};

export {ProductSheetView, type ProductData, type ProductSheetViewProps};
