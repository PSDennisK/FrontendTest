import {FC} from 'react';
import {useTranslation} from 'react-i18next';

type ErrorFallbackProps = {
  containerClasses?: string;
  errorContainer?: string;
  errorHeading?: string;
  errorText?: string;
  errorDev?: string;
  error?: Error;
  onRetry?: () => void;
};

export const ErrorFallback: FC<ErrorFallbackProps> = ({
  errorContainer,
  errorHeading,
  errorText,
  errorDev,
  error,
  onRetry,
}) => {
  const {t} = useTranslation('common');

  return (
    <div className={errorContainer}>
      <h3 className={errorHeading}>{t('error.somethingWentWrong')}</h3>
      <p className={errorText}>{t('error.tryAgainLater')}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {t('common.tryAgain')}
        </button>
      )}
      {error && process.env.NODE_ENV === 'development' && (
        <pre className={errorDev}>{error.message}</pre>
      )}
    </div>
  );
};
