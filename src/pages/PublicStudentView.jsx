import { useState } from "react";
import {
  Wifi,
  BedDouble,
  Wrench,
  CheckCircle2,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import { usePortal } from "../context/PortalContext";
import ApplicationModal from "../components/ApplicationModal";
import MaintenanceModal from "../components/MaintenanceModal";
import EssentialsMap from "../components/EssentialsMap";

export default function PublicStudentView() {
  const { residence, verifiedTenant, loading } = usePortal();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("");
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  const openApplication = (tierLabel = "") => {
    setSelectedTier(tierLabel);
    setIsApplyOpen(true);
  };

  const startingPrice = residence?.starting_price ?? 1200;
  const availableBeds = residence?.available_beds ?? 8;
  const isApprovedResident = verifiedTenant?.status === "Approved";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* 7 Heritage Main Showcase Card */}
      <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm grid lg:grid-cols-12">
        <div className="lg:col-span-5 relative min-h-[260px]">
          <img
            src={residence.image}
            alt="7 Heritage Girls Sharing Rooms"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              ♀ Girls Only
            </span>
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" /> Wi-Fi Available
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{residence.name}</h1>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {residence.address}
                </p>
                <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Navigation className="w-3.5 h-3.5" /> {residence.distanceToCampus}
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl text-right">
                <span className="text-[11px] font-semibold text-indigo-600 block">
                  Sharing Rooms From
                </span>
                <span className="text-2xl font-extrabold text-indigo-950">
                  R{startingPrice}
                </span>
                <span className="text-xs text-indigo-700"> p.p. / mo</span>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Safe, accredited <strong>sharing accommodation for female students</strong> just an
              8-minute walk from Mnambithi TVET College (10 Shepstone Avenue).
            </p>

            {/* Amenities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {residence.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs">
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <BedDouble className="w-4 h-4" />
                  {loading ? "Syncing beds..." : `${availableBeds} Sharing Beds Open`}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  {residence.contact}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openApplication("3-Sleeper Girls Sharing Room (R1,200 p.p.)")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
                >
                  Apply Online Now
                </button>

                {isApprovedResident && (
                  <button
                    onClick={() => setIsMaintenanceOpen(true)}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tenant Maintenance ({verifiedTenant.full_name.split(" ")[0]})</span>
                  </button>
                )}
              </div>
            </div>

            {!isApprovedResident && (
              <p className="text-[11px] text-slate-400">
                Already an approved 7 Heritage resident on another device?{" "}
                <button
                  type="button"
                  onClick={() => setIsMaintenanceOpen(true)}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Verify your approved reference code
                </button>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Girls Sharing Room Options */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Girls Sharing Room Options</h2>
          <p className="text-xs text-slate-500">
            Choose your preferred sharing setup at 7 Heritage — Wi-Fi available in all rooms.
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
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full">
                    {tier.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
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
                  disabled={availableBeds === 0}
                  onClick={() => openApplication(`${tier.title} (R${tier.price} p.p.)`)}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                >
                  Apply for This Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Essentials Map for Students New in Town */}
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