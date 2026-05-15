import { Clock3, MapPinned, Route } from 'lucide-react';
import { LANDMARKS } from '../types';
import { getLandmarkByName } from '../lib/rides';

interface MapPreviewProps {
  pickup: string;
  destination: string;
  distanceKm: number;
  tripDurationMinutes: number;
  title: string;
  subtitle: string;
  badge?: string;
}

function buildRoutePath(
  pickupX: number,
  pickupY: number,
  destinationX: number,
  destinationY: number
) {
  const controlX = (pickupX + destinationX) / 2;
  const controlY =
    (pickupY + destinationY) / 2 + (Math.abs(destinationX - pickupX) < 16 ? -14 : 10);

  return `M ${pickupX} ${pickupY} Q ${controlX} ${controlY} ${destinationX} ${destinationY}`;
}

export default function MapPreview({
  pickup,
  destination,
  distanceKm,
  tripDurationMinutes,
  title,
  subtitle,
  badge,
}: MapPreviewProps) {
  const pickupLandmark = getLandmarkByName(pickup) ?? LANDMARKS[0];
  const destinationLandmark = getLandmarkByName(destination) ?? LANDMARKS[1];
  const routePath = buildRoutePath(
    pickupLandmark.x,
    pickupLandmark.y,
    destinationLandmark.x,
    destinationLandmark.y
  );

  return (
    <section className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-300">
            Live route map
          </p>
          <h3 className="mt-2 text-2xl font-bold">{title}</h3>
          <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
        </div>
        {badge ? (
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.92),_rgba(15,23,42,0.72))]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <svg viewBox="0 0 100 100" className="relative h-72 w-full">
          {LANDMARKS.map((landmark) => {
            const isPickup = landmark.id === pickupLandmark.id;
            const isDestination = landmark.id === destinationLandmark.id;
            return (
              <g key={landmark.id}>
                <circle
                  cx={landmark.x}
                  cy={landmark.y}
                  r={isPickup || isDestination ? 3.5 : 2}
                  fill={isPickup ? '#4ade80' : isDestination ? '#f87171' : 'rgba(148, 163, 184, 0.55)'}
                />
                <circle
                  cx={landmark.x}
                  cy={landmark.y}
                  r={isPickup || isDestination ? 8 : 4}
                  fill={isPickup || isDestination ? 'rgba(255,255,255,0.08)' : 'transparent'}
                />
              </g>
            );
          })}
          <path
            d={routePath}
            fill="none"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d={routePath}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="5 4"
          />
          <defs>
            <linearGradient id="routeGradient" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <MapPinned size={14} />
              Pickup
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{pickup}</p>
            <p className="text-xs text-slate-400">{pickupLandmark.area}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Route size={14} />
              Distance
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{distanceKm.toFixed(1)} km</p>
            <p className="text-xs text-slate-400">Optimized city route</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Clock3 size={14} />
              Trip ETA
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{tripDurationMinutes} min</p>
            <p className="text-xs text-slate-400">{destinationLandmark.area}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
        <div>
          <p className="font-semibold text-white">{pickup}</p>
          <p className="text-slate-400">to {destination}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
          Route ready
        </span>
      </div>
    </section>
  );
}
