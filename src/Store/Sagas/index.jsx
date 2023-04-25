import { all } from '@redux-saga/core/effects';
import { watchLogin, watchLogout, watchReset, watchUpdate } from './Account/Login.Sagas';
export default function* rootSaga() {
  yield all([watchLogin(), watchLogout(), watchReset(), watchUpdate()]);
}
