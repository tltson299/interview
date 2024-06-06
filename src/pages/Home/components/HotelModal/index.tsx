import { Fragment, memo } from 'react';
import classes from './styles.module.scss';
import { Button, Dialog, Tooltip } from '@mui/material';
import { AddressIcon, CloseIcon, InfoIcon, PlaceholderImage } from 'assets';
import Stars from 'components/Stars';
import CurrencyService from 'services/currency_service';
import { useAppSelector } from 'redux/hook';
import { IRootState } from 'redux/reducers';
import { IHotelModal } from 'interfaces/hotel';
import clsx from 'clsx';

interface HotelModalProps extends IHotelModal {
  onClose: () => void;
}

const HotelModal: React.FC<HotelModalProps> = memo((props: HotelModalProps) => {
  const { isOpen, hotel, onClose } = props;

  const information = useAppSelector((state: IRootState) => state.information);

  return (
    <Dialog className={classes.hotelModal} open={isOpen} onClose={onClose} transitionDuration={{ enter: 200, exit: 30 }}>
      <CloseIcon className={classes.closeIcon} onClick={onClose} />

      <div className={classes.image}>
        <img src={hotel?.photo ?? PlaceholderImage} alt={hotel?.name ?? 'N/A'} />
      </div>

      <div className={classes.name}>{hotel?.name ?? 'N/A'}</div>

      <Stars stars={hotel?.stars} />

      <div className={classes.highlight}>
        {hotel?.price != null ? (
          <Fragment>
            {hotel?.taxes_and_fees ? (
              <Tooltip
                title={`This price is tax-inclusive - Tax: ${CurrencyService.formatPrice(information.currency, hotel.taxes_and_fees.tax)}, Hotel Fees: ${CurrencyService.formatPrice(information.currency, hotel.taxes_and_fees.hotel_fees)}`}
                arrow
              >
                <div className={classes.price}>
                  {CurrencyService.formatPrice(information.currency, hotel?.price)}*
                  {CurrencyService.calculateSaving(hotel?.price, hotel?.competitors) ? (
                    <p className={classes.saving}>(Save {CurrencyService.calculateSaving(hotel?.price, hotel?.competitors)}%)</p>
                  ) : null}
                </div>
              </Tooltip>
            ) : (
              <div className={classes.price}>
                {CurrencyService.formatPrice(information.currency, hotel?.price)}
                {CurrencyService.calculateSaving(hotel?.price, hotel?.competitors) ? (
                  <p className={classes.saving}>(Save {CurrencyService.calculateSaving(hotel?.price, hotel?.competitors)}%)</p>
                ) : null}
              </div>
            )}
            <div className={classes.divider} />
            <div className={classes.rating}>{hotel?.rating ?? 'N/A'}</div>
            <div className={classes.divider} />
            <Button className={classes.bookButton} variant="contained">
              Book Now
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <div className={classes.rating}>{hotel?.rating ?? 'N/A'}</div>
            <div className={classes.divider} />
            <div className={classes.priceUnavailable}>Rate unavailable!</div>
          </Fragment>
        )}
      </div>

      <div className={classes.hr} />

      <div className={clsx(classes.info, { [classes.noCompetitors]: !hotel?.competitors || !hotel?.price })}>
        <div className={classes.address}>
          <AddressIcon />
          <p>{hotel?.address ?? 'N/A'}</p>
        </div>
        <div className={classes.description}>
          <InfoIcon />
          <div dangerouslySetInnerHTML={{ __html: hotel?.description }} />
        </div>
      </div>

      {hotel?.competitors && hotel?.price ? (
        <Fragment>
          <div className={classes.hr} />
          <div className={classes.competitorList}>
            {/* show in the competitor pricing list our rates and where we stand in the ordering of cheapest to most expensive */}
            {Object.entries({ ...hotel?.competitors, Ascenda: hotel?.price })
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
                    {name === 'Ascenda' && hotel?.taxes_and_fees ? (
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
        </Fragment>
      ) : null}
    </Dialog>
  );
});

export default HotelModal;
