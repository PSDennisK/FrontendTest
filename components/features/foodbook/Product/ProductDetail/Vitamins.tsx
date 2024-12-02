import {createTranslation} from '@/i18n/server';
import {Culture, Nutrient, Nutrientinfolist} from '@/types';
import React from 'react';

interface VitaminsProps {
  nutrientinfolist: Nutrientinfolist;
  locale: keyof typeof Culture;
}

interface NutrientInfo {
  id: string;
  name: string;
  product?: Nutrient;
  prepared?: Nutrient;
}

interface DisplayInfo {
  isActive: boolean;
  showHunderd: boolean;
  showPortion: boolean;
}

const vitaminNutrients = [48, 53, 55, 56, 60];

const Vitamins: React.FC<VitaminsProps> = async ({
  nutrientinfolist,
  locale,
}) => {
  const t = await createTranslation(locale, 'common');

  if (!nutrientinfolist?.nutrientinfo) return null;

  const nutrientinfoFiltered = nutrientinfolist.nutrientinfo.filter(
    a => a?.stateofpreparationid !== '99999',
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
    showPortion: false,
  };
  const prep: DisplayInfo = {
    isActive: false,
    showHunderd: false,
    showPortion: false,
  };

  const processNutrients = (
    info: typeof product | typeof prepared,
    displayInfo: DisplayInfo,
  ) => {
    if (info && info.nutrients?.nutrient?.length > 0) {
      displayInfo.isActive = true;
      displayInfo.showHunderd = info.nutrients?.nutrient?.some(
        a =>
          a.value !== undefined &&
          vitaminNutrients.includes(parseInt(a.id, 10)),
      );
      displayInfo.showPortion = info.nutrients?.nutrient?.some(
        a =>
          a.valueperserving !== undefined &&
          vitaminNutrients.includes(parseInt(a.id, 10)),
      );

      if (!vitaminNutrients) return null;

      info.nutrients?.nutrient
        ?.filter(a => vitaminNutrients.includes(parseInt(a.id, 10)))
        .forEach(a => {
          const existingNutrient = nutrientInfo.find(n => n.id === a.id);
          if (existingNutrient) {
            existingNutrient[
              info.stateofpreparationid === '2' ? 'product' : 'prepared'
            ] = a;
          } else {
            nutrientInfo.push({
              id: a.id,
              name: a.name?.value || '',
              [info.stateofpreparationid === '2' ? 'product' : 'prepared']: a,
            });
          }
        });
    }
  };

  processNutrients(product, prod);
  processNutrients(prepared, prep);

  if (!product && !prepared) return null;

  const getColspan = (info: DisplayInfo) =>
    (info.showHunderd ? 1 : 0) + (info.showPortion ? 1 : 0);

  const formatValue = (value: number | undefined, unit: string) => {
    if (value === undefined) return '';

    const valueStr = value.toString();
    const [intPart, decimalPart] = valueStr.split('.');

    let formattedValue: string;
    if (!decimalPart) {
      formattedValue = intPart;
    } else if (
      decimalPart.length === 1 ||
      (decimalPart.length === 2 && decimalPart[1] !== '0')
    ) {
      formattedValue = valueStr;
    } else {
      const rounded = Math.round(value * 100) / 100;
      formattedValue = rounded.toFixed(2);
    }

    return `${formattedValue} ${unit}`.trim();
  };

  const renderTableHeader = (
    info: DisplayInfo,
    stateInfo: typeof product | typeof prepared,
  ) => (
    <>
      {info.showHunderd && (
        <th className="p-2 text-center border-l border-b">
          {t('product.nutrient.per')} 100 ({stateInfo?.perhunderduomname?.value}
          )
        </th>
      )}
      {info.showPortion && (
        <th className="p-2 text-center border-l border-r border-b">
          {t('product.nutrient.perPortion')} ({stateInfo?.servingunitvalue}{' '}
          {stateInfo?.servinguomname?.value})
        </th>
      )}
    </>
  );

  const renderNutrientRow = (
    n: NutrientInfo,
    info: DisplayInfo,
    stateInfo: Nutrient | undefined,
  ) => (
    <>
      {info.showHunderd && (
        <td className="p-2 text-center">
          {formatValue(
            stateInfo?.value,
            stateInfo?.unitofmeasurename?.value || '',
          )}
        </td>
      )}
      {info.showPortion && (
        <td className="p-2 text-center">
          {formatValue(
            stateInfo?.valueperserving,
            stateInfo?.unitofmeasurename?.value || '',
          )}
        </td>
      )}
    </>
  );

  return (
    <>
      {(prod.isActive && (prod.showHunderd || prod.showPortion)) ||
      (prep.isActive && (prep.showHunderd || prep.showPortion)) ? (
        <div id="vitamins" className="mb-8">
          <h2 className="text-xl font-semibold leading-6 mb-4">
            {t('productsheet.vitaminsAndMinerals')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b bg-gray-50 dark:bg-gray-700">
                <tr className="border-gray-300">
                  <th className="p-2 border-t border-l"></th>
                  {prod.isActive && (
                    <th
                      colSpan={getColspan(prod)}
                      className="p-2 text-center border"
                    >
                      {product?.stateofpreparationname.value}
                    </th>
                  )}
                  {prep.isActive && (
                    <th
                      colSpan={getColspan(prep)}
                      className="p-2 text-center border"
                    >
                      {prepared?.stateofpreparationname.value}
                    </th>
                  )}
                </tr>
                <tr className="border-gray-300">
                  <th className="p-2 border-b border-l"></th>
                  {prod.isActive && renderTableHeader(prod, product)}
                  {prep.isActive && renderTableHeader(prep, prepared)}
                </tr>
              </thead>
              <tbody>
                {nutrientInfo.map(n => (
                  <tr
                    key={n.id}
                    className="border-b odd:bg-white even:bg-gray-50"
                  >
                    <td className="p-2 font-semibold">{n.name}</td>
                    {prod.isActive && renderNutrientRow(n, prod, n.product)}
                    {prep.isActive && renderNutrientRow(n, prep, n.prepared)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Vitamins;
