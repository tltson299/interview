import { all } from 'redux-saga/effects';
import getInformation from './getInformation';

export const informationSagas = function* root() {
  yield all([getInformation()]);
};
