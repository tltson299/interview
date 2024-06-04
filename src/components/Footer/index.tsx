import { memo } from 'react';
import classes from './styles.module.scss';
import { Container } from '@mui/material';

interface FooterProps {}

const Footer: React.FC<FooterProps> = memo((props: FooterProps) => {
  return (
    <div className={classes.footer}>
      <Container className={classes.container} maxWidth={false}>
        <p>© 2024 Ascenda Loyalty</p>
      </Container>
    </div>
  );
});

export default Footer;
