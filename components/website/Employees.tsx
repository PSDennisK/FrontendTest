import {Container} from '@/components/ui/Layout';
import {createTranslation} from '@/i18n/server';

import {umbraco} from '@/foodbook.config';
import {umbracoService} from '@/services';
import {Culture, Umbraco, UmbracoItems} from '@/types';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {FaPhoneFlip, FaRegEnvelope} from 'react-icons/fa6';

interface EmployeesProps {
  params: {
    slug: string;
    locale: keyof typeof Culture;
  };
}

interface EmployeeProps {
  employee: Umbraco;
  locale: keyof typeof Culture;
}

const Employee: React.FC<EmployeeProps> = React.memo(
  async ({employee, locale}) => {
    const {
      fullName,
      function: jobTitle,
      email,
      phone,
      photo,
    } = employee.properties;

    const t = await createTranslation(locale, 'website');
    const employeeAlt = t('website:employee.imageAlt', {
      fullName: fullName,
    });
    const employeeCall = t('website:employee.call', {fullName: fullName});
    const employeeMail = t('website:employee.email', {
      fullName: fullName,
    });

    return (
      <Container className="flex flex-col items-center justify-center col-span-1">
        <Container className="relative p-5">
          <div
            className="absolute z-10 w-full h-full -mt-5 -ml-5 rounded-full rounded-tr-none bg-ps-blue-50"
            aria-hidden="true"
          ></div>
          {photo?.[0] && (
            <Image
              src={`${umbraco.site_domain}${photo[0].url}`}
              alt={employeeAlt}
              width={200}
              height={200}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="relative z-20 w-full rounded-full"
            />
          )}
        </Container>
        <Container className="mt-3 space-y-2 text-center">
          <Container className="space-y-1">
            <h3 className="text-lg font-medium leading-6">{fullName}</h3>
            {jobTitle && (
              <p className="text-ps-blue-600 text-base">{jobTitle}</p>
            )}
          </Container>
          <Container className="flex items-center justify-center space-x-3">
            {email && (
              <Link
                href={`mailto:${email}`}
                className="text-gray-300 hover:text-gray-400 transition-colors"
                aria-label={employeeMail}
                title={employeeMail}
              >
                <FaRegEnvelope className="text-lg" aria-hidden="true" />
              </Link>
            )}
            {phone && (
              <Link
                href={`tel:${phone}`}
                className="text-gray-300 hover:text-gray-400 transition-colors"
                aria-label={employeeCall}
                title={employeeCall}
              >
                <FaPhoneFlip className="text-lg" aria-hidden="true" />
              </Link>
            )}
          </Container>
        </Container>
      </Container>
    );
  },
);

Employee.displayName = 'Employee';

const Employees: React.FC<EmployeesProps> = async ({params}) => {
  const employees: UmbracoItems = await umbracoService.fetchChildrenBySlug(
    params.slug,
    params.locale,
    50,
  );

  return (
    <Container className="grid w-full grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
      {employees.items.map(employee => (
        <Employee
          key={employee.id}
          employee={employee}
          locale={params.locale}
        />
      ))}
    </Container>
  );
};

export {Employee, Employees};
