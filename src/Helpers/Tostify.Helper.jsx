import React from 'react';
import { useToasts } from 'react-toast-notifications';

let GlobalAddToaster = null;
export const GlobalToasterGenerator = () => {
  GlobalAddToaster = useToasts();

  return null;
};
export const showSuccess = (
  message,
  onDismiss,
  configuration = {
    appearance: 'success',
    autoDismiss: true,
    autoDismissTimeout: 4000,
  }
) => {
  if (GlobalAddToaster) GlobalAddToaster.addToast(message, { ...configuration, onDismiss });
};

export const showError = (
  message,
  errors,
  onDismiss,
  configuration = {
    appearance: 'error',
    autoDismiss: true,
    autoDismissTimeout: 4000,
  }
) => {
  const localData = errors?.response?.data || errors?.data;
  const localErrors = localData?.errors || localData?.reason;
  const alternativeMessage = localData?.status || localData?.message;
  const localCodeStatusCondition =
    localData &&
    localData.identifiers &&
    (localData.identifiers.statusCode === 400 ||
      localData.identifiers.statusCode === 401 ||
      localData.identifiers.statusCode === 402 ||
      localData.identifiers.statusCode === 403);
  const localErrorsCondition =
    localErrors &&
    !localCodeStatusCondition &&
    ((typeof localErrors === 'object' && !Array.isArray(localErrors)) ||
      (Array.isArray(localErrors) && localErrors.length > 0));
  const toDisplayMessages =
    (localErrorsCondition && (
      <ul className='mb-0'>
        {(Array.isArray(localErrors) &&
          localErrors.map((item, index) => (
            <li key={`errorKey${index + 1}`}>
              <span>{item.error}</span>
            </li>
          ))) ||
          Object.entries(localErrors).map(
            (items, index) =>
              (Array.isArray(items[1]) &&
                items[1].map((item, subIndex) => (
                  <li key={`${items[0]}${index + 1}-${subIndex + 1}`}>{item}</li>
                ))) || <li key={`${items[0]}${index + 1}`}>{items[1]}</li>
          )}
      </ul>
    )) ||
    alternativeMessage ||
    message;
  if (GlobalAddToaster && toDisplayMessages)
    GlobalAddToaster.addToast(toDisplayMessages, {
      ...configuration,
      onDismiss,
      id: toDisplayMessages, // to prevent duplicated toasters
    });
};

// function showWarn(message, configuration = { autoClose: 3000 }) {
//   toast.warn(message, configuration);
// }
//
// function showInfo(message, configuration = { autoClose: 3000 }) {
//   toast.info(message, configuration);
// }
