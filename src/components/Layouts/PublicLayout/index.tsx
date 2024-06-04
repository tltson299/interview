import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import classes from './styles.module.scss';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { Container } from '@mui/material';

interface PublicLayoutProps {}

const PublicLayout: React.FC<PublicLayoutProps> = memo((props: PublicLayoutProps) => {
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
