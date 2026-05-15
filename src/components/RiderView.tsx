import React, { useState } from 'react';
import {
  Banknote,
  Car,
  CreditCard,
  MapPin,
  Navigation,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react';
import MapPreview from './MapPreview';
import { LANDMARKS, PAYMENT_METHODS, RIDE_OPTIONS } from '../types';
import type { PaymentMethod, Ride, RideRequestInput, RideTierId } from '../types';
import { estimateRideDetails, estimateRidePrice, formatPngCurrency, getRideOption } from '../lib/rides';

interface RiderViewProps {
  onRequestRide: (request: RideRequestInput) => void;
  activeRide?: Ride;
}

const RiderView: React.FC<RiderViewProps> = ({ onRequestRide, activeRide }) => {
  const [pickup, setPickup] = useState(LANDMARKS[0].name);
  const [destination, setDestination] = useState(LANDMARKS[1].name);
  const [selectedTier, setSelectedTier] = useState<RideTierId>('falex-go');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [error, setError] = useState('');

  const selectedOption = getRideOption(selectedTier);
  const quote = estimateRideDetails(pickup, destination, selectedTier);
  const fareEstimate = estimateRidePrice(pickup, destination, selectedTier);

  const handleRequest = () => {
    if (pickup === destination) {
      setError('Pickup and destination cannot be the same.');
      return;
    }

    setError('');
    onRequestRide({
      pickup,
      destination,
      tierId: selectedTier,
      paymentMethod,
    });
  };

  const setQuickDestination = (name: string) => {
    if (name === pickup) {
      return;
    }

    setError('');
    setDestination(name);
  };

  if (activeRide) {
    return (
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <MapPreview
          pickup={activeRide.pickup}
          destination={activeRide.destination}
          distanceKm={activeRide.distanceKm}
          tripDurationMinutes={activeRide.tripDurationMinutes}
          title={activeRide.status === 'accepted' ? 'Driver en route' : 'Matching nearby drivers'}
          subtitle={
            activeRide.status === 'accepted'
              ? `${activeRide.driver?.name ?? 'Your driver'} is heading to pickup now.`
              : 'FALEX is matching the closest available driver for this route.'
          }
          badge={activeRide.tierName}
        />

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
                  Ride status
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {activeRide.status === 'accepted' ? 'Your FALEX is on the way' : 'Searching for a driver'}
                </h2>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                <Car size={22} />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Driver arrival</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {activeRide.driver?.etaMinutes ?? activeRide.pickupEtaMinutes} min
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Trip duration</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{activeRide.tripDurationMinutes} min</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Estimated fare</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {formatPngCurrency(activeRide.price)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 text-emerald-600" size={18} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Pickup</p>
                    <p className="mt-1 font-semibold text-emerald-950">{activeRide.pickup}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <Navigation className="mt-1 text-rose-600" size={18} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Destination</p>
                    <p className="mt-1 font-semibold text-rose-950">{activeRide.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Service and payment
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{activeRide.tierName}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {activeRide.paymentMethod}
                </span>
              </div>
            </div>

            {activeRide.driver ? (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Assigned driver
                    </p>
                    <p className="mt-1 text-lg font-bold text-blue-950">{activeRide.driver.name}</p>
                    <p className="text-sm text-blue-800">
                      {activeRide.driver.vehicle} · {activeRide.driver.plate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {activeRide.driver.rating.toFixed(1)}
                    </p>
                    <p className="mt-1 text-xs text-blue-800">
                      {activeRide.driver.tripsCompleted}+ completed trips
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">
                  FALEX is matching your route with the best nearby driver now.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">Plan your ride</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Where to?</h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose a route, compare FALEX ride tiers, and request instantly.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="pickup" className="mb-1 block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                id="pickup"
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  setError('');
                }}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {LANDMARKS.map((landmark) => (
                  <option key={landmark.id} value={landmark.name}>
                    {landmark.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="destination" className="mb-1 block text-sm font-medium text-gray-700">
              Destination
            </label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                id="destination"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setError('');
                }}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {LANDMARKS.map((landmark) => (
                  <option key={landmark.id} value={landmark.name}>
                    {landmark.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <p className="mb-2 flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Zap size={12} className="mr-1 fill-yellow-500 text-yellow-500" />
              Quick Destinations
            </p>
            <div className="grid grid-cols-2 gap-2">
              {LANDMARKS.filter((landmark) => landmark.name !== pickup)
                .slice(0, 4)
                .map((landmark) => (
                  <button
                    key={landmark.id}
                    onClick={() => setQuickDestination(landmark.name)}
                    aria-label={`Set destination to ${landmark.name}`}
                    className={`rounded-xl border p-2 text-left text-sm transition-all ${
                      destination === landmark.name
                        ? 'border-blue-500 bg-blue-50 font-medium text-blue-700'
                        : 'border-gray-100 bg-gray-50 text-gray-600 outline-none hover:border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-200'
                    }`}
                  >
                    <span className="block truncate">{landmark.name}</span>
                  </button>
                ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-800">Choose your ride</p>
            <div className="space-y-3">
              {RIDE_OPTIONS.map((option) => {
                const optionQuote = estimateRideDetails(pickup, destination, option.id);
                const isSelected = selectedTier === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedTier(option.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-slate-900">{option.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1">
                            {option.seats} seats
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1">
                            Pickup in {optionQuote.pickupEtaMinutes} min
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          {formatPngCurrency(optionQuote.total)}
                        </p>
                        <p className="text-xs text-slate-500">{optionQuote.tripDurationMinutes} min trip</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-800">Payment method</p>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method;
                const Icon = method === 'Card' ? CreditCard : Banknote;
                return (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={16} />
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Estimated fare
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{formatPngCurrency(fareEstimate)}</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Driver arrival</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{quote.pickupEtaMinutes} min</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Base fare</span>
                <span>{formatPngCurrency(quote.fareBreakdown.baseFare)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Distance charge</span>
                <span>{formatPngCurrency(quote.fareBreakdown.distanceFare)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Booking fee</span>
                <span>{formatPngCurrency(quote.fareBreakdown.bookingFee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Zone surcharge</span>
                <span>{formatPngCurrency(quote.fareBreakdown.zoneSurcharge)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Service level</span>
                <span>x{quote.fareBreakdown.serviceMultiplier.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error ? (
            <p role="alert" className="text-sm font-medium text-red-600" aria-live="polite">
              {error}
            </p>
          ) : null}

          <button
            onClick={handleRequest}
            className="mt-2 flex w-full items-center justify-center space-x-2 rounded-2xl bg-black px-4 py-4 font-bold text-white transition-all hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 active:scale-[0.98]"
          >
            <span>Request {selectedOption.name}</span>
          </button>

          <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <ShieldCheck size={16} />
            Live ETA, driver matching, and route preview are included in every FALEX ride.
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <MapPreview
          pickup={pickup}
          destination={destination}
          distanceKm={quote.distanceKm}
          tripDurationMinutes={quote.tripDurationMinutes}
          title="Smart route preview"
          subtitle={`FALEX is optimizing the route between ${pickup} and ${destination}.`}
          badge={selectedOption.name}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Route intelligence
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start justify-between gap-3">
                <span>Estimated distance</span>
                <span className="font-semibold text-slate-900">{quote.distanceKm.toFixed(1)} km</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span>Estimated trip time</span>
                <span className="font-semibold text-slate-900">{quote.tripDurationMinutes} min</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span>Vehicle arrival window</span>
                <span className="font-semibold text-slate-900">{quote.pickupEtaMinutes} min</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Service promise
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                Driver ratings displayed after dispatch
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-emerald-600" />
                Route and fare visible before you request
              </div>
              <div className="flex items-center gap-3">
                <CreditCard size={16} className="text-blue-600" />
                Card or cash payment support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderView;
