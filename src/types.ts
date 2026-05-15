export type Role = 'rider' | 'driver';

export interface Landmark {
  id: string;
  name: string;
  area: string;
  x: number;
  y: number;
}

export type RideStatus = 'pending' | 'accepted' | 'completed';
export type RideTierId = 'falex-go' | 'falex-comfort' | 'falex-xl';
export type PaymentMethod = 'Card' | 'Cash';

export interface RideOption {
  id: RideTierId;
  name: string;
  description: string;
  seats: number;
  multiplier: number;
  baseFare: number;
  pickupEtaMinutes: number;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  zoneSurcharge: number;
  bookingFee: number;
  serviceMultiplier: number;
  total: number;
}

export interface DriverProfile {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  tripsCompleted: number;
  etaMinutes: number;
}

export interface RideRequestInput {
  pickup: string;
  destination: string;
  tierId: RideTierId;
  paymentMethod: PaymentMethod;
}

export interface Ride {
  id: string;
  riderId: string;
  pickup: string;
  destination: string;
  tierId: RideTierId;
  tierName: string;
  price: number;
  distanceKm: number;
  pickupEtaMinutes: number;
  tripDurationMinutes: number;
  paymentMethod: PaymentMethod;
  fareBreakdown: FareBreakdown;
  status: RideStatus;
  driverId?: string;
  driver?: DriverProfile;
}

export const LANDMARKS: Landmark[] = [
  { id: 'vc', name: 'Vision City Mega Mall', area: 'Waigani', x: 18, y: 32 },
  { id: 'ap', name: 'Jacksons International Airport', area: 'Six Mile', x: 82, y: 24 },
  { id: 'eb', name: 'Ela Beach', area: 'Town', x: 28, y: 80 },
  { id: 'np', name: 'Port Moresby Nature Park', area: 'Waigani', x: 50, y: 56 },
  { id: 'ph', name: 'National Parliament House', area: 'Waigani', x: 66, y: 42 },
];

export const RIDE_OPTIONS: RideOption[] = [
  {
    id: 'falex-go',
    name: 'FALEX Go',
    description: 'Affordable everyday rides with nearby drivers.',
    seats: 4,
    multiplier: 1,
    baseFare: 6,
    pickupEtaMinutes: 4,
  },
  {
    id: 'falex-comfort',
    name: 'FALEX Comfort',
    description: 'Newer vehicles with extra legroom and quieter trips.',
    seats: 4,
    multiplier: 1.28,
    baseFare: 9,
    pickupEtaMinutes: 6,
  },
  {
    id: 'falex-xl',
    name: 'FALEX XL',
    description: 'Group rides with more luggage space and 6 seats.',
    seats: 6,
    multiplier: 1.55,
    baseFare: 12,
    pickupEtaMinutes: 7,
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = ['Card', 'Cash'];
