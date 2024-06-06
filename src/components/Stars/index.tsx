import { memo } from 'react';
import classes from './styles.module.scss';
import { EStar } from 'configs/enums';
import { StarIcon } from 'assets';

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

interface StarsProps {
  stars: EStar;
}

const Stars: React.FC<StarsProps> = memo((props: StarsProps) => {
  const { stars } = props;

  return renderStars(stars);
});

export default Stars;
