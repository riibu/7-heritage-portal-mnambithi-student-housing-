import { useState, useEffect } from "react";
import { X, Wrench, CheckCircle2, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { usePortal } from "../context/PortalContext";

export default function MaintenanceModal({ isOpen, onClose }) {
  const { verifiedTenant, verifyApprovedTenant, clearVerifiedTenant, submitTicket } = usePortal();
  const [identifier, setIdentifier] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState("");

  const [ticketRef, setTicketRef] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    roomNumber: "",
    category: "Wi-Fi",
    urgency: "Normal",
    description: "",
  });

  useEffect(() => {
    if (verifiedTenant) {
      setForm((prev) => ({
        ...prev,
        roomNumber:
          verifiedTenant.room_number && verifiedTenant.room_number !== "Unassigned"
            ? verifiedTenant.room_number
            : prev.roomNumber,
      }));
    }
  }, [verifiedTenant]);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setAuthError("");
    setVerifying(true);
    const result = await verifyApprovedTenant(identifier);
    setVerifying(false);
    if (!result.ok) {
      setAuthError(result.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const id = await submitTicket({
        ...form,
        propertyName: "7 Heritage",
      });
      setTicketRef(id);
      setForm((prev) => ({ ...prev, description: "" }));
    } catch (err) {
      setSubmitError(err.message || "Unable to submit maintenance ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setTicketRef(null);
    setAuthError("");
    setSubmitError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Gate — Block until Landlord has set application status === "Approved" */}
        {!verifiedTenant ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Approved Residents Only</h3>
                <p className="text-xs text-slate-500">
                  Verify your accepted 7 Heritage tenancy to report issues
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
              Maintenance logging is restricted to students whose application has been{" "}
              <strong>approved by the 7 Heritage landlord</strong>. Enter your Application Reference
              Code (e.g. <span className="font-mono font-semibold">7H-12345</span>) or Student
              Number below.
            </p>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Reference Code or Student Number *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 7H-48291 or 20261101"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-400 transition"
              >
                {verifying ? "Checking Approval Status..." : "Verify Tenancy & Unlock Maintenance"}
              </button>
            </form>
          </div>
        ) : ticketRef ? (
          /* STEP 3: Ticket Confirmation */
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Maintenance Logged</h3>
            <p className="text-sm text-slate-600">
              Ticket ID: <span className="font-mono font-bold text-slate-900">{ticketRef}</span>. 7
              Heritage management has received your report.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          /* STEP 2: Unlocked Maintenance Form for Approved Resident */
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">7 Heritage Maintenance</h3>
                <p className="text-xs text-slate-500">Report a room, Wi-Fi, or facility issue</p>
              </div>
            </div>

            <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Resident: {verifiedTenant.full_name}
              </span>
              <button
                type="button"
                onClick={clearVerifiedTenant}
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                Switch
              </button>
            </div>

            {submitError && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Room No. *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Room 4"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  value={form.roomNumber}
                  onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Wi-Fi">Wi-Fi / Router</option>
                    <option value="Plumbing">Plumbing / Water</option>
                    <option value="Electrical">Electrical / Lights</option>
                    <option value="Furniture">Door / Lock / Bed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Urgency</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                    value={form.urgency}
                    onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what needs attention..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-600 text-white py-2.5 rounded-xl font-semibold hover:bg-amber-700 disabled:bg-amber-300 transition"
              >
                {submitting ? "Logging Ticket..." : "Submit Maintenance Ticket"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}