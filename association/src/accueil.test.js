import { render, screen } from '@testing-library/react';
import Accueil from './accueil';

test('renders learn react link', () => {
  render(<Accueil />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
