import { EStar } from 'configs/enums';
import { ICompetitor } from './price';

export interface IHotel {
  id: number;
  name: string;
  rating: number;
  stars: EStar;
  address: string;
  photo: string;
  description: string;
}

export interface IExtendedHotel {
  id: number;
  name: string;
  rating: number;
  stars: EStar;
  address: string;
  photo: string;
  description: string;

  price?: number;
  competitors?: ICompetitor;
  taxes_and_fees?: {
    tax: number;
    hotel_fees: number;
  };
}

export interface IHotelModal {
  isOpen: boolean;
  hotel: IExtendedHotel;
}
