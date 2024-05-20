export interface IHotelPrice {
  id: number;
  price: number;
  competitors?: ICompetitor;
  taxes_and_fees?: {
    tax: number;
    hotel_fees: number;
  };
}

export interface ICompetitor {
  [key: string]: number;
}
