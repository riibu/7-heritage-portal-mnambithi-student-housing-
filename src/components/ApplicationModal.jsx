import { useState, useEffect } from "react";
import { X, CheckCircle2, Wifi, AlertCircle } from "lucide-react";
import { usePortal } from "../context/PortalContext";

const normalizeRoomTier = (tier) => {
  if (!tier) return "3-Sleeper Sharing Room (R1,200 p.p.)";
  if (tier.includes("2-Sleeper")) return "2-Sleeper Sharing Room (R1,500 p.p.)";
  return "3-Sleeper Sharing Room (R1,200 p.p.)";
};

const createEmptyForm = (defaultRoomTier = "") => ({
  fullName: "",
  idNumber: "",
  studentNumber: "",
  phone: "",
  nextOfKinPhone: "",
  fundingType: "NSFAS",
  roomPreference: normalizeRoomTier(defaultRoomTier),
  moveInDate: "",
});

export default function ApplicationModal({ isOpen, defaultRoomTier, onClose }) {
  const { residence, submitApplication } = usePortal();
  const [submittedId, setSubmittedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => createEmptyForm(defaultRoomTier));

  useEffect(() => {
    if (isOpen) {
      setForm(createEmptyForm(defaultRoomTier));
      setError("");
    }
  }, [isOpen, defaultRoomTier]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const refId = await submitApplication({
        ...form,
        residenceName: residence.name,
      });
      setSubmittedId(refId);
      setForm(createEmptyForm(defaultRoomTier));
    } catch (err) {
      setError(err.message || "Could not submit application. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedId(null);
    setError("");
    setForm(createEmptyForm());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedId ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Application Received!</h3>
            <p className="text-sm text-slate-600">
              Your <strong>7 Heritage</strong> reference number is{" "}
              <span className="font-mono font-bold text-slate-900">{submittedId}</span>. Save this
              code—once the landlord approves your application, Tenant Maintenance will unlock
              automatically.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                7 Heritage • Female Student Application
              </span>
              <h3 className="font-bold text-slate-900 text-lg">Apply for Sharing Accommodation</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                Starting at R1,200 p.p. • Wi-Fi Available
              </p>
            </div>

            {error && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ayanda Khumalo"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    SA ID / Passport *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="13-digit ID"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    value={form.idNumber}
                    onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Student Number *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="College Student No."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    value={form.studentNumber}
                    onChange={(e) => setForm({ ...form, studentNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Student WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="071 234 5678"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Parent / Guardian Phone *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="Emergency contact"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    value={form.nextOfKinPhone}
                    onChange={(e) => setForm({ ...form, nextOfKinPhone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sharing Room Option *
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  value={form.roomPreference}
                  onChange={(e) => setForm({ ...form, roomPreference: e.target.value })}
                >
                  <option value="3-Sleeper Sharing Room (R1,200 p.p.)">
                    3-Sleeper Sharing Room — R1,200 p.p. (Wi-Fi Included)
                  </option>
                  <option value="2-Sleeper Sharing Room (R1,500 p.p.)">
                    2-Sleeper Sharing Room — R1,500 p.p. (Wi-Fi Included)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Funding Source *
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                    value={form.fundingType}
                    onChange={(e) => setForm({ ...form, fundingType: e.target.value })}
                  >
                    <option value="NSFAS">NSFAS</option>
                    <option value="Self-Funded">Self-Funded / Cash</option>
                    <option value="Bursary">Bursary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Expected Move-In *
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    value={form.moveInDate}
                    onChange={(e) => setForm({ ...form, moveInDate: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-rose-600 text-white py-2.5 rounded-xl font-semibold hover:bg-rose-700 disabled:bg-rose-300 transition mt-2"
              >
                {submitting ? "Submitting to 7 Heritage..." : "Submit Application to 7 Heritage"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}