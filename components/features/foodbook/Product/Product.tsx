import Disclaimer from '@/components/common/layout/Footer/Disclaimer';
import Allergens from '@/components/features/foodbook/Product/ProductDetail/Allergens/Allergens';
import BulletPoints from '@/components/features/foodbook/Product/ProductDetail/BulletPoints';
import ContactDetails from '@/components/features/foodbook/Product/ProductDetail/ContactDetails';
import ImageSlider from '@/components/features/foodbook/Product/ProductDetail/ImageSlider';
import FishIngredients from '@/components/features/foodbook/Product/ProductDetail/Ingredients/FishIngredients';
import Ingredients from '@/components/features/foodbook/Product/ProductDetail/Ingredients/Ingredients';
import Nutrients from '@/components/features/foodbook/Product/ProductDetail/Nutrients';
import Preparation from '@/components/features/foodbook/Product/ProductDetail/Preparation';
import ProductDescription from '@/components/features/foodbook/Product/ProductDetail/ProductDescription';
import ProductDetails from '@/components/features/foodbook/Product/ProductDetail/ProductDetails';
import ProductShortDescription from '@/components/features/foodbook/Product/ProductDetail/ProductShortDescription';
import Qualitymarks from '@/components/features/foodbook/Product/ProductDetail/Quality/Qualitymarks';
import StorageConditionLogos from '@/components/features/foodbook/Product/ProductDetail/StorageCondition/StorageConditionLogos';
import Vitamins from '@/components/features/foodbook/Product/ProductDetail/Vitamins';
import ImagePreloader from '@/components/ui/Image/ImagePreloader';
import {Container, Section} from '@/components/ui/Layout';
import {getServerAuthStatus} from '@/lib/auth/server';
import {Assetinfo, Culture, ProductClass} from '@/types';
import React from 'react';

interface ProductViewProps {
  params: {
    slug: string;
    locale: keyof typeof Culture;
  };
  product: ProductClass;
}

interface AssetGroup {
  thumbnails: Assetinfo[];
  documents: Assetinfo[];
  videos: Assetinfo[];
}

const ASSET_TYPES = {
  THUMBNAIL: '1',
  DOCUMENT: '2',
  VIDEO: '3',
} as const;

const getAssetsByType = (
  assetInfo: Assetinfo[] | undefined,
  type: string,
): Assetinfo[] => {
  if (!assetInfo?.length) return [];
  return assetInfo.filter(asset => asset.typeid === type);
};

const getAssetGroups = (assetInfo: Assetinfo[] | undefined): AssetGroup => ({
  thumbnails: getAssetsByType(assetInfo, ASSET_TYPES.THUMBNAIL),
  documents: getAssetsByType(assetInfo, ASSET_TYPES.DOCUMENT),
  videos: getAssetsByType(assetInfo, ASSET_TYPES.VIDEO),
});

const ProductView: React.FC<ProductViewProps> = async ({params, product}) => {
  const {isAuthenticated} = await getServerAuthStatus();

  const {
    summary: productSummary,
    logisticinfolist,
    specificationinfolist,
    commercialinfolist,
    productinfolist,
    mongoDbId,
  } = product;

  const logisticInfo = logisticinfolist?.logisticinfo;
  const specificationInfo = specificationinfolist?.specificationinfo;
  const commercialInfo = commercialinfolist?.commercialinfo;
  const productInfo = productinfolist?.productinfo;

  const {
    nutrientset: nutrientSet,
    ingredientset,
    allergenset,
    preparationinformationset,
  } = specificationInfo || {};

  const {thumbnails, videos} = getAssetGroups(
    logisticInfo?.assetinfolist?.assetinfo,
  );

  return (
    <Container
      className="flex flex-wrap w-full"
      itemType="https://schema.org/Product"
    >
      <ImagePreloader thumbnails={thumbnails} productSummary={productSummary} />

      <ImageSlider
        thumbnails={thumbnails}
        videos={videos}
        productsummary={productSummary}
      />

      <Section className="w-full md:flex-1">
        <ProductDetails
          params={params}
          productsummary={productSummary}
          logisticInfo={logisticInfo}
          isAuthenticated={isAuthenticated}
          mongoDbId={mongoDbId}
          showSheetLink={true}
        />

        <ProductShortDescription
          description={commercialInfo?.description}
          locale={params.locale}
        />

        <BulletPoints product={product} locale={params.locale} />

        <StorageConditionLogos
          storageconditionset={logisticInfo?.storageconditionset}
          locale={params.locale}
        />

        <ProductDescription description={commercialInfo?.commercialstorytext} />
      </Section>

      <Container className="w-full xl:px-2 py-8 lg:py-14 xl:py-16 sm:px-0">
        <Ingredients
          ingredientset={ingredientset}
          locale={params.locale}
          showIngredientTreeTable={false}
        />

        <FishIngredients
          fishingredientinfos={
            productInfo?.fishingredientinfolist?.fishingredientinfo
          }
          locale={params.locale}
        />

        <Allergens
          allergens={allergenset?.allergens?.allergeninfo}
          locale={params.locale}
        />

        <Container className="w-full md:flex md:gap-8">
          <Container className="w-full md:w-2/3">
            <Nutrients
              nutrientinfolist={nutrientSet?.nutrientinfolist}
              nutrientComment={nutrientSet?.nutrientcomment?.value}
              dailyValueIntakeTeferenceComment={
                nutrientSet?.dailyvalueintakereferencecomment?.value
              }
              locale={params.locale}
            />

            <Vitamins
              nutrientinfolist={nutrientSet?.nutrientinfolist}
              locale={params.locale}
            />
          </Container>

          <Container className="w-full md:w-1/3">
            <Qualitymarks
              qualitymarks={productInfo?.qualitymarkinfolist?.qualitymarkinfo}
            />
          </Container>
        </Container>

        <Preparation
          preparationInformationInfo={
            preparationinformationset?.preparationinformationinfolist
              .preparationinformationinfo
          }
        />

        <ContactDetails contact={logisticInfo?.labelcontact} />

        <Disclaimer locale={params.locale} />
      </Container>
    </Container>
  );
};

export default React.memo(ProductView);
