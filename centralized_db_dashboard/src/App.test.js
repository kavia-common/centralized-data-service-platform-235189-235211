import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login header on unauthenticated load', () => {
  render(<App />);
  const title = screen.getByText(/operator login/i);
  expect(title).toBeInTheDocument();
});
