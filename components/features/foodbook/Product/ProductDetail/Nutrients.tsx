import {Container} from '@/components/ui/Layout';

import {createTranslation} from '@/i18n/server';
import {Culture, Nutrient, Nutrientinfolist, Translation} from '@/types';
import {getTranslationValue} from '@/utils/helpers';

type NutrientsProps = {
  nutrientinfolist: Nutrientinfolist;
  nutrientComment: string;
  dailyValueIntakeTeferenceComment: string;
  locale: keyof typeof Culture;
};

type NutrientsTableProps = {
  nutrientinfolist: Nutrientinfolist;
  nutrientComment?: string;
  dailyValueIntakeTeferenceComment?: string;
  locale: keyof typeof Culture;
};

type NutrientInfo = {
  id: string;
  name: string;
  translation: Translation[];
  parentid: string;
  product?: Nutrient;
  prepared?: Nutrient;
};

type DisplayInfo = {
  isActive: boolean;
  showHunderd: boolean;
  showGDA: boolean;
  showPortion: boolean;
};

const NutrientsTable: React.FC<NutrientsTableProps> = async ({
  nutrientinfolist,
  nutrientComment,
  dailyValueIntakeTeferenceComment,
  locale,
}) => {
  const t = await createTranslation(locale, 'common');

  if (!nutrientinfolist?.nutrientinfo) return null;

  const nutrientinfoFiltered = nutrientinfolist.nutrientinfo.filter(
    a => a?.id !== '99999',
  );
  const product = nutrientinfoFiltered.find(
    s => s?.stateofpreparationid === '2',
  );
  const prepared = nutrientinfoFiltered.find(
    s => s?.stateofpreparationid === '1',
  );

  if (!product && !prepared) return null;

  const nutrientInfo: NutrientInfo[] = [];
  const prod: DisplayInfo = {
    isActive: false,
    showHunderd: false,
    showGDA: false,
    showPortion: false,
  };
  const prep: DisplayInfo = {
    isActive: false,
    showHunderd: false,
    showGDA: false,
    showPortion: false,
  };

  const processNutrients = (
    info: typeof product | typeof prepared,
    displayInfo: DisplayInfo,
  ) => {
    if (info && info.nutrients?.nutrient?.length > 0) {
      displayInfo.isActive = true;
      displayInfo.showHunderd = info.nutrients?.nutrient?.some(
        a => a.value !== undefined,
      );
      displayInfo.showGDA = info.nutrients?.nutrient?.some(
        a => a.guidelinedailyamount !== undefined,
      );
      displayInfo.showPortion = info.nutrients?.nutrient?.some(
        a => a.valueperserving !== undefined,
      );

      info.nutrients.nutrient.forEach(a => {
        const existingNutrient = nutrientInfo.find(n => n.id === a.id);
        if (existingNutrient) {
          existingNutrient[
            info.stateofpreparationid === '2' ? 'product' : 'prepared'
          ] = a;
        } else {
          nutrientInfo.push({
            id: a.id,
            name: a.name?.value || '',
            parentid: a.parentid,
            translation: a.translation,
            [info.stateofpreparationid === '2' ? 'product' : 'prepared']: a,
          });
        }
      });
    }
  };

  processNutrients(product, prod);
  processNutrients(prepared, prep);

  const getColspan = (info: DisplayInfo) =>
    (info.showHunderd ? 1 : 0) +
    (info.showPortion ? 1 : 0) +
    (info.showGDA ? 1 : 0);

  const roundValue = (
    value: number | undefined,
    roundBy: string | undefined,
  ) => {
    if (value === undefined) return undefined;
    if (roundBy === undefined) return value;

    const decimals = parseInt(roundBy, 10);
    if (isNaN(decimals)) return value;

    return Number(value.toFixed(decimals));
  };

  const formatValue = (
    value: number | undefined,
    unit: string,
    roundBy: string | undefined,
  ) => {
    if (value === undefined) return '';
    const roundedValue = roundValue(value, roundBy);
    return `${roundedValue} ${unit}`;
  };

  const getEnergyValue = (
    nutrient: Nutrient | undefined,
    isPerServing: boolean = false,
  ) => {
    if (!nutrient) return '';
    const value = isPerServing ? nutrient.valueperserving : nutrient.value;
    return value === undefined ? '' : value.toFixed(0);
  };

  const kcal = nutrientInfo.find(x => x.id === '2');
  const energyLabel = kcal ? ' (kJ/kcal)' : ' (kJ)';

  const renderTableHeader = (
    info: DisplayInfo,
    stateInfo: typeof product | typeof prepared,
  ) => (
    <>
      {info.showHunderd && (
        <th className="w-1/6 p-2 text-center border-l border-b">
          {t('product.nutrient.per')} 100 ({stateInfo?.perhunderduomname?.value}
          )
        </th>
      )}
      {info.showPortion && (
        <th className="w-1/6 p-2 text-center border-l border-r border-b">
          {t('product.nutrient.perPortion')} ({stateInfo?.servingunitvalue}{' '}
          {stateInfo?.servinguomname?.value})
        </th>
      )}
      {info.showGDA && (
        <th className="w-1/6 p-2 text-center border-l border-r border-b">
          {t('product.nutrient.riGda')}
        </th>
      )}
    </>
  );

  const renderNutrientRow = (
    n: NutrientInfo,
    info: DisplayInfo,
    stateInfo: Nutrient,
  ) => (
    <>
      {info.showHunderd && (
        <td className="p-2 text-center">
          {n.id === '1'
            ? `${getEnergyValue(stateInfo)} / ${getEnergyValue(kcal?.[info === prod ? 'product' : 'prepared'])}`
            : formatValue(
                stateInfo?.value,
                stateInfo?.unitofmeasurename?.value || '',
                stateInfo?.roundby,
              )}
        </td>
      )}
      {info.showPortion && (
        <td className="p-2 text-center">
          {n.id === '1'
            ? `${getEnergyValue(stateInfo, true)} / ${getEnergyValue(kcal?.[info === prod ? 'product' : 'prepared'], true)}`
            : formatValue(
                stateInfo?.valueperserving,
                stateInfo?.unitofmeasurename?.value || '',
                stateInfo?.roundby,
              )}
        </td>
      )}
      {info.showGDA && (
        <td className="p-2 text-center">
          {stateInfo?.guidelinedailyamount
            ? `${stateInfo.guidelinedailyamount}%`
            : ''}
        </td>
      )}
    </>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="border-b bg-gray-50 dark:bg-gray-700">
          <tr className="border-gray-300">
            <th className="p-2 border-t border-l"></th>
            {prod.isActive && (
              <th colSpan={getColspan(prod)} className="p-2 text-center border">
                {product?.stateofpreparationname.value}
              </th>
            )}
            {prep.isActive && (
              <th colSpan={getColspan(prep)} className="p-2 text-center border">
                {prepared?.stateofpreparationname.value}
              </th>
            )}
          </tr>
          <tr className="border-gray-300">
            <th className="w-3/6 p-2 border-b border-l"></th>
            {prod.isActive && renderTableHeader(prod, product)}
            {prep.isActive && renderTableHeader(prep, prepared)}
          </tr>
        </thead>
        <tbody>
          {nutrientInfo
            .filter(n => n.id !== '2')
            .map(n => (
              <tr key={n.id} className="border-b odd:bg-white even:bg-gray-50">
                <td
                  className={
                    n.parentid === undefined ? 'p-2 font-bold' : 'pl-6'
                  }
                >
                  {getTranslationValue(n.translation, locale)}
                  {n.id === '1' ? energyLabel : ''}
                </td>
                {prod.isActive && renderNutrientRow(n, prod, n.product)}
                {prep.isActive && renderNutrientRow(n, prep, n.prepared)}
              </tr>
            ))}
        </tbody>
      </table>
      {nutrientComment && <p className="text-sm my-4">{nutrientComment}</p>}
      {((prod.isActive && prod.showGDA) || (prep.isActive && prep.showGDA)) && (
        <>
          {dailyValueIntakeTeferenceComment ? (
            <p className="text-sm my-4">{dailyValueIntakeTeferenceComment}</p>
          ) : (
            <p
              className="text-sm my-4"
              dangerouslySetInnerHTML={{
                __html: t('productsheet.nutrientGdaReferenceLabel', {
                  interpolation: {escapeValue: false},
                }),
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

const Nutrients: React.FC<NutrientsProps> = async ({
  nutrientinfolist,
  nutrientComment,
  dailyValueIntakeTeferenceComment,
  locale,
}) => {
  const t = await createTranslation(locale, 'common');

  if (!nutrientinfolist && !nutrientComment) return null;

  return (
    <Container id="nutrients" className="mb-8 lg:mb-10 xl:mb-12">
      <Container className="mx-auto relative mb-2 lg:mb-4 xl:mb-6">
        <h2 className="text-xl font-semibold leading-6 mb-4">
          {t('product.nutrients')}
        </h2>

        <NutrientsTable
          nutrientinfolist={nutrientinfolist}
          nutrientComment={nutrientComment}
          dailyValueIntakeTeferenceComment={dailyValueIntakeTeferenceComment}
          locale={locale}
        />
      </Container>
    </Container>
  );
};

export default Nutrients;
