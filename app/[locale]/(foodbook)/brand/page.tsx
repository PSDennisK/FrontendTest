import {Container} from '@/components/ui/Layout';

import FallbackImage from '@/components/ui/Image/FallbackImage';
import {foodbook} from '@/foodbook.config';
import {createTranslation} from '@/i18n/server';
import {foodbookService} from '@/services';
import {Brand, Culture} from '@/types';
import {createSlug, getHighResImageUrl} from '@/utils/helpers';
import Link from 'next/link';

export async function generateMetadata({
  params: {locale},
}: {
  params: {locale: keyof typeof Culture};
}) {
  const t = await createTranslation(locale, 'common');

  return {
    title: `${t('search.brands')} | ${foodbook.site_name}`,
  };
}

const BrandsPage = async ({
  params: {locale},
}: {
  params: {locale: keyof typeof Culture};
}) => {
  const brands: Brand[] = await foodbookService.fetchBrands();

  return (
    <>
      {/* <SidebarView /> */}

      <Container className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
        {brands?.map((brand: Brand, index) => (
          <Link
            key={brand?.id.toString()}
            href={`/${locale}/brand/${createSlug(
              brand?.id.toString(),
              brand?.name.trim(),
            )}`}
            className="group product-card"
          >
            <Container className="relative shrink-0">
              <Container className="flex justify-center items-center overflow-hidden mx-auto w-[160px] h-[160px] md:w-[180px] md:h-[180px] transition duration-200 ease-in-out transform group-hover:scale-105 relative">
                <FallbackImage
                  id={brand?.name.trim()}
                  src={getHighResImageUrl(brand?.image)}
                  alt={`Logo ${brand?.name.trim()}`}
                  width={160}
                  height={160}
                  className="w-auto h-auto"
                  loading="lazy"
                />
              </Container>
            </Container>
            <Container className="flex flex-col px-3 md:px-4 lg:px-[18px] pb-5 lg:pb-6 lg:pt-3 h-full">
              <Container className="mb-1 lg:mb-1.5 -mx-1">
                <span className="inline-block mx-1 text-sm font-semibold sm:text-15px lg:text-base">
                  {brand?.name.trim()}
                </span>
              </Container>
            </Container>
          </Link>
        ))}
      </Container>
    </>
  );
};

export default BrandsPage;
