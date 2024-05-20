import { memo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import classes from './styles.module.scss';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { IRootState } from 'redux/reducers';
import { getInformationRequest } from 'redux/reducers/information/actionTypes';

interface PublicLayoutProps {}

const PublicLayout: React.FC<PublicLayoutProps> = memo((props: PublicLayoutProps) => {
  const dispatch = useAppDispatch();

  const information = useAppSelector((state: IRootState) => state.information);

  useEffect(() => {
    if (!information.isLoading) {
      if (!information.hotels) {
        dispatch(getInformationRequest(information));
      }
    }
  }, [information]);

  return (
    <div className={classes.publicLayout}>
      <Header />

      <Container className={classes.container}>
        <Outlet />
      </Container>

      <Footer />
    </div>
  );
});

export default PublicLayout;
