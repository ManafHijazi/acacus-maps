import { init, changeLanguage } from 'i18next';
// import SharedEn from '../Assets/I18n/en.json';
// import SharedAr from '../Assets/I18n/ar.json';

import { GlobalRerender } from './Middleware.Helper';

export const localizationInit = () => {
  init({
    interpolation: { escapeValue: false }, // React already does escaping
    fallbackLng: ['en', 'ar'],
    lng: 'en', // language to use
    resources: {
      // en: {
      //   Shared: SharedEn,
      // },
      // ar: {
      //   Shared: SharedAr,
      // },
    },
  });

  if (localStorage.getItem('localization')) {
    changeLanguage(JSON.parse(localStorage.getItem('localization')).currentLanguage);
    const isRtl = JSON.parse(localStorage.getItem('localization')).currentLanguage === 'ar';
    if (isRtl) {
      const direction =
        JSON.parse(localStorage.getItem('localization')).currentLanguage === 'ar' ? 'rtl' : '';
      document.body.classList.add(direction);
      document.body.setAttribute('dir', direction);
      document.documentElement.lang = JSON.parse(
        localStorage.getItem('localization'),
      ).currentLanguage;
    }
  } else {
    localStorage.setItem('localization', JSON.stringify({ currentLanguage: 'en', isRtl: false }));
    changeLanguage('en');
  }
};

export const languageChange = (currentLanguage) => {
  const isRtl = currentLanguage === 'ar';
  const direction = currentLanguage === 'ar' ? 'rtl' : '';
  localStorage.setItem('localization', JSON.stringify({ currentLanguage, isRtl }));
  document.body.classList.remove('rtl');
  if (direction) document.body.classList.add(direction);
  document.body.setAttribute('dir', direction);
  document.documentElement.lang = currentLanguage;
  changeLanguage(currentLanguage);
  GlobalRerender();
};

localizationInit();
