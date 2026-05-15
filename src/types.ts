export type Role = 'rider' | 'driver';

export interface Landmark {
  id: string;
  name: string;
}

export type RideStatus = 'pending' | 'accepted' | 'completed';

export interface Ride {
  id: string;
  riderId: string;
  pickup: string;
  destination: string;
  price: number;
  status: RideStatus;
  driverId?: string;
}

export const LANDMARKS: Landmark[] = [
  { id: 'vc', name: 'Vision City Mega Mall' },
  { id: 'ap', name: 'Jacksons International Airport' },
  { id: 'eb', name: 'Ela Beach' },
  { id: 'np', name: 'Port Moresby Nature Park' },
  { id: 'ph', name: 'National Parliament House' },
];
