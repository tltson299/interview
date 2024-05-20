import numeral from 'numeral';
import { ECurrency } from 'configs/enums';
import { IHotelPrice } from 'interfaces/price';

const nearestDollarsCountries = [ECurrency.USD, ECurrency.SGD, ECurrency.CNY];
const nearest100DollarsCountries = [ECurrency.KRW];

const getCurrency = () => {
  return (localStorage.getItem('currency')?.toUpperCase() ?? ECurrency.USD) as ECurrency;
};

const setCurrency = (currency: ECurrency) => {
  localStorage.setItem('currency', currency);
};

const nearestDollars = (hotelPrice: IHotelPrice) => {
  hotelPrice.price = Math.round(hotelPrice.price);
  if (hotelPrice.competitors) {
    for (const competitor in hotelPrice.competitors) {
      hotelPrice.competitors[competitor] = Math.round(hotelPrice.competitors[competitor]);
    }
  }
  if (hotelPrice.taxes_and_fees) {
    hotelPrice.taxes_and_fees.tax = Math.round(hotelPrice.taxes_and_fees.tax);
    hotelPrice.taxes_and_fees.hotel_fees = Math.round(hotelPrice.taxes_and_fees.hotel_fees);
  }
  return hotelPrice;
};

const nearest100Dollars = (hotelPrice: IHotelPrice) => {
  hotelPrice.price = Math.round(hotelPrice.price / 100) * 100;
  if (hotelPrice.competitors) {
    for (const competitor in hotelPrice.competitors) {
      hotelPrice.competitors[competitor] = Math.round(hotelPrice.competitors[competitor] / 100) * 100;
    }
  }
  if (hotelPrice.taxes_and_fees) {
    hotelPrice.taxes_and_fees.tax = Math.round(hotelPrice.taxes_and_fees.tax / 100) * 100;
    hotelPrice.taxes_and_fees.hotel_fees = Math.round(hotelPrice.taxes_and_fees.hotel_fees / 100) * 100;
  }
  return hotelPrice;
};

const roundHotelPrices = (currency: ECurrency, hotelPrices: IHotelPrice[]) => {
  if (nearestDollarsCountries.includes(currency)) {
    return hotelPrices.map((hotelPrice: IHotelPrice) => nearestDollars(hotelPrice));
  } else if (nearest100DollarsCountries.includes(currency)) {
    return hotelPrices.map((hotelPrice: IHotelPrice) => nearest100Dollars(hotelPrice));
  } else {
    return hotelPrices;
  }
};

const getCurrencySymbol = (currency: ECurrency) => {
  switch (currency) {
    case ECurrency.USD:
      return '$';
    case ECurrency.SGD:
      return 'S$';
    case ECurrency.CNY:
      return '¥';
    case ECurrency.KRW:
      return '₩';
    default:
      return '$';
  }
};

const formatPrice = (currency: ECurrency, number: number) => {
  return `${getCurrencySymbol(currency)}${numeral(number).format('0,0')}`;
};

const CurrencyService = {
  getCurrency,
  setCurrency,
  roundHotelPrices,
  formatPrice,
};

export default CurrencyService;
