import { PayloadAction } from '@reduxjs/toolkit';
import ApiRoutes from 'configs/api_routes';
import { ECurrency } from 'configs/enums';
import { IExtendedHotel, IHotel } from 'interfaces/hotel';
import { IHotelPrice } from 'interfaces/price';
import { call, put, takeLatest } from 'redux-saga/effects';
import { IInformationState, setInformation } from 'redux/reducers/information';
import { GET_INFORMATION_REQUEST } from 'redux/reducers/information/actionTypes';
import ApiService from 'services/api_service';
import CurrencyService from 'services/currency_service';

function* getInformationRequest(action: PayloadAction<IInformationState>) {
  try {
    // skeletons
    yield put(
      setInformation({
        isLoading: true,
        hotels: action.payload.hotels ?? [],
        extendedHotels: action.payload.extendedHotels ?? [],
        currency: action.payload.currency ?? ECurrency.USD,
      }),
    );

    // get hotel list once
    let hotels = action.payload.hotels;
    if (!hotels) {
      hotels = yield call(ApiService.GET, ApiRoutes.hotels.default);
    }

    // get hotel price list and round the numbers
    const hotelPrices: IHotelPrice[] = yield call(ApiService.GET, ApiRoutes.prices.default.replace(':currency', action.payload.currency));
    const roundedPrices = CurrencyService.roundHotelPrices(action.payload.currency, hotelPrices);

    // combine hotel list and hotel price list
    // merge and exclude hotels which don't have details
    const combinedData: { [key: string]: IExtendedHotel } = {};
    hotels.forEach((hotel: IHotel) => {
      combinedData[hotel.id] = { ...hotel };
    });
    roundedPrices.forEach((hotelPrice: IHotelPrice) => {
      const id = hotelPrice.id;
      if (combinedData[id]) {
        combinedData[id] = { ...combinedData[id], ...hotelPrice };
      }
    });
    // convert object to array & sort it
    const results = Object.values(combinedData)?.sort((a: IExtendedHotel, b: IExtendedHotel) => {
      if (!a.price && !b.price) {
        return 0; // if both don't have a price, keep their order unchanged
      } else if (!a.price) {
        return 1; // move items without a price to the end
      } else if (!b.price) {
        return -1; // keep items with a price at the beginning
      } else {
        return 0; // if both have a price, keep their order unchanged
      }
    });

    // update results
    yield put(
      setInformation({
        isLoading: false,
        hotels: hotels ?? [], // cache for next getInformationRequest()
        extendedHotels: results ?? [],
        currency: action.payload.currency ?? ECurrency.USD,
      }),
    );
  } catch (error) {
    console.log(error);
  }
}

function* getInformation() {
  yield takeLatest(GET_INFORMATION_REQUEST, getInformationRequest);
}

export default getInformation;
