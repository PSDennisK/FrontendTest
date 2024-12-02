import {Container} from '@/components/ui/Layout';

import {
  Allergeninfo,
  ContainmentLevel,
  Culture,
  tabbedAllergens,
} from '@/types';
import {getTranslationValue} from '@/utils/helpers';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  FaCircleInfo,
  FaMinus,
  FaPlus,
  FaPlusMinus,
  FaRegCircle,
} from 'react-icons/fa6';

// Types
type ModalAllergensProps = {
  allergens: Allergeninfo[];
  locale: keyof typeof Culture;
};

// Styles
const STYLES = {
  modal: {
    overlay: 'opacity-25 fixed inset-0 z-40 bg-black',
    container:
      'justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none',
    content: 'relative w-full my-6 mx-auto max-w-3xl',
    inner:
      'border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none',
  },
  table: {
    row: 'border-b odd:bg-white even:bg-gray-50',
    headerCell: 'text-center text-gray-500 px-2 py-1',
    cell: 'w-[25%] p-2',
    iconCell: 'w-[8%] text-center',
  },
} as const;

const ALLERGEN_ICONS = [
  {id: 'plus', icon: <FaPlus key="plus" className="text-red-500" size={12} />},
  {
    id: 'plusMinus',
    icon: <FaPlusMinus key="plusMinus" className="text-red-500" size={12} />,
  },
  {id: 'minus', icon: <FaMinus key="minus" size={12} />},
  {id: 'circle', icon: <FaRegCircle key="circle" size={10} />},
] as const;

const ALLERGEN_TYPES = [
  'with',
  'mayContainSpores',
  'without',
  'notSupplied',
] as const;

const AllergenIcon = ({level}: {level: string}) => {
  const iconProps = {
    size: level === ContainmentLevel.NotSupplied ? 10 : 12,
    title: level,
  };

  switch (level.toLowerCase()) {
    case ContainmentLevel.Contains:
      return <FaPlus className="text-red-500" {...iconProps} />;
    case ContainmentLevel.MayContain:
      return <FaPlusMinus className="text-red-500" {...iconProps} />;
    case ContainmentLevel.Without:
      return <FaMinus {...iconProps} />;
    case ContainmentLevel.NotSupplied:
      return <FaRegCircle {...iconProps} />;
    default:
      return null;
  }
};

const AllergenLegend = ({t}: {t: (key: string) => string}) => (
  <table className="w-full mb-6 text-xs">
    <thead>
      <tr className="border-b bg-gray-50 dark:bg-gray-700">
        {ALLERGEN_TYPES.map(key => (
          <th key={key} className={STYLES.table.headerCell}>
            {t(`product.allergen.${key}`)}
          </th>
        ))}
      </tr>
      <tr className="border-b">
        {ALLERGEN_ICONS.map(({id, icon}) => (
          <th key={id} className="p-2">
            <span className="mx-auto flex justify-center">{icon}</span>
          </th>
        ))}
      </tr>
    </thead>
  </table>
);

const AllergenTable = ({
  allergens,
  locale,
  columnLength,
}: {
  allergens: Allergeninfo[];
  locale: keyof typeof Culture;
  columnLength: number;
}) => (
  <table className="w-full text-xs">
    <tbody>
      {[...Array(columnLength)].map((_, rowIndex) => (
        <tr key={rowIndex} className={STYLES.table.row}>
          {[0, 1, 2].map(colIndex => {
            const allergen = allergens[rowIndex + colIndex * columnLength];

            if (!allergen) {
              return (
                <React.Fragment key={`empty-${colIndex}-${rowIndex}`}>
                  <td className={STYLES.table.cell}></td>
                  <td className={STYLES.table.iconCell}></td>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={allergen.id}>
                <td
                  className={`${STYLES.table.cell} ${tabbedAllergens.includes(allergen.id) ? 'pl-8' : ''}`}
                >
                  {getTranslationValue(allergen, locale)}
                </td>
                <td className={STYLES.table.iconCell}>
                  <AllergenIcon level={allergen.levelofcontainmentname.value} />
                </td>
              </React.Fragment>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

const ModalAllergens: React.FC<ModalAllergensProps> = ({allergens, locale}) => {
  const {t} = useTranslation('common');
  const [showModal, setShowModal] = React.useState(false);

  if (!allergens?.length) return null;

  const sortedAllergens = [...allergens].sort(
    (a, b) => a.sequence - b.sequence,
  );
  const columnLength = Math.ceil(sortedAllergens.length / 3);

  return (
    <>
      <h2 className="flex text-xl font-semibold leading-6 mb-4">
        {t('product.allergens')}
        <FaCircleInfo
          className="w-4 h-4 ml-1 cursor-pointer text-gray-400 hover:text-ps-blue-400"
          onClick={() => setShowModal(true)}
        />
      </h2>

      {showModal && (
        <>
          <Container className={STYLES.modal.container}>
            <Container className={STYLES.modal.content}>
              <Container className={STYLES.modal.inner}>
                <Container className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-xl font-semibold">
                    {t('product.allergens')}
                  </h3>
                </Container>

                <Container className="relative py-2 px-5 flex-auto">
                  <AllergenLegend t={t} />
                  <AllergenTable
                    allergens={sortedAllergens}
                    locale={locale}
                    columnLength={columnLength}
                  />
                </Container>

                <Container className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-ps-blue-400 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => setShowModal(false)}
                  >
                    {t('common.close')}
                  </button>
                </Container>
              </Container>
            </Container>
          </Container>
          <div className={STYLES.modal.overlay} />
        </>
      )}
    </>
  );
};

export default ModalAllergens;
