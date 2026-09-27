"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Phone, MapPin } from "lucide-react";
import type { Pharmacy } from "@/types/pharmacy";
import { OpeningStatusBadge } from "@/features/pharmacies/badges";

// Leaflet's default marker icons reference image paths that don't resolve
// correctly under a bundler — rebuild them from the package's own assets.
const pharmacyIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -38],
});

export function PharmacyMap({
  pharmacies, center, zoom,
}: {
  pharmacies: Pharmacy[];
  /** Defaults to Damascus (whole-country view) when omitted — the pharmacy details page passes a single-pharmacy focused view instead. */
  center?: [number, number];
  zoom?: number;
}) {
  const resolvedCenter: [number, number] = center ?? (pharmacies.length === 1
    ? [pharmacies[0]!.latitude, pharmacies[0]!.longitude]
    : [33.5138, 36.2765]);
  const resolvedZoom = zoom ?? (pharmacies.length === 1 ? 14 : 7);

  return (
    <MapContainer center={resolvedCenter} zoom={resolvedZoom} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pharmacies.map((p) => (
        <Marker key={p.id} position={[p.latitude, p.longitude]} icon={pharmacyIcon}>
          <Popup>
            <div className="min-w-[180px] font-sans" dir="rtl">
              <p className="font-bold text-ink">{p.name}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                <MapPin className="h-3 w-3" /> {p.address}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted" dir="ltr">
                <Phone className="h-3 w-3" /> {p.phone}
              </p>
              <div className="mt-2">
                <OpeningStatusBadge status={p.openingStatus.key} />
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
