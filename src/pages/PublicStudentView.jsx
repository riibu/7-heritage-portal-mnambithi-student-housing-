import { useState } from "react";
import { Wifi, Users, BedDouble, Wrench, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { usePortal } from "../context/PortalContext";
import ApplicationModal from "../components/ApplicationModal";
import MaintenanceModal from "../components/MaintenanceModal";
import EssentialsMap from "../components/EssentialsMap";

export default function PublicStudentView() {
  const { residence } = usePortal();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("");
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  const openApplication = (tierLabel = "") => {
    setSelectedTier(tierLabel);
    setIsApplyOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Banner - 7 Heritage */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-1 rounded-full border border-rose-500/30">
                <Users className="w-3.5 h-3.5" />
                Female Students Only
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
                <Wifi className="w-3.5 h-3.5" />
                Wi-Fi Available
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Welcome to <span className="text-rose-400">7 Heritage</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Comfortable, secure <strong>sharing accommodation for female students</strong> in
              Estcourt—conveniently located near Mnambithi TVET College and town essentials.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-sm">
              <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-300 block">Sharing Rooms From</span>
                <span className="text-2xl font-extrabold text-white">
                  R1,200 <span className="text-xs font-normal text-slate-300">p.p. / month</span>
                </span>
              </div>

              <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-300 block">Current Availability</span>
                <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4" />
                  {residence.availableBeds} Sharing Beds Open
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => openApplication("3-Sleeper Sharing Room (R1,200 p.p.)")}
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-rose-950/40"
              >
                Apply Online Now
              </button>

              <button
                onClick={() => setIsMaintenanceOpen(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl text-sm transition border border-white/15"
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                Tenant Maintenance
              </button>
            </div>
          </div>

          {/* Amenities Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:w-80 space-y-3 shrink-0">
            <h3 className="font-bold text-sm uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Included at 7 Heritage
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-200">
              {residence.amenities.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-white/10 text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              {residence.address}
            </div>
          </div>
        </div>
      </section>

      {/* Sharing Room Packages */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Female Sharing Room Options</h2>
          <p className="text-xs text-slate-500">
            All options include Wi-Fi access and shared communal facilities at 7 Heritage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {residence.roomOptions.map((tier) => (
            <div
              key={tier.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    {tier.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Wifi className="w-3.5 h-3.5" /> Wi-Fi Available
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{tier.title}</h3>
                <p className="text-xs text-slate-600">{tier.details}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900">R{tier.price}</span>
                  <span className="text-xs text-slate-500"> p.p. / month</span>
                </div>
                <button
                  disabled={residence.availableBeds === 0}
                  onClick={() => openApplication(`${tier.title} (R${tier.price} p.p.)`)}
                  className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                >
                  Select & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Map for Students New in Town */}
      <EssentialsMap />

      {/* Modals */}
      <ApplicationModal
        isOpen={isApplyOpen}
        defaultRoomTier={selectedTier}
        onClose={() => setIsApplyOpen(false)}
      />
      <MaintenanceModal
        isOpen={isMaintenanceOpen}
        onClose={() => setIsMaintenanceOpen(false)}
      />
    </div>
  );
}