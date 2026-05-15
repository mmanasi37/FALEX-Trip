import React, { useState } from 'react';
import { LANDMARKS } from '../types';
import type { Ride } from '../types';
import { MapPin, Navigation, Car, Zap } from 'lucide-react';

interface RiderViewProps {
  onRequestRide: (pickup: string, destination: string, price: number) => void;
  activeRide?: Ride;
}

const RiderView: React.FC<RiderViewProps> = ({ onRequestRide, activeRide }) => {
  const [pickup, setPickup] = useState(LANDMARKS[0].name);
  const [destination, setDestination] = useState(LANDMARKS[1].name);

  const calculatePrice = () => {
    // Simple mock price calculation
    return 25 + Math.floor(Math.random() * 50);
  };

  const handleRequest = () => {
    if (pickup === destination) {
      alert("Pickup and destination cannot be the same.");
      return;
    }
    onRequestRide(pickup, destination, calculatePrice());
  };

  const setQuickDestination = (name: string) => {
    if (name === pickup) return;
    setDestination(name);
  };

  if (activeRide) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Ride Status</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Car className="text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-semibold uppercase">Status</p>
              <p className="text-lg font-medium text-gray-800 capitalize">{activeRide.status}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <MapPin className="text-green-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Pickup</p>
                <p className="font-medium">{activeRide.pickup}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Navigation className="text-red-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-medium">{activeRide.destination}</p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-2xl font-bold text-gray-900">PGK {activeRide.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Where to?</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              id="pickup"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
            >
              {LANDMARKS.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
            >
              {LANDMARKS.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Palette's Micro-UX Improvement: Quick Landmarks */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
            <Zap size={12} className="mr-1 text-yellow-500 fill-yellow-500" />
            Quick Destinations
          </p>
          <div className="grid grid-cols-2 gap-2">
            {LANDMARKS.filter(l => l.name !== pickup).slice(0, 4).map((l) => (
              <button
                key={l.id}
                onClick={() => setQuickDestination(l.name)}
                aria-label={`Set destination to ${l.name}`}
                className={`text-left p-2 text-sm rounded-lg border transition-all ${
                  destination === l.name
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 outline-none'
                }`}
              >
                <span className="truncate block">{l.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleRequest}
          className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 active:scale-[0.98] transition-all mt-4 flex items-center justify-center space-x-2"
        >
          <span>Request Ride</span>
        </button>
      </div>
    </div>
  );
};

export default RiderView;
