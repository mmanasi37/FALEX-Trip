import { useState } from 'react';
import type { Role, Ride } from './types';
import RiderView from './components/RiderView';
import DriverView from './components/DriverView';
import { User, Car } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const [role, setRole] = useState<Role>('rider');
  const [rides, setRides] = useState<Ride[]>([]);

  const handleRequestRide = (pickup: string, destination: string, price: number) => {
    const newRide: Ride = {
      id: Math.random().toString(36).substring(7),
      riderId: 'rider-1',
      pickup,
      destination,
      price,
      status: 'pending',
    };
    setRides([...rides, newRide]);
  };

  const handleAcceptRide = (rideId: string) => {
    setRides(
      rides.map((r) =>
        r.id === rideId ? { ...r, status: 'accepted', driverId: 'driver-1' } : r
      )
    );
  };

  const activeRiderRide = rides.find(
    (r) => r.riderId === 'rider-1' && (r.status === 'pending' || r.status === 'accepted')
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black italic tracking-tighter text-black">
            UBER <span className="text-blue-600 not-italic">PNG</span>
          </h1>

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

      <main className="max-w-4xl mx-auto px-4">
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
        <p>© 2026 Uber PNG - Serving Port Moresby</p>
      </footer>
    </div>
  );
}

export default App;
