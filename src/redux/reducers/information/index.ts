import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ECurrency } from 'configs/enums';
import { IExtendedHotel, IHotel } from 'interfaces/hotel';
import CurrencyService from 'services/currency_service';

export interface IInformationState {
  isLoading: boolean;
  hotels: IHotel[];
  extendedHotels: IExtendedHotel[];
  currency: ECurrency;
}

const initialState: IInformationState = {
  isLoading: false,
  hotels: null,
  extendedHotels: null,
  currency: CurrencyService.getCurrency(),
};

const informationSlice = createSlice({
  name: 'information',
  initialState,
  reducers: {
    setInformation(state: IInformationState, action: PayloadAction<IInformationState>) {
      state.isLoading = action.payload.isLoading;
      state.hotels = action.payload.hotels;
      state.extendedHotels = action.payload.extendedHotels;
      state.currency = action.payload.currency;
    },
  },
});

export const { setInformation } = informationSlice.actions;

export default informationSlice.reducer;
