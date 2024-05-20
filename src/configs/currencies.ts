import { ICurrency } from 'interfaces/currency';
import { ECurrency } from './enums';

const currencyList: ICurrency[] = [
  {
    value: ECurrency.USD,
    label: ECurrency.USD,
    flagCode: 'us',
  },
  {
    value: ECurrency.SGD,
    label: ECurrency.SGD,
    flagCode: 'sg',
  },
  {
    value: ECurrency.CNY,
    label: ECurrency.CNY,
    flagCode: 'cn',
  },
  {
    value: ECurrency.KRW,
    label: ECurrency.KRW,
    flagCode: 'kr',
  },
];

export default currencyList;
