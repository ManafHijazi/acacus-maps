import React from 'react';
import App from './App';
import i18next from 'i18next';
import ReactDOM from 'react-dom';
import { store } from './Store/Store';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import { I18nextProvider } from 'react-i18next';
import { ToastProvider } from 'react-toast-notifications';
import './Assets/Styles/Master.Style.scss';

ReactDOM.render(
  <I18nextProvider i18n={i18next}>
    <Provider store={store}>
      <ToastProvider placement='top-center'>
        <App />
      </ToastProvider>
    </Provider>
    <ToastContainer />
  </I18nextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
