import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { expect, test } from 'vitest';

test('renders Uber PNG header', () => {
  render(<App />);
  const headerElement = screen.getByText(/UBER/i, { selector: 'h1' });
  expect(headerElement).toBeInTheDocument();
  const pngElement = screen.getByText(/PNG/i, { selector: 'span' });
  expect(pngElement).toBeInTheDocument();
});

test('can switch to driver role', async () => {
  render(<App />);
  const driverButton = screen.getByRole('button', { name: /driver/i });
  fireEvent.click(driverButton);
  const driverHeader = screen.getByText(/Available Rides in Port Moresby/i);
  expect(driverHeader).toBeInTheDocument();
});
