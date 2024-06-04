import { memo } from 'react';
import classes from './styles.module.scss';
import { Container, FormControl, InputLabel } from '@mui/material';
import { DefaultLogo } from 'assets';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { IRootState } from 'redux/reducers';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ECurrency } from 'configs/enums';
import { ICurrency } from 'interfaces/currency';
import currencyList from 'configs/currencies';
import { Link, useNavigate } from 'react-router-dom';
import AppRoutes from 'routers/routes';
import { getInformationRequest } from 'redux/reducers/information/actionTypes';
import CurrencyService from 'services/currency_service';

interface HeaderProps {}

const Header = memo((props: HeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const information = useAppSelector((state: IRootState) => state.information);

  const onChangeCurrency = (event: SelectChangeEvent) => {
    const newCurrency = (event?.target?.value ?? ECurrency.USD) as ECurrency;

    // navigate to new URL
    navigate({ pathname: AppRoutes.public.home, search: `&currency=${newCurrency}` });
    // save currency to local storage
    CurrencyService.setCurrency(newCurrency);
    // get new currency prices
    dispatch(getInformationRequest({ ...information, currency: newCurrency }));
  };

  return (
    <div className={classes.header}>
      <Container className={classes.container} maxWidth={false}>
        <Link to={AppRoutes.public.home}>
          <DefaultLogo />
        </Link>

        <FormControl className={classes.currencySelect} sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="currency">Currency</InputLabel>
          <Select labelId="currency" value={information.currency} onChange={onChangeCurrency} label="Currency">
            {currencyList?.map((currency: ICurrency, currencyIndex: number) => {
              return currency?.label && currency?.value ? (
                <MenuItem key={`currency-${currencyIndex}`} className={classes.menuItem} value={currency.value}>
                  <span className={`fi fi-${currency?.flagCode}`} />
                  <span>{currency.label}</span>
                </MenuItem>
              ) : null;
            })}
          </Select>
        </FormControl>
      </Container>
    </div>
  );
});

export default Header;
