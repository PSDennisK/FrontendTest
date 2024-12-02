'use client';

import FallbackImage from '@/components/ui/Image/FallbackImage';
import {Container} from '@/components/ui/Layout';
import ModalAllergens from '@/components/ui/Modal/ModalAllergens';
import {Allergeninfo, ContainmentLevel, Culture} from '@/types';
import {getHighResImageUrl, getTranslatedValue} from '@/utils/helpers';
import Tippy from '@tippyjs/react';
import {FC, memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import 'tippy.js/dist/tippy.css';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  grid: 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:flex gap-2 text-center text-xs',
  card: {
    base: 'min-w-[90px] max-w-[90px]',
    disabled: 'excluded',
    imageContainer: 'py-2 min-h-[75px]',
    image: 'max-h-full max-w-full mx-auto object-contain',
    title: 'text-xs py-2',
  },
  tooltip: 'text-gray-700 text-center ml-2 text-xs',
} as const;

const ALLERGEN_IDS = [
  {id: '5', sequence: 1},
  {id: '12', sequence: 2},
  {id: '3', sequence: 3},
  {id: '11', sequence: 4},
  {id: '17', sequence: 5},
  {id: '4', sequence: 6},
  {id: '1', sequence: 7},
  {id: '16', sequence: 8},
  {id: '21', sequence: 9},
  {id: '24', sequence: 10},
  {id: '22', sequence: 11},
  {id: '19', sequence: 12},
  {id: '23', sequence: 13},
  {id: '26', sequence: 14},
] as const;

type AllergenInfoCardProps = {
  allergen: Allergeninfo | null;
  locale: keyof typeof Culture;
  isDisabled: boolean;
};

const AllergenInfoCard: FC<AllergenInfoCardProps> = memo(
  ({allergen, locale, isDisabled}) => {
    const {t} = useTranslation('common');

    const allergenInfo = useMemo(() => {
      if (!allergen) return null;

      const title =
        getTranslatedValue(
          allergen.translation,
          locale,
          allergen.name?.value,
        ) || '';

      const levelOfContainment = allergen.levelofcontainmentname?.value || '';
      const imageUrl = `${process.env.NEXT_PUBLIC_CDN_IMAGE_URL}/productsheet/allergenen/${allergen.id}.png`;

      return {
        title: title,
        levelOfContainmentTitle: t(
          `product.allergen.${levelOfContainment.toLowerCase()}`,
        ),
        levelOfContainment,
        imageUrl,
        id: allergen.id,
      };
    }, [allergen, locale, t]);

    if (!allergenInfo) return null;

    const tooltipText = `${allergenInfo.levelOfContainmentTitle}: ${allergenInfo.title}`;

    return (
      <Container
        className={`${CLASSES.card.base} ${isDisabled ? CLASSES.card.disabled : ''}`}
      >
        <Tippy
          className={CLASSES.tooltip}
          animation="scale"
          placement="top"
          content={tooltipText}
        >
          <div className={CLASSES.card.imageContainer}>
            <FallbackImage
              id={`${allergenInfo.id}-${allergenInfo.levelOfContainment}`}
              className={CLASSES.card.image}
              src={getHighResImageUrl(allergenInfo.imageUrl)}
              alt={`Logo ${tooltipText}`}
              width={54}
              height={54}
            />
          </div>
        </Tippy>
        <Container className={CLASSES.card.title}>
          {allergenInfo.title}
        </Container>
      </Container>
    );
  },
);

type AllergensProps = {
  allergens: Allergeninfo[];
  locale: keyof typeof Culture;
};

const Allergens: FC<AllergensProps> = memo(({allergens, locale}) => {
  const filteredAllergens = useMemo(() => {
    if (!allergens) return [];

    return ALLERGEN_IDS.map(({id}) => {
      const allergen = allergens.find(a => a.id === id);
      if (!allergen) return null;

      const isGrayscale = ![
        ContainmentLevel.Contains,
        ContainmentLevel.MayContain,
      ].includes(
        allergen.levelofcontainmentname.value.toLowerCase() as ContainmentLevel,
      );

      return {...allergen, isGrayscale};
    }).filter(
      (allergen): allergen is Allergeninfo & {isGrayscale: boolean} =>
        allergen !== null,
    );
  }, [allergens]);

  if (filteredAllergens.length === 0) return null;

  return (
    <Container id="allergens" className={CLASSES.container}>
      <ModalAllergens allergens={allergens} locale={locale} />
      <Container className={CLASSES.grid}>
        {filteredAllergens.map(allergen => (
          <AllergenInfoCard
            key={allergen.id}
            allergen={allergen}
            locale={locale}
            isDisabled={allergen.isGrayscale}
          />
        ))}
      </Container>
    </Container>
  );
});

AllergenInfoCard.displayName = 'AllergenInfoCard';
Allergens.displayName = 'Allergens';

export default Allergens;
