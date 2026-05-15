import React from 'react';
import type { Ride } from '../types';
import { MapPin, Navigation, CheckCircle } from 'lucide-react';

interface DriverViewProps {
  rides: Ride[];
  onAcceptRide: (rideId: string) => void;
}

const DriverView: React.FC<DriverViewProps> = ({ rides, onAcceptRide }) => {
  const pendingRides = rides.filter((r) => r.status === 'pending');

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Rides in Port Moresby</h2>

      {pendingRides.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
          <p className="text-gray-500 font-medium">No ride requests at the moment. Stay tuned!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingRides.map((ride) => (
            <div key={ride.id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center">
                    <MapPin className="text-green-600" size={18} />
                    <div className="w-0.5 h-4 bg-gray-200 my-1"></div>
                    <Navigation className="text-red-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{ride.pickup}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-3">{ride.destination}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                <p className="text-xl font-bold text-gray-900">PGK {ride.price.toFixed(2)}</p>
                <button
                  onClick={() => onAcceptRide(ride.id)}
                  aria-label={`Accept ride from ${ride.pickup} to ${ride.destination}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center space-x-2"
                >
                  <CheckCircle size={18} />
                  <span>Accept Ride</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverView;
