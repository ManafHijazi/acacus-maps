import { LoginStates as loginState } from '../../States';

const init = {};

export const LoginReducers = (state = init, action) => {
  switch (action.type) {
    case loginState.RESET:
    case loginState.LOGOUT_SUCCESS:
      return { ...state, loginResponse: null, error: null };
    case loginState.LOGIN_SUCCESS:
    case loginState.LOGIN_FAIL:
      return { ...state, loginResponse: action.payload, error: null };
    case loginState.LOGOUT_FAIL:
      return { ...state, loginResponse: {}, error: action.payload };
    default:
      return state;
  }
};
