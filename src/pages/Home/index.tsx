import { IExtendedHotel, IHotelModal } from 'interfaces/hotel';
import { Fragment, memo, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { IRootState } from 'redux/reducers';
import classes from './styles.module.scss';
import { Skeleton } from '@mui/material';
import CurrencyService from 'services/currency_service';
import { ECurrency } from 'configs/enums';
import QueryString from 'qs';
import { getInformationRequest } from 'redux/reducers/information/actionTypes';
import Hotel from './components/Hotel';
import HotelModal from './components/HotelModal';

const SKELETON_COUNT = 5;

interface IHomepageQuery {
  currency?: ECurrency;
}

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = memo((props: HomePageProps) => {
  const dispatch = useAppDispatch();

  const { currency }: IHomepageQuery = QueryString.parse(window?.location?.search, { ignoreQueryPrefix: true });

  const information = useAppSelector((state: IRootState) => state.information);

  const [hotelModal, setHotelModal] = useState<IHotelModal>({ isOpen: false, hotel: null });

  useEffect(() => {
    if (!information.isLoading && !information.hotels) {
      if (Object.values(ECurrency).includes(currency)) {
        CurrencyService.setCurrency(currency);
        dispatch(getInformationRequest({ ...information, currency }));
      } else {
        dispatch(getInformationRequest({ ...information, currency: CurrencyService.getCurrency() }));
      }
    }
  }, [information, currency]);

  const onClickHotel = (hotel: IExtendedHotel) => {
    setHotelModal({ isOpen: true, hotel });
  };

  const onCloseHotelModal = () => {
    setHotelModal({ isOpen: false, hotel: null });
  };

  return (
    <Fragment>
      <div className={classes.hotelList}>
        {!information?.isLoading
          ? information?.extendedHotels?.map((hotel: IExtendedHotel, hotelIndex: number) => {
              return <Hotel key={`hotel-${hotelIndex}`} hotel={hotel} onClick={() => onClickHotel(hotel)} />;
            })
          : [...Array(SKELETON_COUNT).keys()].map((index: number) => (
              <Skeleton key={`skeleton-${index}`} variant="rectangular" width="100%" height={226} />
            ))}
      </div>

      <HotelModal isOpen={hotelModal?.isOpen} hotel={hotelModal?.hotel} onClose={onCloseHotelModal} />
    </Fragment>
  );
});

export default HomePage;
