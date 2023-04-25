import axios from 'axios';
import { storageService } from '../utils';
import { GlobalHistory } from './Middleware.Helper';

const renderByStatusCode = (statusCode) => {
  switch (statusCode) {
    case 402:
      GlobalHistory.push('/');
      break;
    // case 404:
    //   GlobalHistory.push('/404');
    //   break;
    case 401:
      storageService.clearLocalStorage();
      removeAllPendingRequestsRecordHttp();
      GlobalHistory.push('/accounts/login');
      break;
    default:
      break;
  }
};

const allPendingRequestsRecord = [];
const getUniqueId = (config) => `url=${config.url}&method=${config.method}`;

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (configurations) => {
    const configurationsLocal = configurations;
    configurationsLocal.cancelToken = new axios.CancelToken((cancel) => {
      // Add record, record the unique value of the request and cancel method
      allPendingRequestsRecord.push({ id: getUniqueId(configurations), cancel });
    });

    configurationsLocal.withCredentials = true;

    return configurationsLocal;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const removeAllPendingRequestsRecordHttp = () => {
  allPendingRequestsRecord.forEach((item) => {
    item.cancel('page changes'); // cancel request
  });
  allPendingRequestsRecord.splice(0); // remove all records
};

// interceptors for handle any response
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) return Promise.reject(error);
    const {
      response: { status },
    } = error;
    // If Session is out of date clear the cookies and local storage then redirect to login page.
    if (error?.response?.data?.token_error) {
      storageService.clearLocalStorage();
      GlobalHistory.push('accounts/login');

      return true;
    }

    renderByStatusCode(status);
    return Promise.reject(error);
  }
);

export const HttpServices = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  axios: axios,
};
