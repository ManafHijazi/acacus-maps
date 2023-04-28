import { HttpServices } from '../Helpers';

export const LoginService = async (body) => {
  const result = await HttpServices.post('https://qa-identity.lynxedge.ai/v1/auth/login', body)
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

export const GetUserByEmailService = async (email) => {
  const result = await HttpServices.get(`https://qa-identity.lynxedge.ai/v1/users/${email}`)
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

export const LogoutService = async () => {
  const result = await HttpServices.post('https://qa-identity.lynxedge.ai/v1/auth/logout')
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
