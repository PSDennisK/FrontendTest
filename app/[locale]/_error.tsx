'use client';

import {useTranslation} from 'react-i18next';

export default function Error500Page() {
  const {t} = useTranslation('common');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-12">
        {/* Server Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <svg
              className="h-24 w-24 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
              />
            </svg>
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                <span className="flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {t('error.500error')}
          </h1>
          <p className="text-xl text-gray-600">{t('error.sorry')}</p>
        </div>

        {/* Error Alert */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-auto max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t('error.serverError')}
              </h3>
              <p className="mt-2 text-sm text-red-700">{t('error.problem')}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-ps-blue-600 text-white rounded-lg hover:bg-ps-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {t('error.refresh')}
          </button>

          <div className="text-sm text-gray-600 max-w-md text-center">
            {t('error.contact')}
          </div>

          <a
            href="/"
            className="text-ps-blue-600 hover:text-ps-blue-800 transition-colors"
          >
            {t('error.home')}
          </a>
        </div>
      </div>
    </div>
  );
}
