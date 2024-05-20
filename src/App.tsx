import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routeObject from 'routers';

interface AppProps {}

const App: React.FC<AppProps> = (props: AppProps) => {
  const routes = useRoutes(routeObject);

  return <Suspense>{routes}</Suspense>;
};

export default App;
