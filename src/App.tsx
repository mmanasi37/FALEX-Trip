import { useState } from 'react';
import type { Ride, RideRequestInput, Role } from './types';
import RiderView from './components/RiderView';
import DriverView from './components/DriverView';
import { User, Car } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { assignDriver, createRideId, estimateRideDetails, getRideOption } from './lib/rides';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const [role, setRole] = useState<Role>('rider');
  const [rides, setRides] = useState<Ride[]>([]);

  const handleRequestRide = ({ pickup, destination, tierId, paymentMethod }: RideRequestInput) => {
    const option = getRideOption(tierId);
    const quote = estimateRideDetails(pickup, destination, tierId);
    const newRide: Ride = {
      id: createRideId(),
      riderId: 'rider-1',
      pickup,
      destination,
      tierId,
      tierName: option.name,
      price: quote.total,
      distanceKm: quote.distanceKm,
      pickupEtaMinutes: quote.pickupEtaMinutes,
      tripDurationMinutes: quote.tripDurationMinutes,
      paymentMethod,
      fareBreakdown: quote.fareBreakdown,
      status: 'pending',
    };
    setRides((currentRides) => [...currentRides, newRide]);
  };

  const handleAcceptRide = (rideId: string) => {
    setRides((currentRides) =>
      currentRides.map((r) => {
        if (r.id !== rideId) {
          return r;
        }

        const driver = assignDriver(r);
        return { ...r, status: 'accepted', driverId: driver.id, driver };
      })
    );
  };

  const activeRiderRide = rides.find(
    (r) => r.riderId === 'rider-1' && (r.status === 'pending' || r.status === 'accepted')
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-black">
              FALEX <span className="text-blue-600">RIDE</span>
            </h1>
            <p className="text-xs text-gray-500">Port Moresby urban ride requests</p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setRole('rider')}
              className={cn(
                "px-4 py-1.5 rounded-lg flex items-center space-x-2 transition-all",
                role === 'rider' ? "bg-white shadow-sm text-blue-600 font-bold" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <User size={18} />
              <span>Rider</span>
            </button>
            <button
              onClick={() => setRole('driver')}
              className={cn(
                "px-4 py-1.5 rounded-lg flex items-center space-x-2 transition-all",
                role === 'driver' ? "bg-white shadow-sm text-blue-600 font-bold" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Car size={18} />
              <span>Driver</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        {role === 'rider' ? (
          <RiderView
            onRequestRide={handleRequestRide}
            activeRide={activeRiderRide}
          />
        ) : (
          <DriverView
            rides={rides}
            onAcceptRide={handleAcceptRide}
          />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 text-center text-xs text-gray-400">
        <p>© 2026 FALEX - Serving Port Moresby</p>
      </footer>
    </div>
  );
}

export default App;
