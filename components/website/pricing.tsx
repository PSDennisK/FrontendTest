'use client';

import {Container} from '@/components/ui/Layout';

import {useTranslation} from '@/i18n/client';
import {LocaleTypes} from '@/i18n/settings';
import {UmbracoContentItem, UmbracoProperties} from '@/types';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {FaCheck, FaCircleInfo, FaMinus} from 'react-icons/fa6';
import 'tippy.js/dist/tippy.css';

type CompanyType = 'Producer' | 'Wholesaler' | 'HospitalityProfessional';

const companyTypeMapping: Record<string, CompanyType> = {
  producenten: 'Producer',
  producers: 'Producer',
  groothandels: 'Wholesaler',
  wholesalers: 'Wholesaler',
  afnemers: 'HospitalityProfessional',
  'hospitality-professionals': 'HospitalityProfessional',
};

export function getCompanyTypeFromUrl(
  urlOrPath: string,
): CompanyType | undefined {
  try {
    let pathParts: string[];

    if (urlOrPath.startsWith('http')) {
      const urlObj = new URL(urlOrPath);
      pathParts = urlObj.pathname.split('/').filter(Boolean);
    } else {
      pathParts = urlOrPath.split('/').filter(Boolean);
    }

    const companyTypePart = pathParts.find(part => part in companyTypeMapping);

    if (companyTypePart) {
      return companyTypeMapping[companyTypePart];
    }

    return undefined;
  } catch (error) {
    console.error('Error parsing URL or path:', error);
    return undefined;
  }
}

const Pricing = ({pricingItem}: {pricingItem: UmbracoContentItem}) => {
  const [showStandard, setShowStandard] = useState(true);
  const values = pricingItem?.content?.properties?.pricingTable
    .filter(x => x != null)
    .map(x => x.toLowerCase());

  const getCell = (planName: string) => {
    return values.includes(`#${planName}`) ? (
      <td className={`cell-${planName} text-center`}>
        <Container className={planName === 'premium' ? 'text-white' : ''}>
          <FaCheck className="w-full mx-auto text-xl" />
        </Container>
      </td>
    ) : (
      <td className={`cell-${planName} text-center cell-empty`}>
        <Container className={planName === 'premium' ? 'text-white' : ''}>
          <FaMinus className="w-full mx-auto text-xl" />
        </Container>
      </td>
    );
  };

  useEffect(() => {
    const standardCells = document.querySelectorAll('.cell-standard');
    const allEmpty = Array.from(standardCells).every(cell =>
      cell.classList.contains('cell-empty'),
    );

    if (allEmpty) {
      setShowStandard(false);
    }
  }, []);

  return (
    <>
      {showStandard && getCell('standard')}
      {getCell('premium')}
      {getCell('premiumplus')}
    </>
  );
};

const PricingTable = ({properties}: {properties: UmbracoProperties}) => {
  return (
    <table className="w-full max-w-full mb-4 bg-transparent servicesTable">
      <PricingTableHead properties={properties} />
      <PricingTableBody properties={properties} />
    </table>
  );
};

const PricingTableHead = ({properties}: {properties: UmbracoProperties}) => {
  let locale = useParams()?.locale as LocaleTypes;
  const {t} = useTranslation(locale, 'website');

  const companyType = getCompanyTypeFromUrl(window.location.href);

  const [showStandard, setShowStandard] = useState(true);

  useEffect(() => {
    const standardCells = document.querySelectorAll('.cell-standard');
    const allEmpty = Array.from(standardCells).every(cell =>
      cell.classList.contains('cell-empty'),
    );

    if (allEmpty) {
      setShowStandard(false);
    }
  }, []);

  return (
    <>
      <colgroup>
        <col />
        {showStandard && <col className="col-standard bg-white" />}
        <col className={`col-premium bg-blue-gradient`} />
        <col className={`col-premiumplus bg-white`} />
      </colgroup>
      <thead>
        <tr>
          <th className="w-1/3">
            <Container className="text-3xl font-semibold text-left mx-2">
              {t('price.choosePackages')}
            </Container>
          </th>
          {showStandard && (
            <th className="w-1/5 text-center col-standard">
              <Container className="my-0 mx-2 p-3">
                <Container className="text-lg">
                  {t('price.StandardPlan')}
                </Container>
                {properties?.priceStandard && (
                  <Container className="text-3xl mb-1">{`${properties.priceStandard},-`}</Container>
                )}
                <div className="text-center text-sm mb-1">
                  {t('price.perYear')}
                </div>
                {properties?.pricingRegisterLink && (
                  <>
                    {properties?.pricingRegisterLink.map(registerLink => (
                      <Link
                        key={registerLink.destinationId}
                        className="inline-block align-middle text-center select-none bg-ps-green-500 text-white border border-ps-green-500 font-normal whitespace-no-wrap rounded no-underline py-3 px-4 leading-tight text-lg transition duration-200 ease-in-out hover:bg-white hover:border hover:text-ps-green-500"
                        href={
                          registerLink?.url ||
                          `${registerLink.route.path}?companyType=${companyType}&subscriptionType=${t('price.standard')}` ||
                          registerLink.route.path
                        }
                        target={registerLink.target}
                        title={t('price.getStandard')}
                      >
                        {t('price.getStandard')}
                      </Link>
                    ))}
                  </>
                )}
              </Container>
            </th>
          )}
          <th className="w-1/5 text-center col-premium">
            <Container className="my-0 mx-2 p-3">
              <Container className="text-lg text-white">
                {t('price.PremiumPlan')}
              </Container>
              {properties?.pricePremium && (
                <Container className="text-3xl mb-1 text-white">{`${properties.pricePremium},-`}</Container>
              )}
              <div className="text-center text-sm text-white mb-1">
                {t('price.perYear')}
              </div>
              {properties?.pricingRegisterLink && (
                <>
                  {properties?.pricingRegisterLink.map(registerLink => (
                    <Link
                      key={registerLink.destinationId}
                      className="inline-block align-middle text-center select-none bg-ps-green-500 text-white border border-ps-green-500 font-normal whitespace-no-wrap rounded no-underline py-3 px-4 leading-tight text-lg transition duration-200 ease-in-out hover:bg-white hover:border hover:text-ps-green-500"
                      href={
                        registerLink?.url ||
                        `${registerLink.route.path}?companyType=${companyType}&subscriptionType=${t('price.premium')}` ||
                        ''
                      }
                      target={registerLink.target}
                      title={t('price.getPremium')}
                    >
                      {t('price.getPremium')}
                    </Link>
                  ))}
                </>
              )}
            </Container>
          </th>
          <th className="w-1/5 text-center col-premiumplus">
            <Container className="my-0 mx-2 p-3">
              <Container className="text-lg">
                {t('price.PremiumPlusPlan')}
              </Container>
              {properties?.pricePremiumplus && (
                <Container className="text-3xl mb-1">{`${properties.pricePremiumplus},-`}</Container>
              )}
              <div className="text-center text-sm mb-1">
                {t('price.perYear')}
              </div>
              {properties?.pricingRegisterLink && (
                <>
                  {properties?.pricingRegisterLink.map(registerLink => (
                    <Link
                      key={registerLink.destinationId}
                      className="inline-block align-middle text-center select-none bg-ps-green-500 text-white border border-ps-green-500 font-normal whitespace-no-wrap rounded no-underline py-3 px-4 leading-tight text-lg transition duration-200 ease-in-out hover:bg-white hover:border hover:text-ps-green-500"
                      href={
                        registerLink?.url ||
                        `${registerLink.route.path}?companyType=${companyType}&subscriptionType=${t('price.premiumPlus')}` ||
                        ''
                      }
                      target={registerLink.target}
                      title={t('price.getPremiumPlus')}
                    >
                      {t('price.getPremiumPlus')}
                    </Link>
                  ))}
                </>
              )}
            </Container>
          </th>
        </tr>
      </thead>
    </>
  );
};

const PricingTableBody = ({properties}: {properties: UmbracoProperties}) => {
  return (
    <tbody>
      {properties?.pricingTable?.items?.map(pricingItem => (
        <React.Fragment key={pricingItem?.content.id}>
          {pricingItem?.content?.properties?.pricingActive && (
            <tr>
              <td>
                <Container className="bg-white my-0 mx-1 p-3">
                  {pricingItem?.content?.properties?.pricingTooltip && (
                    <Container className="float-right ml-2">
                      <Tippy
                        className="text-gray-700 text-center ml-2 text-xs"
                        animation="scale"
                        placement="top"
                        content={
                          pricingItem?.content?.properties?.pricingTooltip
                        }
                      >
                        <span>
                          <FaCircleInfo />
                        </span>
                      </Tippy>
                    </Container>
                  )}
                  <p className="text-sm my-0 mx-0 font-normal">
                    {pricingItem?.content?.properties?.pricingText}
                  </p>
                </Container>
              </td>

              <Pricing pricingItem={pricingItem} />
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  );
};

export {Pricing, PricingTable, PricingTableBody, PricingTableHead};
