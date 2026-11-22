import { useState } from "react";
import { X, Wrench, CheckCircle2 } from "lucide-react";
import { usePortal } from "../context/PortalContext";

export default function MaintenanceModal({ isOpen, onClose }) {
  const { submitTicket } = usePortal();
  const [ticketRef, setTicketRef] = useState(null);
  const [form, setForm] = useState({
    tenantName: "",
    roomNumber: "",
    category: "Wi-Fi",
    urgency: "Normal",
    description: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = submitTicket({
      ...form,
      propertyName: "7 Heritage",
    });
    setTicketRef(id);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <button
          onClick={() => {
            setTicketRef(null);
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {ticketRef ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Maintenance Logged</h3>
            <p className="text-sm text-slate-600">
              Ticket ID: <span className="font-mono font-bold text-slate-900">{ticketRef}</span>. 7
              Heritage management has received your report.
            </p>
            <button
              onClick={() => {
                setTicketRef(null);
                onClose();
              }}
              className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">7 Heritage Maintenance</h3>
                <p className="text-xs text-slate-500">Report a room, Wi-Fi, or facility issue</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    value={form.tenantName}
                    onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
                  />
                </div>
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
                className="w-full bg-amber-600 text-white py-2.5 rounded-xl font-semibold hover:bg-amber-700 transition"
              >
                Submit Maintenance Ticket
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}