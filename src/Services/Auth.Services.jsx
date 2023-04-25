import { HttpServices } from '../Helpers';

export const LoginService = async (body) => {
  const result = await HttpServices.post('api/login', body)
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

export const LogoutService = async () => {
  const result = await HttpServices.get('api/logout')
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

export const ChangePasswordService = async (body) => {
  const result = await HttpServices.post('api/change_password', body)
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

