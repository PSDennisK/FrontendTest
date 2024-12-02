import {Container} from '@/components/ui/Layout';
import {umbraco} from '@/foodbook.config';

import {UmbracoContent} from '@/types';
import {getUrlFromPageLink} from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';

const TargetGroups = ({targetgroups}: {targetgroups: UmbracoContent}) => {
  return (
    <>
      <Container className="grid grid-cols-1 gap-3 lg:grid-cols-3 xl:grid-cols-3 md:gap-6 my-24 leading-6">
        {targetgroups?.items?.map(targetgroup => (
          <Container
            key={targetgroup?.content?.id}
            className="group flex flex-col rounded-xl bg-white shadow-xl h-full"
          >
            <Container
              className={`box-border relative w-full max-w-md px-4 mt-5 mb-4 -ml-5 text-center bg-no-repeat bg-contain border-solid md:ml-0 md:mt-0 md:max-w-none lg:mb-0 md:w-1/2 xl:pl-4 ${targetgroup?.content?.properties?.blockAlign?.toLowerCase() == 'right' ? 'order-2' : 'order-1'}`}
            >
              {targetgroup?.content?.properties?.blockImage?.length === 1 ? (
                <Image
                  width={720}
                  height={400}
                  alt={targetgroup?.content?.properties?.blockImage[0]?.name}
                  src={`${umbraco.site_domain}${targetgroup?.content?.properties?.blockImage[0]?.url}`}
                  className="p-2 pl-6 pr-5 xl:pl-16 xl:pr-20 rounded-xl"
                />
              ) : (
                targetgroup?.content?.properties?.blockImage?.map(
                  blockimage => (
                    <Image
                      key={blockimage?.id}
                      width={555}
                      height={400}
                      alt={blockimage?.name}
                      src={`${umbraco.site_domain}${blockimage?.url}`}
                      className="p-2 pl-6 pr-5 xl:pl-16 xl:pr-20 rounded-xl"
                    />
                  ),
                )
              )}
            </Container>

            <Container className="p-8 flex flex-col flex-grow">
              <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
                {targetgroup?.content?.properties?.targetGroupTitle}
              </h2>
              {targetgroup?.content?.properties?.targetGroupContent && (
                <div className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 lg:text-lg flex-grow">
                  {targetgroup?.content?.properties?.targetGroupContent}
                </div>
              )}

              {targetgroup?.content?.properties?.targetGroupLinks &&
                targetgroup?.content?.properties?.targetGroupLinks.map(link => (
                  <Link
                    key={link?.destinationId}
                    href={getUrlFromPageLink(link)}
                    title={link?.title}
                    className="inline-flex w-fit bg-ps-green-500 text-white border border-ps-green-500 text-lg leading-6 rounded-md py-3 px-4 mr-2 transition-all duration-300 ease-in-out transform hover:bg-white hover:border hover:text-ps-green-500 mt-auto"
                  >
                    {link?.title}
                  </Link>
                ))}
            </Container>
          </Container>
        ))}
      </Container>
    </>
  );
};

export default TargetGroups;
