import { Fragment, memo } from 'react';
import classes from './styles.module.scss';
import { useAppSelector } from 'redux/hook';
import { IRootState } from 'redux/reducers';
import CurrencyService from 'services/currency_service';
import { IExtendedHotel } from 'interfaces/hotel';
import { AddressIcon, InfoIcon, PlaceholderImage } from 'assets';
import Stars from 'components/Stars';
import { Button, Tooltip } from '@mui/material';

interface HotelProps {
  hotel: IExtendedHotel;
  onClick: () => void;
}

const Hotel: React.FC<HotelProps> = memo((props: HotelProps) => {
  const { hotel, onClick } = props;

  const information = useAppSelector((state: IRootState) => state.information);

  return (
    <div className={classes.hotel} onClick={onClick}>
      <div className={classes.left}>
        <img src={hotel.photo ?? PlaceholderImage} alt={hotel.name ?? 'N/A'} />
      </div>

      <div className={classes.right}>
        <div className={classes.rightTop}>
          <div className={classes.rightTopLeft}>
            <p className={classes.title}>{hotel.name ?? 'N/A'}</p>
            <Stars stars={hotel.stars} />
          </div>

          <div className={classes.rightTopRight}>
            {hotel.price != null ? (
              <Fragment>
                {hotel.taxes_and_fees ? (
                  <Tooltip
                    title={`This price is tax-inclusive - Tax: ${CurrencyService.formatPrice(information.currency, hotel.taxes_and_fees.tax)}, Hotel Fees: ${CurrencyService.formatPrice(information.currency, hotel.taxes_and_fees.hotel_fees)}`}
                    arrow
                  >
                    <div className={classes.price}>
                      {CurrencyService.formatPrice(information.currency, hotel.price)}*
                      {CurrencyService.calculateSaving(hotel.price, hotel.competitors) ? (
                        <p className={classes.saving}>(Save {CurrencyService.calculateSaving(hotel.price, hotel.competitors)}%)</p>
                      ) : null}
                    </div>
                  </Tooltip>
                ) : (
                  <div className={classes.price}>
                    {CurrencyService.formatPrice(information.currency, hotel.price)}
                    {CurrencyService.calculateSaving(hotel.price, hotel.competitors) ? (
                      <p className={classes.saving}>(Save {CurrencyService.calculateSaving(hotel.price, hotel.competitors)}%)</p>
                    ) : null}
                  </div>
                )}
                <div className={classes.divider} />
                <div className={classes.rating}>{hotel.rating ?? 'N/A'}</div>
                <div className={classes.divider} />
                <Button
                  className={classes.bookButton}
                  variant="contained"
                  onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => event.stopPropagation()}
                >
                  Book Now
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <div className={classes.rating}>{hotel.rating ?? 'N/A'}</div>
                <div className={classes.divider} />
                <div className={classes.priceUnavailable}>Rate unavailable!</div>
              </Fragment>
            )}
          </div>
        </div>

        <div className={classes.rightMiddle}>
          <div className={classes.address}>
            <AddressIcon />
            <p>{hotel.address ?? 'N/A'}</p>
          </div>
          <div className={classes.description}>
            <InfoIcon />
            <div dangerouslySetInnerHTML={{ __html: hotel.description }} />
          </div>
        </div>

        {hotel.competitors && hotel.price ? (
          <div className={classes.rightBottom}>
            <div className={classes.competitorList}>
              {/* show in the competitor pricing list our rates and where we stand in the ordering of cheapest to most expensive */}
              {Object.entries({ ...hotel.competitors, Ascenda: hotel.price })
                ?.sort((a: [name: string, price: number], b: [name: string, price: number]) => {
                  if (a[1] > b[1]) {
                    return 1;
                  } else if (a[1] < b[1]) {
                    return -1;
                  } else {
                    return 0;
                  }
                })
                ?.map(([name, price]: [name: string, price: number]) => {
                  return (
                    <div key={`competitor-${name}`} className={classes.competitor}>
                      <p className={classes.competitorName}>{name ?? 'N/A'}</p>
                      {name === 'Ascenda' && hotel.taxes_and_fees ? (
                        <Tooltip
                          title={`This price is tax-inclusive - Tax: ${CurrencyService.formatPrice(information.currency, hotel.taxes_and_fees.tax)}, Hotel Fees: ${CurrencyService.formatPrice(information.currency, hotel.taxes_and_fees.hotel_fees)}`}
                          arrow
                        >
                          <p>{CurrencyService.formatPrice(information.currency, price)}*</p>
                        </Tooltip>
                      ) : (
                        <p>{CurrencyService.formatPrice(information.currency, price)}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default Hotel;
