import { RouteObject } from 'react-router-dom';
import HomePage from 'pages/Home';
import PublicLayout from 'components/Layouts/PublicLayout';
import AppRoutes from './routes';

const routeObject: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: AppRoutes.public.home,
        element: <HomePage />,
      },
    ],
  },
];

export default routeObject;
