import React from 'react';
import { Activity, CheckCircle, Clock3, MapPin, Navigation, Wallet } from 'lucide-react';
import MapPreview from './MapPreview';
import type { Ride } from '../types';
import { formatPngCurrency } from '../lib/rides';

interface DriverViewProps {
  rides: Ride[];
  onAcceptRide: (rideId: string) => void;
}

const DriverView: React.FC<DriverViewProps> = ({ rides, onAcceptRide }) => {
  const pendingRides = rides.filter((ride) => ride.status === 'pending');
  const acceptedRides = rides.filter((ride) => ride.status === 'accepted');
  const totalOpenValue = pendingRides.reduce((total, ride) => total + ride.price, 0);
  const priorityRide = pendingRides[0] ?? acceptedRides[0];
  const topPickup =
    pendingRides.length > 0
      ? Object.entries(
          pendingRides.reduce<Record<string, number>>((counts, ride) => {
            counts[ride.pickup] = (counts[ride.pickup] ?? 0) + 1;
            return counts;
          }, {})
        ).sort((left, right) => right[1] - left[1])[0]?.[0]
      : 'Balanced demand';

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
      <div>
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Driver Dispatch Board</h2>
            <p className="text-sm text-gray-500">Review open FALEX ride requests across Port Moresby.</p>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-amber-50 px-4 py-2 font-semibold text-amber-800">
              Pending: {pendingRides.length}
            </div>
            <div className="rounded-xl bg-emerald-50 px-4 py-2 font-semibold text-emerald-800">
              Accepted: {acceptedRides.length}
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              <Activity size={14} />
              Hot pickup
            </div>
            <p className="mt-3 text-lg font-bold text-slate-900">{topPickup}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              <Wallet size={14} />
              Open value
            </div>
            <p className="mt-3 text-lg font-bold text-slate-900">{formatPngCurrency(totalOpenValue)}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              <Clock3 size={14} />
              Avg arrival
            </div>
            <p className="mt-3 text-lg font-bold text-slate-900">
              {pendingRides.length > 0
                ? `${Math.round(
                    pendingRides.reduce((total, ride) => total + ride.pickupEtaMinutes, 0) /
                      pendingRides.length
                  )} min`
                : '0 min'}
            </p>
          </div>
        </div>

        {pendingRides.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <p className="font-medium text-gray-500">No ride requests at the moment. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRides.map((ride) => (
              <div
                key={ride.id}
                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <MapPin className="text-green-600" size={18} />
                        <div className="my-1 h-4 w-0.5 bg-gray-200" />
                        <Navigation className="text-red-600" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{ride.pickup}</p>
                        <p className="mt-3 text-sm font-semibold text-gray-800">{ride.destination}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{ride.tierName}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">
                        Pickup ETA {ride.pickupEtaMinutes} min
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">
                        {ride.distanceKm.toFixed(1)} km
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{ride.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 md:border-t-0 md:pt-0 md:text-right">
                    <p className="text-xl font-bold text-gray-900">{formatPngCurrency(ride.price)}</p>
                    <p className="mt-1 text-sm text-slate-500">{ride.tripDurationMinutes} min trip</p>
                    <button
                      onClick={() => onAcceptRide(ride.id)}
                      aria-label={`Accept ride from ${ride.pickup} to ${ride.destination}`}
                      className="mt-3 inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-2 font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
                    >
                      <CheckCircle size={18} />
                      <span>Accept Ride</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {acceptedRides.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800">Accepted rides</h3>
            <div className="mt-3 grid gap-3">
              {acceptedRides.map((ride) => (
                <div
                  key={ride.id}
                  className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {ride.pickup} to {ride.destination}
                      </p>
                      <p className="mt-1 text-emerald-700">
                        Driver ETA {ride.driver?.etaMinutes ?? ride.pickupEtaMinutes} min ·{' '}
                        {ride.driver?.vehicle ?? 'Vehicle assigned'}
                      </p>
                      {ride.driver ? (
                        <p className="mt-1 text-emerald-700">
                          {ride.driver.name} · {ride.driver.plate}
                        </p>
                      ) : null}
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                      Accepted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-6">
        {priorityRide ? (
          <MapPreview
            pickup={priorityRide.pickup}
            destination={priorityRide.destination}
            distanceKm={priorityRide.distanceKm}
            tripDurationMinutes={priorityRide.tripDurationMinutes}
            title="Dispatch map"
            subtitle={`Monitor the highest-priority route between ${priorityRide.pickup} and ${priorityRide.destination}.`}
            badge={priorityRide.tierName}
          />
        ) : (
          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
            <p className="text-lg font-bold">Dispatch map idle</p>
            <p className="mt-2 text-sm text-slate-300">
              New ride requests will appear here with live route context.
            </p>
          </div>
        )}

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Driver cues
          </p>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="flex items-start justify-between gap-3">
              <span>Priority demand zone</span>
              <span className="font-semibold text-slate-900">{topPickup}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span>Pending route count</span>
              <span className="font-semibold text-slate-900">{pendingRides.length}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span>Accepted route count</span>
              <span className="font-semibold text-slate-900">{acceptedRides.length}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span>Potential revenue</span>
              <span className="font-semibold text-slate-900">{formatPngCurrency(totalOpenValue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverView;
