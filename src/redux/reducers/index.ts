import { combineReducers } from '@reduxjs/toolkit';
import information from './information';

export const rootReducer = combineReducers({
  information,
});

export type IRootState = ReturnType<typeof rootReducer>;

export default rootReducer;
