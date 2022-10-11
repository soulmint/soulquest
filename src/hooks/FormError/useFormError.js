import { useMemo } from 'react';
import { deriveErrorMessage } from '../../utils/deriveErrorMessage';
import { useTranslation } from 'next-i18next';

export const useFormError = (props) => {
  const { errors, allowErrorMessages } = props;
  const { t } = useTranslation('common');

  const derivedErrorMessage = useMemo(() => {
    const defaultErrorMessage = allowErrorMessages
      ? ''
      : t('An error has occurred. Please check the input and try again.');
    return deriveErrorMessage(errors, defaultErrorMessage);
  }, [errors, allowErrorMessages, t]);

  return {
    errorMessage: derivedErrorMessage
  };
};
