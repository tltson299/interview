import { IExtendedHotel } from 'interfaces/hotel';
import { Fragment, memo, useState } from 'react';
import { useAppSelector } from 'redux/hook';
import { IRootState } from 'redux/reducers';
import classes from './styles.module.scss';
import { AddressIcon, InfoIcon, PlaceholderImage, StarIcon } from 'assets';
import { Button, Dialog, Skeleton, Tooltip } from '@mui/material';
import CurrencyService from 'services/currency_service';
import { ICompetitor } from 'interfaces/price';
import { EStar } from 'configs/enums';

const SKELETON_COUNT = 5;

const checkSaving = (currentPrice: number, competitors: ICompetitor) => {
  if (competitors) {
    const maxPrice = Math.max(...Object.values(competitors));
    if (currentPrice < maxPrice) {
      const saving = Math.round((1 - currentPrice / maxPrice) * 100);
      return saving ? <p className={classes.saving}>(Save {saving}%)</p> : null;
    }
  }
  return null;
};

const renderStars = (stars: EStar) => {
  switch (stars) {
    case EStar.ONE:
      return (
        <div className={classes.stars}>
          <StarIcon />
        </div>
      );
    case EStar.TWO:
      return (
        <div className={classes.stars}>
          <StarIcon />
          <StarIcon />
        </div>
      );
    case EStar.THREE:
      return (
        <div className={classes.stars}>
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </div>
      );
    case EStar.FOUR:
      return (
        <div className={classes.stars}>
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </div>
      );
    case EStar.FIVE:
      return (
        <div className={classes.stars}>
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </div>
      );
    default:
      return null;
  }
};

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = memo((props: HomePageProps) => {
  const information = useAppSelector((state: IRootState) => state.information);

  const [hotelModal, setHotelModal] = useState<{ isOpen: boolean; data: IExtendedHotel }>({ isOpen: false, data: null });

  return (
    <Fragment>
      <div className={classes.hotelList}>
        {!information?.isLoading
          ? information?.extendedHotels?.map((hotel: IExtendedHotel, hotelIndex: number) => {
              return (
                <div key={`hotel-${hotelIndex}`} className={classes.hotel} onClick={() => setHotelModal({ isOpen: true, data: hotel })}>
                  <div className={classes.left}>
                    <img src={hotel.photo ?? PlaceholderImage} alt={hotel.name ?? 'N/A'} />
                  </div>

                  <div className={classes.right}>
                    <div className={classes.rightTop}>
                      <div className={classes.rightTopLeft}>
                        <p className={classes.title}>{hotel.name ?? 'N/A'}</p>
                        {renderStars(hotel.stars)}
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
          : [...Array(SKELETON_COUNT).keys()].map((index: number) => (
              <Skeleton key={`skeleton-${index}`} variant="rectangular" width="100%" height={226} />
            ))}
      </div>

      <Dialog className={classes.hotelModal} open={hotelModal?.isOpen} onClose={() => setHotelModal({ isOpen: false, data: null })}>
        <div className={classes.image}>
          <img src={hotelModal?.data?.photo ?? PlaceholderImage} alt={hotelModal?.data?.name ?? 'N/A'} />
        </div>

        <div className={classes.name}>{hotelModal?.data?.name ?? 'N/A'}</div>

        {renderStars(hotelModal?.data?.stars)}

        <div className={classes.highlight}>
          {hotelModal?.data?.price != null ? (
            <Fragment>
              {hotelModal?.data?.taxes_and_fees ? (
                <Tooltip title="This price is tax-inclusive." arrow>
                  <div className={classes.price}>
                    {CurrencyService.formatPrice(information.currency, hotelModal?.data?.price)}*
                    {checkSaving(hotelModal?.data?.price, hotelModal?.data?.competitors)}
                  </div>
                </Tooltip>
              ) : (
                <div className={classes.price}>
                  {CurrencyService.formatPrice(information.currency, hotelModal?.data?.price)}
                  {checkSaving(hotelModal?.data?.price, hotelModal?.data?.competitors)}
                </div>
              )}
              <div className={classes.divider} />
              <div className={classes.rating}>{hotelModal?.data?.rating ?? 'N/A'}</div>
              <div className={classes.divider} />
              <Button className={classes.bookButton} variant="contained">
                Book Now
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <div className={classes.rating}>{hotelModal?.data?.rating ?? 'N/A'}</div>
              <div className={classes.divider} />
              <div className={classes.priceUnavailable}>Rate unavailable!</div>
            </Fragment>
          )}
        </div>

        <div className={classes.hr} />

        <div className={classes.info}>
          <div className={classes.address}>
            <AddressIcon />
            <p>{hotelModal?.data?.address ?? 'N/A'}</p>
          </div>
          <div className={classes.description}>
            <InfoIcon />
            <div dangerouslySetInnerHTML={{ __html: hotelModal?.data?.description }} />
          </div>
        </div>

        <div className={classes.hr} />

        {hotelModal?.data?.competitors && hotelModal?.data?.price ? (
          <div className={classes.competitorList}>
            {/* show in the competitor pricing list our rates and where we stand in the ordering of cheapest to most expensive */}
            {Object.entries({ ...hotelModal?.data?.competitors, Ascenda: hotelModal?.data?.price })
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

                    {name === 'Ascenda' && hotelModal?.data?.taxes_and_fees ? (
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
        ) : null}
      </Dialog>
    </Fragment>
  );
});

export default HomePage;
