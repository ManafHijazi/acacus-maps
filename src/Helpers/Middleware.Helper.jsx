import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

export let GlobalTranslate = null;
export let GlobalHistory = null;
export let GlobalLocation = null;
let GlobalAccountReducer = null;
let GlobalSocketeducer = null;
export let GlobalFullAccess = false;
export let GlobalToast = null;
export const GlobalSearchDelay = 700;
export const FirstLettersExp = /\b(\w)/gm;
export const GlobalInputDelay = 350;
export const GlobalDateFormat = 'DD MMM YYYY';
export const GlobalSecondaryDateFormat = 'YYYY-MM-DD';
export const GlobalTimeFormat = 'HH:mm:ss';
export const GlobalDateTimeFormat = 'YYYY-MM-DDTHH:mm:ssZ';
export const GlobalDisplayDateTimeFormat = 'YYYY-MM-DD hh:mm:ss A';
export const ResetActiveItem = null;
export const GloabalValidationOptions = {
  // to ignore the transform for value for example translation
  // the value with only check the value before change
  strict: false,
  abortEarly: false, // to prevent stop validated on the first error (not recommended for forms)
  stripUnknown: false, // to ignore unknown variables
  recursive: true, // if false will ignore the subscheme
  context: null, // use to send a value for when (extra keys) (only objects) ex:- on https://www.npmjs.com/package/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema
};
let logoutAction = null;
let setRerender = null;
let renderVar = false;
let setRenderVar = null;
let setGlobalSideExtendedBodyComponent = null;

export const getDataFromObject = (dataItem, key, isReturnAsIs) => {
  if (!key)
    return (typeof dataItem !== 'object' && (isReturnAsIs ? dataItem : `${dataItem}`)) || '';
  if (!key.includes('.'))
    return (dataItem[key] !== null && (isReturnAsIs ? dataItem[key] : `${dataItem[key]}`)) || '';
  let a = dataItem;
  key.split('.').map((item) => {
    if (a) a = a[item];
    return item;
  });
  return a;
};

export const SetGlobalRerender = (setRender, render) => {
  renderVar = render;
  setRenderVar = setRender;
};
export const GlobalRerender = () => {
  setRenderVar(!renderVar);
};
export const InitSideExtendedBodyComponentSet = (setMethod) => {
  setGlobalSideExtendedBodyComponent = setMethod;
};
export const SideExtendedBodyComponentUpdate = (component) => {
  if (setGlobalSideExtendedBodyComponent) setGlobalSideExtendedBodyComponent(component);
};
export const MiddlewareHelper = () => {
  const { addToast } = useToasts();

  GlobalTranslate = useTranslation();
  GlobalHistory = useHistory();
  GlobalLocation = useLocation();
  GlobalToast = addToast;

  return null;
};
export const GetGlobalAccountReducer = () => GlobalAccountReducer;
export const SetGlobalAccountReducer = (newValue) => {
  GlobalAccountReducer = newValue;
};

export const GetGlobalSocketReducer = () => GlobalSocketeducer;
export const SetGlobalSocketReducer = (newValue) => {
  GlobalSocketeducer = newValue;
};

export const rerenderCallback = (callback) => {
  setRerender = callback;
};

export const rerenderUpdate = (component) => {
  if (setRerender) setRerender(component);
};
export const setLogoutAction = (callback) => {
  logoutAction = callback;
};

export const LogoutAction = () => {
  return logoutAction;
};

export const setCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};
export const getCookie = (name) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    const c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
export const eraseCookie = (name) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
