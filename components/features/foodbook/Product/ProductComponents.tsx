import Disclaimer from '@/components/common/layout/Footer/Disclaimer';
import AllergenFull from '@/components/features/foodbook/Product/ProductDetail/Allergens/AllergenFull';
import BulletPoints from '@/components/features/foodbook/Product/ProductDetail/BulletPoints';
import Chemical from '@/components/features/foodbook/Product/ProductDetail/Chemical';
import ContactDetails from '@/components/features/foodbook/Product/ProductDetail/ContactDetails';
import CountryOfOrigin from '@/components/features/foodbook/Product/ProductDetail/CountryOfOrigin';
import Documents from '@/components/features/foodbook/Product/ProductDetail/Documents';
import FooterDetails from '@/components/features/foodbook/Product/ProductDetail/FooterDetails';
import ImageSlider from '@/components/features/foodbook/Product/ProductDetail/ImageSlider';
import FishIngredients from '@/components/features/foodbook/Product/ProductDetail/Ingredients/FishIngredients';
import Ingredients from '@/components/features/foodbook/Product/ProductDetail/Ingredients/Ingredients';
import Links from '@/components/features/foodbook/Product/ProductDetail/Links';
import LogisticDetails from '@/components/features/foodbook/Product/ProductDetail/Logistic/LogisticDetails';
import MainImage from '@/components/features/foodbook/Product/ProductDetail/MainImage';
import MicroBiologicalDetails from '@/components/features/foodbook/Product/ProductDetail/MicroBiologicalDetails';
import Nutrients from '@/components/features/foodbook/Product/ProductDetail/Nutrients';
import Packaging from '@/components/features/foodbook/Product/ProductDetail/Packaging';
import Preparation from '@/components/features/foodbook/Product/ProductDetail/Preparation';
import ProductDescription from '@/components/features/foodbook/Product/ProductDetail/ProductDescription';
import ProductDetails from '@/components/features/foodbook/Product/ProductDetail/ProductDetails';
import ProductShortDescription from '@/components/features/foodbook/Product/ProductDetail/ProductShortDescription';
import QualitymarksFull from '@/components/features/foodbook/Product/ProductDetail/Quality/QualitymarksFull';
import Sensoric from '@/components/features/foodbook/Product/ProductDetail/Sensoric';
import StorageConditionLogos from '@/components/features/foodbook/Product/ProductDetail/StorageCondition/StorageConditionLogos';
import StorageConditions from '@/components/features/foodbook/Product/ProductDetail/StorageCondition/StorageConditions';
import Vitamins from '@/components/features/foodbook/Product/ProductDetail/Vitamins';
import {Container} from '@/components/ui/Layout';
import {
  Assetinfo,
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
import React from 'react';

// Types
interface ProductData {
  summary: Summary;
  logisticInfo: Logisticinfo;
  commercialInfo: Commercialinfo;
  productInfo: Productinfo;
  specificationInfo: Specificationinfo;
  nutrientSet: Nutrientset;
  ingredientset: Ingredientset;
  assets: {
    documents: Assetinfo[];
    links: Assetinfo[];
  };
}

interface BaseProps {
  params: {
    locale: keyof typeof Culture;
  };
  productData: ProductData;
}

interface ImageSectionProps {
  productsummary: Summary;
  thumbnails: Assetinfo[];
}

interface MainDetailsProps extends BaseProps {
  product: ProductClass;
  isAuthenticated: boolean;
  showSheetLink: boolean;
}

interface DetailSectionProps extends BaseProps {
  product: ProductClass;
}

const createMemoizedComponent = <T extends object>(
  Component: React.FC<T>,
  name: string,
) => {
  Component.displayName = `${name}Base`;
  const MemoizedComponent = React.memo(Component);
  MemoizedComponent.displayName = `ProductComponents.${name}`;
  return MemoizedComponent;
};

const ProductComponents = {
  ImageSection: createMemoizedComponent<ImageSectionProps>(
    ({productsummary, thumbnails}) => (
      <>
        <MainImage productsummary={productsummary} />
        <ImageSlider thumbnails={thumbnails} productsummary={productsummary} />
      </>
    ),
    'ImageSection',
  ),

  MainDetails: createMemoizedComponent<MainDetailsProps>(
    ({params, product, productData, isAuthenticated, showSheetLink}) => (
      <>
        <ProductDetails
          params={params}
          productsummary={productData.summary}
          logisticInfo={productData.logisticInfo}
          mongoDbId={product?.mongoDbId}
          isAuthenticated={isAuthenticated}
          showSheetLink={showSheetLink}
        />
        <ProductShortDescription
          description={productData.commercialInfo?.description}
          locale={params.locale}
        />
        <BulletPoints product={product} locale={params.locale} />
        <StorageConditionLogos
          storageconditionset={productData.logisticInfo?.storageconditionset}
          locale={params.locale}
        />
      </>
    ),
    'MainDetails',
  ),

  DetailSection: createMemoizedComponent<DetailSectionProps>(
    ({params, product, productData}) => (
      <>
        <ProductDescription
          description={productData.commercialInfo?.commercialstorytext}
        />

        <Container className="flex flex-wrap print:hidden">
          <Documents documents={productData.assets.documents} />
          <Links links={productData.assets.links} />
        </Container>

        <CountryOfOrigin
          productinfo={productData.productInfo}
          commercialinfo={productData.commercialInfo}
          locale={params.locale}
        />

        <Ingredients
          ingredientset={productData.ingredientset}
          locale={params.locale}
          showIngredientTreeTable={true}
        />

        <FishIngredients
          fishingredientinfos={
            productData.productInfo?.fishingredientinfolist?.fishingredientinfo
          }
          locale={params.locale}
        />

        <AllergenFull
          allergens={
            productData.specificationInfo?.allergenset?.allergens?.allergeninfo
          }
          allergenComment={
            productData.specificationInfo?.allergenset?.allergencomment
          }
          locale={params.locale}
        />

        <Nutrients
          nutrientinfolist={productData.nutrientSet?.nutrientinfolist}
          nutrientComment={productData.nutrientSet?.nutrientcomment?.value}
          dailyValueIntakeTeferenceComment={
            productData.nutrientSet?.dailyvalueintakereferencecomment?.value
          }
          locale={params.locale}
        />

        <Vitamins
          nutrientinfolist={productData.nutrientSet?.nutrientinfolist}
          locale={params.locale}
        />

        <QualitymarksFull
          productinfo={productData.productInfo}
          locale={params.locale}
        />

        <Preparation
          preparationInformationInfo={
            productData.specificationInfo?.preparationinformationset
              ?.preparationinformationinfolist.preparationinformationinfo
          }
        />

        <Chemical
          chemicalinformationset={
            productData.specificationInfo?.physiochemicalcharacteristicset
          }
          locale={params.locale}
        />

        <Sensoric
          organolepticcharacteristicset={
            productData.specificationInfo?.organolepticcharacteristicset
          }
          locale={params.locale}
        />

        <StorageConditions
          storageconditionset={productData.logisticInfo?.storageconditionset}
          locale={params.locale}
        />

        <MicroBiologicalDetails
          microbiologicalsetinfo={
            productData.logisticInfo?.microbiologicalsetinfolist
              ?.microbiologicalsetinfo
          }
          locale={params.locale}
        />

        <LogisticDetails
          nonfood={productData.productInfo.isnonfood}
          logisticinfolist={product.logisticinfolist}
          locale={params.locale}
        />

        <Packaging
          logisticinfolist={product.logisticinfolist}
          locale={params.locale}
        />

        <ContactDetails contact={productData.logisticInfo?.labelcontact} />

        <FooterDetails summary={productData.summary} locale={params.locale} />

        <Disclaimer locale={params.locale} />
      </>
    ),
    'DetailSection',
  ),
};

export default ProductComponents;
