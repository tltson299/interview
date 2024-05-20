import { IInformationState } from '.';

export const GET_INFORMATION_REQUEST = 'GET_INFORMATION_REQUEST';

export const getInformationRequest = (payload: IInformationState) => {
  return { type: GET_INFORMATION_REQUEST, payload };
};
