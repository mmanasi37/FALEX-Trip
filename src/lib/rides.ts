import {
  LANDMARKS,
  RIDE_OPTIONS,
  type DriverProfile,
  type FareBreakdown,
  type Ride,
  type RideOption,
  type RideTierId,
} from '../types';

const BASE_FARE = 8;
const DISTANCE_RATE = 4.6;
const AIRPORT_SURCHARGE = 7;
const CITY_CENTRE_SURCHARGE = 3;
const BOOKING_FEE = 2.5;
const AIRPORT = 'Jacksons International Airport';
const CITY_CENTRE = 'Vision City Mega Mall';

let rideSequence = 0;

export function createRideId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  rideSequence += 1;
  return `ride-${Date.now().toString(36)}-${rideSequence.toString(36)}`;
}

export function getLandmarkByName(name: string) {
  return LANDMARKS.find((landmark) => landmark.name === name);
}

export function getRideOption(tierId: RideTierId): RideOption {
  return RIDE_OPTIONS.find((option) => option.id === tierId) ?? RIDE_OPTIONS[0];
}

export function calculateDistanceKm(pickup: string, destination: string) {
  if (pickup === destination) {
    return 0;
  }

  const pickupLandmark = getLandmarkByName(pickup);
  const destinationLandmark = getLandmarkByName(destination);

  if (!pickupLandmark || !destinationLandmark) {
    return 3.2;
  }

  const deltaX = destinationLandmark.x - pickupLandmark.x;
  const deltaY = destinationLandmark.y - pickupLandmark.y;
  const rawDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  return Number((1.4 + rawDistance * 0.12).toFixed(1));
}

export function estimateRideDetails(pickup: string, destination: string, tierId: RideTierId) {
  const option = getRideOption(tierId);
  const distanceKm = calculateDistanceKm(pickup, destination);
  const zoneSurcharge =
    (pickup === AIRPORT || destination === AIRPORT ? AIRPORT_SURCHARGE : 0) +
    (pickup === CITY_CENTRE || destination === CITY_CENTRE ? CITY_CENTRE_SURCHARGE : 0);
  const baseFare = BASE_FARE + option.baseFare;
  const distanceFare = Number((distanceKm * DISTANCE_RATE).toFixed(2));
  const subtotal = (baseFare + distanceFare + zoneSurcharge) * option.multiplier;
  const total = Number((subtotal + BOOKING_FEE).toFixed(2));
  const pickupEtaMinutes = Math.max(3, option.pickupEtaMinutes + Math.round(distanceKm * 0.25));
  const tripDurationMinutes = Math.max(8, 6 + Math.round(distanceKm * 1.45));
  const fareBreakdown: FareBreakdown = {
    baseFare: Number(baseFare.toFixed(2)),
    distanceFare,
    zoneSurcharge: Number(zoneSurcharge.toFixed(2)),
    bookingFee: Number(BOOKING_FEE.toFixed(2)),
    serviceMultiplier: option.multiplier,
    total,
  };

  return {
    distanceKm,
    pickupEtaMinutes,
    tripDurationMinutes,
    fareBreakdown,
    total,
  };
}

export function estimateRidePrice(pickup: string, destination: string, tierId: RideTierId) {
  return estimateRideDetails(pickup, destination, tierId).total;
}

const DRIVER_POOL: Omit<DriverProfile, 'etaMinutes'>[] = [
  {
    id: 'driver-1',
    name: 'Michael Kila',
    rating: 4.9,
    vehicle: 'Toyota Corolla',
    plate: 'MNB 241',
    tripsCompleted: 1280,
  },
  {
    id: 'driver-2',
    name: 'Ruth Ovia',
    rating: 4.8,
    vehicle: 'Nissan X-Trail',
    plate: 'GKM 517',
    tripsCompleted: 940,
  },
  {
    id: 'driver-3',
    name: 'Aisake Lohi',
    rating: 4.95,
    vehicle: 'Toyota Prado',
    plate: 'POM 808',
    tripsCompleted: 1540,
  },
];

export function assignDriver(ride: Ride): DriverProfile {
  const seed = ride.id
    .split('')
    .reduce((total, character) => total + character.charCodeAt(0), 0);
  const baseDriver = DRIVER_POOL[seed % DRIVER_POOL.length];

  return {
    ...baseDriver,
    etaMinutes: Math.max(2, ride.pickupEtaMinutes - (seed % 2)),
  };
}

export function formatPngCurrency(amount: number) {
  return `PGK ${amount.toFixed(2)}`;
}
