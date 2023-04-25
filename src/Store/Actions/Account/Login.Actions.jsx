import { LoginStates } from '../../States';

const login = (payload) => {
  return { type: LoginStates.LOGIN, payload };
};

const reset = (payload) => {
  return { type: LoginStates.RESET, payload };
};

const update = (payload) => {
  return { type: LoginStates.UPDATE, payload };
};

const getLoginSuccess = (payload) => {
  return { type: LoginStates.LOGIN_SUCCESS, payload };
};

const getLoginError = (payload) => {
  return { type: LoginStates.LOGIN_FAIL, payload };
};
const getLogoutSuccess = (payload) => {
  return { type: LoginStates.LOGOUT_SUCCESS, payload };
};

const getLogoutError = (payload) => {
  return { type: LoginStates.LOGOUT_FAIL, payload };
};

const logout = () => {
  return { type: LoginStates.LOGOUT };
};
export const LoginActions = {
  login,
  getLoginSuccess,
  getLoginError,
  getLogoutSuccess,
  getLogoutError,
  logout,
  update,
  reset,
};
