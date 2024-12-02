'use client';

import {Container} from '@/components/ui/Layout';
import {Culture, Logisticinfo, Logisticinfolist} from '@/types';
import {
  convertToBoolean,
  getTranslatedValue,
  isValueFilled,
  mapPackageTypeId,
  renderApplicable,
} from '@/utils/helpers';
import {FC, memo, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import LogisticHierarchy from './LogisticHierarchy';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  subtitle: 'text-lg font-semibold leading-6 mb-4',
  hierarchyContainer: 'pl-4 mb-4 text-sm',
  infoContainer: 'text-sm mt-6',
  table: 'w-full text-left text-sm',
  row: 'border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800',
  labelCell: 'p-2 w-1/3',
  valueCell: 'p-2',
} as const;

type TableRowProps = {
  label: string;
  value: ReactNode;
};

type LogisticInfoProps = {
  logisticInfo: Logisticinfo;
  depth?: number;
  isnonfood: boolean;
  isBasic?: boolean;
  isFull?: boolean;
  locale: keyof typeof Culture;
};

type LogisticDetailsProps = {
  logisticinfolist: Logisticinfolist;
  nonfood: string;
  locale: keyof typeof Culture;
};

const TableRow: FC<TableRowProps> = memo(({label, value}) => (
  <tr className={CLASSES.row}>
    <td className={CLASSES.labelCell}>{label}</td>
    <td className={CLASSES.valueCell}>
      {value !== undefined && value !== null && value !== '' ? value : ''}
    </td>
  </tr>
));

const LogisticInfoDisplay: FC<LogisticInfoProps> = memo(
  ({
    logisticInfo,
    depth = 0,
    isnonfood,
    isBasic = false,
    isFull = false,
    locale,
  }) => {
    const {t} = useTranslation('common');

    const translations = {
      notFilledIn: t('common.notFilledIn'),
      yes: t('common.yes'),
      no: t('common.no'),
    };

    const renderRow = (key: string, value: ReactNode) => (
      <TableRow
        label={t(`productsheet.packagedproduct.${key}`)}
        value={value}
      />
    );

    const renderApplicableRow = (key: string, value?: string) =>
      renderRow(
        key,
        renderApplicable(value, isValueFilled(value), translations),
      );

    const renderWeightRow = (key: string, value?: string, uom?: string) =>
      renderRow(key, value && uom ? `${value} ${uom}` : '');

    const renderBaseUnitContent = () => (
      <>
        {renderRow(
          'logisticItemArticleNameLabel',
          getTranslatedValue(logisticInfo.name, locale),
        )}
        {renderRow(
          'logisticItemDescriptionShortLabel',
          getTranslatedValue(logisticInfo.descriptionshort, locale),
        )}
        {renderRow('logisticItemGtinLabel', logisticInfo.gtin)}
        {renderRow('logisticItemArticleNumberLabel', logisticInfo.number)}
        {renderRow(
          'logisticItemIntrastatCodeLabel',
          logisticInfo.intrastatcode,
        )}

        {!isnonfood &&
          renderRow('logisticItemEgNumberLabel', logisticInfo.egnumber)}

        {isFull && (
          <>
            {renderRow(
              'logisticItemTaxRateApplicabilityLabel',
              logisticInfo.taxratename?.value,
            )}
            {renderRow(
              'logisticItemIsAvailableInFoodserviceLabel',
              renderApplicable(
                logisticInfo.isavailableinfoodservice,
                true,
                translations,
              ),
            )}
            {renderRow(
              'logisticItemIsAvailableInRetailLabel',
              renderApplicable(
                logisticInfo.isavailableinretail,
                true,
                translations,
              ),
            )}
          </>
        )}

        {logisticInfo.package && (
          <>
            {renderRow(
              'LogisticItemPackageLengthLabel',
              getTranslatedValue(logisticInfo.package?.name, locale),
            )}
            {isFull &&
              renderRow(
                'logisticItemDepositAmountLabel',
                logisticInfo.package?.depositamount,
              )}
          </>
        )}

        {renderApplicableRow(
          'logisticItemIsEstimateWeightOrVolumeLabel',
          renderApplicable(
            logisticInfo.isestimatedweightorvalue,
            true,
            translations,
          ),
        )}
        {renderWeightRow(
          'logisticItemNetContentLabel',
          logisticInfo.netcontentvalue,
          logisticInfo.netcontentuomname?.value,
        )}
        {renderWeightRow(
          'logisticItemNetWeightLabel',
          logisticInfo.netweightvalue,
          logisticInfo.netweightuomname?.value,
        )}
        {renderWeightRow(
          'logisticItemGrossWeightLabel',
          logisticInfo.grossweightvalue,
          logisticInfo.grossweightuomname?.value,
        )}

        {!isnonfood &&
          renderRow(
            'logisticItemDrainedWeightLabel',
            logisticInfo.drainedweightvalue,
          )}

        {logisticInfo.servingquantity &&
          renderRow(
            'logisticItemAmountPerPieceLabel',
            `${logisticInfo.servingquantity} x ${logisticInfo.servingweightvalue} ${logisticInfo.servingweightuomname?.value}`,
          )}

        {!isnonfood && (
          <>
            {renderRow(
              'logisticItemNumberOfServingsPerPackageLabel',
              logisticInfo.numberofservingsperpackage,
            )}
            {renderRow(
              'logisticItemMinimalNumberOfServingsPerPackageLabel',
              logisticInfo.minimumnumberofservingsperpackage,
            )}
            {renderRow(
              'logisticItemMaximalNumberOfServingsPerPackageLabel',
              logisticInfo.maximumnumberofservingsperpackage,
            )}
          </>
        )}
      </>
    );

    const renderTradeUnitContent = () => (
      <>
        {isFull && (
          <>
            {renderRow(
              'logisticItemArticleNameLabel',
              getTranslatedValue(logisticInfo.name, locale),
            )}
            {renderRow(
              'logisticItemDescriptionShortLabel',
              getTranslatedValue(logisticInfo.descriptionshort, locale),
            )}
          </>
        )}

        {renderRow('logisticItemGtinLabel', logisticInfo.gtin)}
        {renderRow('logisticItemArticleNumberLabel', logisticInfo.number)}

        {logisticInfo.package &&
          renderRow(
            'LogisticItemPackageLengthLabel',
            getTranslatedValue(logisticInfo.package.name, locale),
          )}

        {renderWeightRow(
          'logisticItemNetWeightLabel',
          logisticInfo.netweightvalue,
          logisticInfo.netweightuomname?.value,
        )}
        {renderWeightRow(
          'logisticItemGrossWeightLabel',
          logisticInfo.grossweightvalue,
          logisticInfo.grossweightuomname?.value,
        )}
        {renderRow(
          'logisticItemAmoutCeInHeLabel',
          logisticInfo.numberofsmallerlogisticinfoitems,
        )}
      </>
    );

    const renderPalletContent = () => (
      <>
        {isFull && (
          <>
            {renderRow(
              'logisticItemArticleNameLabel',
              getTranslatedValue(logisticInfo.name, locale),
            )}
            {renderRow(
              'logisticItemDescriptionShortLabel',
              getTranslatedValue(logisticInfo.descriptionshort, locale),
            )}
          </>
        )}

        {!isBasic && (
          <>
            {renderRow(
              'logisticItemPackageLengthPalletLabel',
              getTranslatedValue(logisticInfo.package.name, locale),
            )}
            {logisticInfo.netweightvalue &&
              renderWeightRow(
                'logisticItemNetWeightLabel',
                logisticInfo.netweightvalue,
                logisticInfo.netweightuomname?.value,
              )}
            {logisticInfo.grossweightvalue &&
              renderWeightRow(
                'logisticItemGrossWeightLabel',
                logisticInfo.grossweightvalue,
                logisticInfo.grossweightuomname?.value,
              )}
            {renderRow(
              'logisticItemAmountHeInPalletLabel',
              logisticInfo.numberofsmallerlogisticinfoitems,
            )}
            {renderRow(
              'logisticItemAmountBoxesPerLayerLabel',
              logisticInfo.amountperpalletlayer,
            )}
            {renderRow(
              'logisticItemLayersPerPalletLabel',
              logisticInfo.amountlayerperpallet,
            )}
          </>
        )}

        {isFull && (
          <>
            {renderApplicableRow(
              'logisticItemUnderlaySheetLabel',
              logisticInfo.underlaysheet,
            )}
            {renderApplicableRow(
              'logisticItemBetweenSheetLabel',
              logisticInfo.betweensheet,
            )}
            {renderApplicableRow(
              'logisticItemCoverSheetLabel',
              logisticInfo.coversheet,
            )}
            {renderApplicableRow(
              'logisticItemWrappingFoilLabel',
              logisticInfo.wrappingfoil,
            )}
            {renderApplicableRow(
              'logisticItemProductCanBeTurnedOverLabel',
              logisticInfo.productcanbeturnedover,
            )}
            {renderApplicableRow(
              'logisticItemGtinVisibleOnProductsinPalletLabel',
              logisticInfo.gtinvisibleonproductsinpallet,
            )}
          </>
        )}
      </>
    );

    const renderUnitTypeContent = () => (
      <>
        {renderApplicableRow(
          'logisticItemConsumerUnitLabel',
          logisticInfo.isconsumerunit,
        )}
        {renderApplicableRow(
          'logisticItemDespatchUnitLabel',
          logisticInfo.isdespatchunit,
        )}
        {renderApplicableRow(
          'logisticItemInvoiceUnitLabel',
          logisticInfo.isinvoiceunit,
        )}
        {renderApplicableRow(
          'logisticItemOrderableUnitLabel',
          logisticInfo.isorderableunit,
        )}
        {renderApplicableRow(
          'logisticItemVariableUnitLabel',
          logisticInfo.isvariableunit,
        )}
      </>
    );

    const renderPackageTypeContent = () => {
      if (convertToBoolean(logisticInfo.isbaseunit)) {
        return renderBaseUnitContent();
      } else if (
        mapPackageTypeId(logisticInfo.packagedproducttypeid) === 'HE'
      ) {
        return renderTradeUnitContent();
      } else if (
        mapPackageTypeId(logisticInfo.packagedproducttypeid) === 'PALLET'
      ) {
        return renderPalletContent();
      }
      return null;
    };

    return (
      <>
        <Container className={CLASSES.infoContainer}>
          <span id={`PP${logisticInfo.id}`}>
            <strong>{logisticInfo.packagedproducttypename?.value}</strong>
          </span>
          <table className={CLASSES.table}>
            <tbody>
              {renderPackageTypeContent()}
              {isFull && renderUnitTypeContent()}
            </tbody>
          </table>
        </Container>

        {logisticInfo.logisticinfolist && (
          <LogisticInfoDisplay
            logisticInfo={logisticInfo.logisticinfolist.logisticinfo}
            depth={depth + 1}
            isnonfood={isnonfood}
            locale={locale}
          />
        )}
      </>
    );
  },
);

const LogisticDetails: FC<LogisticDetailsProps> = memo(
  ({logisticinfolist, nonfood, locale}) => {
    const {t} = useTranslation('common');
    const logisticInfo = logisticinfolist?.logisticinfo;

    if (!logisticInfo) return null;

    return (
      <Container id="logisticinfo" className={CLASSES.container}>
        <h2 className={CLASSES.title}>{t('productsheet.logistics')}</h2>
        <h3 className={CLASSES.subtitle}>
          {t('productsheet.logisticHierarchy')}
        </h3>

        <Container className={CLASSES.hierarchyContainer}>
          <LogisticHierarchy
            logisticinfolist={logisticinfolist}
            locale={locale}
          />
        </Container>

        <h3 className={CLASSES.subtitle}>
          {t('productsheet.logisticDetails')}
        </h3>

        <LogisticInfoDisplay
          logisticInfo={logisticInfo}
          locale={locale}
          isnonfood={convertToBoolean(nonfood)}
          isFull={true}
        />
      </Container>
    );
  },
);

TableRow.displayName = 'TableRow';
LogisticInfoDisplay.displayName = 'LogisticInfoDisplay';
LogisticDetails.displayName = 'LogisticDetails';

export default LogisticDetails;
