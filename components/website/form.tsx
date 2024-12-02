'use client';

import {Container} from '@/components/ui/Layout';
import {umbracoService} from '@/services';

import {
  Culture,
  UmbracoForm,
  UmbracoFormField,
  UmbracoFormPage,
  UmbracoFormSettings,
} from '@/types';
import {useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {AiOutlineLoading3Quarters} from 'react-icons/ai';

interface FormProps {
  params: {locale: keyof typeof Culture; formid: string};
  formHeaderText?: string;
  recipientEmail?: string;
  productDescription?: string;
  brandName?: string;
  formContainerClass?: string;
  formButtonClass?: string;
  thankYouClass?: string;
}

interface UmbracoFormData {
  values: {
    [key: string]: string;
  };
}

const Form = ({
  params: {locale, formid},
  formHeaderText,
  recipientEmail,
  brandName,
  productDescription,
  formContainerClass,
  formButtonClass,
  thankYouClass,
}: FormProps) => {
  const {t} = useTranslation('website');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [form, setForm] = useState<UmbracoForm>();
  const [pages, setPages] = useState<UmbracoFormPage[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<UmbracoFormData>({
    values: {},
  });
  const {
    register,
    handleSubmit,
    formState: {errors},
    trigger,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = React.createRef<ReCAPTCHA>();

  const searchParams = useSearchParams();

  const companyType = searchParams.get('companyType') || '';
  const subscriptionType = searchParams.get('subscriptionType') || '';

  useEffect(() => {
    const fetchFormFields = async () => {
      setIsLoading(true);
      const formData = await umbracoService.fetchFormData(formid, locale);
      setForm(formData);
      setPages(formData.pages);
      setFormData(prev => ({
        ...prev,
        values: {
          ...prev.values,
          recipientEmail: recipientEmail,
          brandName: brandName,
          productDescription: productDescription,
        },
      }));
      setIsLoading(false);
    };

    fetchFormFields();
  }, [formid, locale]);

  const validateCurrentPage = async () => {
    const currentPageFields = pages[currentPage].fieldsets.flatMap(fieldset =>
      fieldset.columns.flatMap(column => column.fields),
    );

    const fieldsToValidate = currentPageFields.map(field => field.alias);
    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextPage = async () => {
    const isValid = await validateCurrentPage();
    if (isValid && currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    const reCaptchaToken = await recaptchaRef.current?.executeAsync();
    if (!reCaptchaToken) {
      console.error('reCAPTCHA token is missing');
      setIsSubmitting(false);
      return;
    }

    const dataToSubmit = {
      ...formData,
      'g-recaptcha-response': reCaptchaToken,
    };

    try {
      const response = await fetch('/api/form-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: formid,
          reCaptchaToken: reCaptchaToken,
          values: dataToSubmit,
        }),
      });

      if (response.ok) {
        setIsFormSubmitted(true);
      } else {
        console.error(response);
        setIsFormSubmitted(false);
        const errorData = await response.json();
        throw new Error(
          `Error ${response.status}: ${errorData.error}. Details: ${errorData}`,
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setIsFormSubmitted(false);
      throw new Error(
        `Error ${error.status}: ${error.title}. Details: ${error.details}`,
      );
    }

    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const {name, value, type} = e.target;
    setFormData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]:
          type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
              ? 'on'
              : 'off'
            : value,
      },
    }));
  };

  const getInputType = (settings: UmbracoFormSettings): string => {
    switch (settings.fieldType) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'textarea':
        return 'textarea';
      default:
        return 'text';
    }
  };

  interface FormData {
    [key: string]: string;
  }

  const renderField = ({
    id,
    alias,
    caption,
    required,
    settings,
    cssClass,
    type,
    requiredErrorMessage,
    preValues,
  }: UmbracoFormField) => {
    const inputType = getInputType(settings);

    const getSelectValue = (fieldAlias: string) => {
      if (fieldAlias === 'companyType' && companyType) {
        return companyType;
      }
      if (fieldAlias === 'subscriptionType' && subscriptionType) {
        return subscriptionType;
      }
      return formData.values[fieldAlias] || '';
    };

    const baseClassName = `
    block w-full px-4 py-4 mt-2 text-sm 
    border-[1px] border-solid border-gray-200 
    placeholder-gray-400 bg-white rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-ps-blue-400 focus:ring-opacity-50`;

    switch (type.name) {
      case 'Dropdown':
        return (
          <>
            <select
              id={id}
              name={alias}
              {...register(alias, {required})}
              onChange={handleChange}
              value={getSelectValue(alias)}
              className={`${baseClassName} ${cssClass} ${errors[alias] ? 'border border-red-500' : ''}`}
            >
              <option className="text-gray-400" value="">
                {settings.selectPrompt}
              </option>
              {preValues.map((value, index) => (
                <option key={index} value={value.value}>
                  {t(`form.${value.value.toLowerCase()}`)}
                </option>
              ))}
            </select>

            {errors[alias] && (
              <span className="text-red-500 text-sm mt-1">
                {requiredErrorMessage}
              </span>
            )}
          </>
        );

      case 'Long answer':
        return (
          <>
            <textarea
              id={id}
              name={alias}
              {...register(alias, {required})}
              placeholder={settings.placeholder}
              rows={settings.numberOfRows ? Number(settings.numberOfRows) : 10}
              cols={2}
              onChange={handleChange}
              value={formData.values[alias] || ''}
              className={`${baseClassName} ${cssClass} ${errors[alias] ? 'border-red-500' : ''}`}
            />

            {errors[alias] && (
              <span className="text-red-500 text-sm mt-1">
                {requiredErrorMessage}
              </span>
            )}
          </>
        );

      case 'Short answer':
        return (
          <>
            <input
              type={inputType}
              data-type={type.name}
              id={id}
              name={alias}
              {...register(alias, {required})}
              placeholder={settings.placeholder}
              onChange={handleChange}
              value={formData.values[alias] || ''}
              className={`${baseClassName} ${cssClass} ${errors[alias] ? 'border-red-500' : ''}`}
              autoComplete="off"
            />

            {errors[alias] && (
              <span className="text-red-500 text-sm mt-1">
                {requiredErrorMessage}
              </span>
            )}
          </>
        );

      case 'reCAPTCHA v3 with score':
        return (
          <>
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />

            {errors[id] && (
              <span className="text-red-500 text-sm mt-1">
                {requiredErrorMessage}
              </span>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container className={formContainerClass}>
      {isFormSubmitted && (
        <h2 className={`leading-7 ${thankYouClass}`}>
          {form?.messageOnSubmit}
        </h2>
      )}

      {isLoading ? (
        <Container className="flex items-center justify-center w-full h-full">
          <AiOutlineLoading3Quarters
            className="loading-icon text-2xl"
            aria-hidden="true"
          />
        </Container>
      ) : (
        !isFormSubmitted && (
          <Container>
            {formHeaderText && <p className="px-4 text-md">{formHeaderText}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="hidden"
                {...register('recipientEmail')}
                value={recipientEmail}
              />
              <input
                type="hidden"
                {...register('brandName')}
                value={brandName}
              />
              <Container className="pages md:space-y-4">
                {pages[currentPage]?.caption && (
                  <h2 className="leading-7 text-2xl font-semibold px-4 mb-6 mt-4">
                    {pages[currentPage]?.caption}
                  </h2>
                )}
                {pages[currentPage]?.fieldsets.map(fieldset => (
                  <Container
                    key={fieldset.id}
                    className={`box-border md:flex items-flex-start content-center ${pages[currentPage]?.caption.length === 0 ? 'md:pt-4' : ''}`}
                  >
                    {fieldset.columns.map((column, index) => (
                      <Container
                        key={index}
                        className={`box-border w-full ${fieldset.columns.length > 1 ? 'md:w-1/2' : ''} px-4 mb-4 md:mb-0`}
                      >
                        <Container className="relative w-full space-y-4">
                          {column.fields.map(field => (
                            <Container
                              key={field.id}
                              className="relative fields"
                            >
                              {field.settings.showLabel === 'True' && (
                                <label
                                  className="font-medium"
                                  htmlFor={field.id}
                                >
                                  {field.caption}
                                </label>
                              )}
                              {renderField(field)}
                            </Container>
                          ))}
                        </Container>
                      </Container>
                    ))}
                  </Container>
                ))}
              </Container>

              <Container className="relative w-full space-y-4">
                <Container
                  className={`flex px-4 ${currentPage === 0 ? 'justify-end' : 'justify-between'}`}
                >
                  {currentPage > 0 && (
                    <button
                      type="button"
                      onClick={prevPage}
                      className={formButtonClass}
                    >
                      {t('contact.previous')}
                    </button>
                  )}
                  {currentPage < pages.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextPage}
                      className={formButtonClass}
                    >
                      {t('contact.next')}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={formButtonClass}
                    >
                      {isSubmitting
                        ? t('contact.submitting')
                        : t('contact.submit')}
                    </button>
                  )}
                </Container>
              </Container>
            </form>
          </Container>
        )
      )}
    </Container>
  );
};

export default Form;
