import { useState } from "react";
import {
  MapPin,
  GraduationCap,
  ShoppingBag,
  HeartPulse,
  Shield,
  Bus,
  ExternalLink,
} from "lucide-react";

const ESSENTIALS = [
  {
    id: "home",
    name: "7 Heritage (Your Residence)",
    category: "Residence",
    address: "7 Heritage, Estcourt, 3310",
    note: "Home base — Female student sharing accommodation with Wi-Fi",
    query: "7 Heritage, Estcourt, 3310",
    icon: MapPin,
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "campus",
    name: "Mnambithi TVET College (Estcourt Campus)",
    category: "Campus",
    address: "10 Shepstone Road, Estcourt",
    note: "Main campus, lecture rooms & student support",
    query: "10 Shepstone Road, Estcourt, 3310",
    icon: GraduationCap,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "groceries",
    name: "Estcourt CBD & Brickhill Centre",
    category: "Groceries",
    address: "Connor Street & Brickhill Road, Estcourt",
    note: "Supermarkets, ATMs, food & daily student essentials",
    query: "Brickhill Shopping Centre, Estcourt, 3310",
    icon: ShoppingBag,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "pharmacy",
    name: "Local Pharmacy & Healthcare",
    category: "Pharmacy/Clinic",
    address: "Connor St & Brickhill Rd, Estcourt",
    note: "Pharmacies, medication & clinic care nearby",
    query: "Pharmacy Estcourt, 3310",
    icon: HeartPulse,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "police",
    name: "SAPS Estcourt Police Station",
    category: "Safety",
    address: "Estcourt Central, 3310",
    note: "24/7 safety assistance & document certification",
    query: "Estcourt Police Station, Estcourt",
    icon: Shield,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "transport",
    name: "Estcourt Taxi Rank & Bus Stop",
    category: "Transport",
    address: "Estcourt CBD",
    note: "Local taxis & intercity routes around Estcourt",
    query: "Estcourt Taxi Rank, Estcourt",
    icon: Bus,
    color: "bg-slate-200 text-slate-800",
  },
];

export default function EssentialsMap() {
  const [selected, setSelected] = useState(ESSENTIALS[0]);

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    selected.query
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    "7 Heritage, Estcourt, 3310"
  )}&destination=${encodeURIComponent(selected.query)}`;

  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            New in Town Guide
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            7 Heritage & Nearest Essentials Map
          </h2>
          <p className="text-xs text-slate-500">
            Select a stop to focus the map on Estcourt or open turn-by-turn directions from 7 Heritage.
          </p>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition self-start"
        >
          Directions from 7 Heritage
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 space-y-2.5">
          {ESSENTIALS.map((place) => {
            const Icon = place.icon;
            const isSelected = selected.id === place.id;
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelected(place)}
                className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                  isSelected
                    ? "border-rose-500 bg-rose-50/50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${place.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {place.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 truncate">{place.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{place.note}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden border border-slate-200 min-h-[360px] bg-slate-100">
          <div className="bg-slate-900 text-white px-4 py-2.5 text-xs flex items-center justify-between">
            <span className="font-medium truncate">
              Viewing: <strong>{selected.name}</strong> ({selected.address})
            </span>
          </div>
          <iframe
            title={selected.name}
            src={mapEmbedUrl}
            className="w-full flex-1 min-h-[320px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}