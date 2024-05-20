import { ICompetitor } from './price';

export interface IHotel {
  id: number;
  name: string;
  rating: number;
  stars: number;
  address: string;
  photo: string;
  description: string;
}

export interface IExtendedHotel {
  id: number;
  name: string;
  rating: number;
  stars: number;
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
