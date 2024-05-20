import { all } from 'redux-saga/effects';
import { informationSagas } from './information';

export const rootSaga = function* root() {
  yield all([informationSagas()]);
};
