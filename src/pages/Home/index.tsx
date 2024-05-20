import { IExtendedHotel } from 'interfaces/hotel';
import { Fragment, memo } from 'react';
import { useAppSelector } from 'redux/hook';
import { IRootState } from 'redux/reducers';
import classes from './styles.module.scss';
import { AddressIcon, InfoIcon, PlaceholderImage, StarIcon } from 'assets';
import { Button, Skeleton, Tooltip } from '@mui/material';
import CurrencyService from 'services/currency_service';
import { ICompetitor } from 'interfaces/price';

const SKELETON_COUNT = 5;

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = memo((props: HomePageProps) => {
  const information = useAppSelector((state: IRootState) => state.information);

  const checkSaving = (currentPrice: number, competitors: ICompetitor) => {
    if (competitors) {
      const maxPrice = Math.max(...Object.values(competitors));
      const saving = Math.round((1 - currentPrice / maxPrice) * 100);
      return saving ? <p className={classes.saving}>(Save {saving}%)</p> : null;
    }
    return null;
  };

  return (
    <div className={classes.hotelList}>
      {!information?.isLoading
        ? information?.extendedHotels?.map((hotel: IExtendedHotel, hotelIndex: number) => {
            return (
              <div key={`hotel-${hotelIndex}`} className={classes.hotel}>
                <div className={classes.left}>
                  <img src={hotel.photo ?? PlaceholderImage} alt={hotel.name ?? 'N/A'} />
                </div>

                <div className={classes.right}>
                  <div className={classes.rightTop}>
                    <div className={classes.rightTopLeft}>
                      <p className={classes.title}>{hotel.name ?? 'N/A'}</p>
                      <div className={classes.stars}>
                        {[...Array(hotel.stars ?? 0).keys()].map((index: number) => (
                          <StarIcon key={`star-${index}`} />
                        ))}
                      </div>
                    </div>

                    <div className={classes.rightTopRight}>
                      {hotel.price != null ? (
                        <Fragment>
                          {hotel.taxes_and_fees ? (
                            <Tooltip title="This price is tax-inclusive." arrow>
                              <div className={classes.price}>
                                {CurrencyService.formatPrice(information.currency, hotel.price)}*{checkSaving(hotel.price, hotel.competitors)}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className={classes.price}>
                              {CurrencyService.formatPrice(information.currency, hotel.price)}
                              {checkSaving(hotel.price, hotel.competitors)}
                            </div>
                          )}
                          <div className={classes.divider} />
                          <div className={classes.rating}>{hotel.rating ?? 'N/A'}</div>
                          <div className={classes.divider} />
                          <Button className={classes.bookButton} variant="contained">
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
                                  <Tooltip title="This price is tax-inclusive." arrow>
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
          })
        : [...Array(SKELETON_COUNT).keys()].map((index: number) => <Skeleton key={`skeleton-${index}`} variant="rectangular" width="100%" height={226} />)}
    </div>
  );
});

export default HomePage;
