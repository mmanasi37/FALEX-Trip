import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { expect, test } from 'vitest';

test('renders FALEX Ride header', () => {
  render(<App />);
  const headerElement = screen.getByText(/FALEX/i, { selector: 'h1' });
  expect(headerElement).toBeInTheDocument();
  expect(screen.getByText(/Port Moresby urban ride requests/i)).toBeInTheDocument();
});

test('can switch to driver role', async () => {
  render(<App />);
  const driverButton = screen.getAllByRole('button', { name: /driver/i })[0];
  fireEvent.click(driverButton);
  const driverHeader = screen.getByText(/Driver Dispatch Board/i);
  expect(driverHeader).toBeInTheDocument();
});

test('shows ride tiers and a live route map on the rider screen', () => {
  render(<App />);

  expect(screen.getAllByText(/FALEX Go/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/FALEX Comfort/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/FALEX XL/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Live route map/i)).toBeInTheDocument();
});

test('shows inline validation when pickup and destination match', () => {
  render(<App />);

  fireEvent.change(screen.getByRole('combobox', { name: /Destination/i }), {
    target: { value: 'Vision City Mega Mall' },
  });
  fireEvent.click(screen.getByRole('button', { name: /request falex go/i }));

  expect(screen.getByRole('alert')).toHaveTextContent(/cannot be the same/i);
});

test('creates an active ride with a fare estimate', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /request falex go/i }));

  expect(screen.getByRole('heading', { name: /your falex is on the way|searching for a driver/i })).toBeInTheDocument();
  expect(screen.getByText(/PGK/i)).toBeInTheDocument();
});

test('accepting a ride shows assigned driver details', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /request falex go/i }));
  fireEvent.click(screen.getAllByRole('button', { name: /driver/i })[0]);
  fireEvent.click(screen.getByRole('button', { name: /accept ride/i }));

  expect(screen.getByText(/Accepted rides/i)).toBeInTheDocument();
  expect(screen.getByText(/Driver ETA/i)).toBeInTheDocument();
});
