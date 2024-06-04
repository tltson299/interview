import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import PublicLayout from 'components/Layouts/PublicLayout';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppRoutes from 'routers/routes';

jest.mock('components/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    Outlet: () => <div data-testid="outlet">Outlet</div>,
  };
});
jest.mock('components/Footer', () => () => <div data-testid="footer">Footer</div>);

describe('PublicLayout', () => {
  test('should render Header, Outlet, and Footer', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={[AppRoutes.public.home]}>
        <Routes>
          <Route path={AppRoutes.public.home} element={<PublicLayout />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('outlet')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });
});
