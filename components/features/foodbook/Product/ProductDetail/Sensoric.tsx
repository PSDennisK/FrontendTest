import {Container} from '@/components/ui/Layout';

import {createTranslation} from '@/i18n/server';
import {
  Culture,
  Organolepticcharacteristicinfo,
  Organolepticcharacteristicset,
} from '@/types';
import {getTranslationValue} from '@/utils/helpers';

interface SensoricProps {
  organolepticcharacteristicset: Organolepticcharacteristicset;
  locale: keyof typeof Culture;
}

const Sensoric: React.FC<SensoricProps> = async ({
  organolepticcharacteristicset,
  locale,
}) => {
  const t = await createTranslation(locale, 'common');

  if (!organolepticcharacteristicset) return null;

  const organolepticcharacteristicinfo =
    organolepticcharacteristicset.organolepticcharacteristicinfolist
      ?.organolepticcharacteristicinfo;

  if (!organolepticcharacteristicinfo) return null;

  return (
    <Container id="sensoric" className="mb-8 lg:mb-10 xl:mb-12">
      <h2 className="text-xl font-semibold leading-6 mb-4">
        {t('product.sensoricInformation')}
      </h2>

      <table className="w-full text-sm">
        <tbody>
          {organolepticcharacteristicinfo.map(
            (organolepticinfo: Organolepticcharacteristicinfo, index) => (
              <tr
                key={`${organolepticinfo.id}-${index}`}
                className="border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800"
              >
                <td className="p-2 font-semibold">
                  {getTranslationValue(
                    organolepticinfo?.name?.translation,
                    locale,
                    organolepticinfo?.name?.value,
                  )}
                </td>
                <td className="p-2">
                  {getTranslationValue(
                    organolepticinfo?.description.translation || null,
                    locale,
                    organolepticinfo?.description?.value,
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </Container>
  );
};

export default Sensoric;
