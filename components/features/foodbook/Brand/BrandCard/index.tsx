'use client';

import BrandContactInfo from '@/components/features/foodbook/Brand/BrandCard/BrandContactInfo';
import FallbackImage from '@/components/ui/Image/FallbackImage';
import {Container} from '@/components/ui/Layout';
import ModalForm from '@/components/ui/Modal';
import Form from '@/components/website/form';
import {Brand, Culture} from '@/types';
import {getHighResImageUrl} from '@/utils/helpers';
import {type FC, memo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FaEnvelopeOpenText} from 'react-icons/fa6';

type BrandCardProps = {
  brand: Brand;
  locale: keyof typeof Culture;
};

const CONTAINER_CLASSES = {
  main: 'md:flex items-start justify-between',
  content: 'flex flex-grow',
  imageWrapper: 'flex flex-col w-1/4 md:max-w-[150px] mr-8 mb-5',
  infoWrapper: 'flex flex-col w-2/4',
  actionWrapper: 'flex flex-col ml-auto justify-end self-start',
};

const IMAGE_CLASSES = 'md:w-full h-auto object-contain';

const BUTTON_CLASSES = `
  flex align-middle bg-ps-blue-400 text-white hover:bg-ps-blue-500 
  font-medium px-4 py-2 rounded items-center whitespace-nowrap 
  transition-all duration-300 ease-in-out transform
`;

const FORM_BUTTON_CLASSES = `
  inline-flex mb-2 md:mb-0 mt-4 bg-ps-green-500 text-white 
  border border-ps-green-500 text-md leading-6 rounded-md py-2 px-3 
  transition-all duration-300 ease-in-out transform 
  hover:bg-white hover:border hover:text-ps-green-500 disabled:cursor-not-allowed disabled:opacity-50
`;

const isAskQuestionEnabled =
  process.env.NEXT_PUBLIC_ASK_QUESTION_ENABLED === 'true';

/**
 * BrandCard component displays brand information and contact options
 */
const BrandCard: FC<BrandCardProps> = memo(({brand, locale}) => {
  const {t} = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!brand) {
    return null;
  }

  const {image, name, producerName, email, isprivatelabel} = brand;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Container className={CONTAINER_CLASSES.main}>
      <Container className={CONTAINER_CLASSES.content}>
        {/* Brand Image */}
        <Container className={CONTAINER_CLASSES.imageWrapper}>
          <FallbackImage
            itemProp="logo"
            id="brandImage"
            src={getHighResImageUrl(image)}
            alt={`Logo ${name.trim()}`}
            width={200}
            height={200}
            className={IMAGE_CLASSES}
            priority={true}
            loading="eager"
          />
        </Container>

        {/* Brand Information */}
        <Container className={CONTAINER_CLASSES.infoWrapper}>
          <h1 itemProp="name" className="text-3xl font-bold mb-4">
            {name}
          </h1>
          {!isprivatelabel && (
            <h2 className="text-lg font-semibold mb-2">{producerName}</h2>
          )}
          <BrandContactInfo brand={brand} />
        </Container>

        {/* Actions */}
        <Container className={CONTAINER_CLASSES.actionWrapper}>
          {isAskQuestionEnabled && (
            <>
              <button
                className={BUTTON_CLASSES}
                onClick={handleOpenModal}
                title={t('producer.askQuestion')}
                aria-label={t('producer.askQuestion')}
              >
                {t('producer.askQuestion')}
                <FaEnvelopeOpenText className="ml-2" aria-hidden="true" />
              </button>

              <ModalForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={t('producer.askQuestionProducer')}
                modalClass="max-w-3xl"
              >
                <Form
                  params={{
                    locale,
                    formid: process.env.NEXT_PUBLIC_ASK_QUESTION_FORMID,
                  }}
                  formHeaderText={t('producer.askQuestionDescription')}
                  recipientEmail={email}
                  brandName={name}
                  formButtonClass={FORM_BUTTON_CLASSES}
                  thankYouClass="mb-6 mt-4 text-md font-semibold text-center"
                />
              </ModalForm>
            </>
          )}
        </Container>
      </Container>
    </Container>
  );
});

BrandCard.displayName = 'BrandCard';

export default BrandCard;
