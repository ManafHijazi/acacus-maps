import { call, put, takeEvery } from 'redux-saga/effects';

import { LoginActions } from '../../Actions';
import { LoginStates } from '../../States';
import { LoginService, LogoutService } from '../../../Services';

function* fetchLogin(action) {
  try {
    const results = yield call(LoginService, action.payload);
    yield put(LoginActions.getLoginSuccess(results));
  } catch (err) {
    yield put(LoginActions.getLoginError(err));
  }
}

export function* watchLogin() {
  yield takeEvery(LoginStates.LOGIN, fetchLogin);
}

function* fetchReset(action) {
  try {
    yield put(LoginActions.getLoginSuccess(action.payload));
  } catch (err) {
    yield put(LoginActions.getLoginError(err));
  }
}

export function* watchReset() {
  yield takeEvery(LoginStates.RESET, fetchReset);
}

function* fetchUpdate(action) {
  try {
    yield put(LoginActions.getLoginSuccess(action.payload));
  } catch (err) {
    yield put(LoginActions.getLoginError(err));
  }
}

export function* watchUpdate() {
  yield takeEvery(LoginStates.UPDATE, fetchUpdate);
}

// action
function* fetchLogout() {
  try {
    const results = yield call(LogoutService);
    yield put(LoginActions.getLogoutSuccess(results));
  } catch (err) {
    yield put(LoginActions.getLogoutError(err));
  }
  //@todo write logout bunsins here
  // yield put(LoginActions.logout());
}

export function* watchLogout() {
  yield takeEvery(LoginStates.LOGOUT, fetchLogout);
}
