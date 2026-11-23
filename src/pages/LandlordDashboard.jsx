import { useState } from "react";
import { Lock, LogOut, Users, Wrench, BedDouble } from "lucide-react";
import { usePortal } from "../context/PortalContext";

export default function LandlordDashboard() {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    residence,
    updateAvailableBeds,
    applications,
    updateApplicationStatus,
    tickets,
    updateTicketStatus,
  } = usePortal();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("applications");

  if (!isAdmin) {
    const handleLogin = (e) => {
      e.preventDefault();
      if (!loginAdmin(username, password)) {
        setError("Invalid admin credentials. (Demo: admin / admin123)");
      } else {
        setError("");
      }
    };

    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white border border-slate-200 rounded-2xl p-8 max-w-sm w-full shadow-sm space-y-4"
        >
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">7 Heritage Manager Portal</h2>
            <p className="text-xs text-slate-500">Protected behind admin credentials</p>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</p>}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">7 Heritage Management Portal</h1>
          <p className="text-xs text-slate-500">
            Manage female sharing room applications, maintenance tickets, and bed capacity
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Bed Capacity Adjuster */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <BedDouble className="w-4 h-4 text-rose-600" />
            <span className="font-medium text-slate-600">Open Beds:</span>
            <input
              type="number"
              min="0"
              value={residence.availableBeds}
              onChange={(e) => updateAvailableBeds(e.target.value)}
              className="w-12 border border-slate-300 rounded px-1.5 py-0.5 font-bold text-center"
            />
          </div>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Lock Portal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
            activeTab === "applications"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          Student Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("maintenance")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
            activeTab === "maintenance"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          <Wrench className="w-4 h-4" />
          Maintenance Tickets ({tickets.length})
        </button>
      </div>

      {activeTab === "applications" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {applications.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              No applications submitted for 7 Heritage yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="p-4">Ref / Applicant</th>
                    <th className="p-4">Room Option</th>
                    <th className="p-4">Funding</th>
                    <th className="p-4">Contacts</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.ref_code || app.id}>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{app.fullName}</div>
                        <div className="text-xs text-slate-500">
                          {app.ref_code || app.id} • Student #{app.studentNumber}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{app.roomPreference}</div>
                        <div className="text-xs text-slate-500">Move-in: {app.moveInDate}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {app.fundingType}
                        </span>
                      </td>
                      <td className="p-4 text-xs">
                        <div>Student: {app.phone}</div>
                        <div className="text-slate-500">Guardian: {app.nextOfKinPhone}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            app.status === "Approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Approved")}
                          className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Rejected")}
                          className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg hover:bg-slate-300"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "maintenance" && (
        <div className="grid md:grid-cols-2 gap-4">
          {tickets.length === 0 ? (
            <p className="col-span-2 bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
              No maintenance tickets logged at 7 Heritage.
            </p>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-slate-400">{t.id}</span>
                    <h4 className="font-bold text-slate-900">
                      {t.category} — {t.roomNumber}
                    </h4>
                    <p className="text-xs text-slate-500">Reported by {t.tenantName}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      t.urgency === "Urgent"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {t.urgency}
                  </span>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{t.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-slate-600">Status: {t.status}</span>
                  <select
                    value={t.status}
                    onChange={(e) => updateTicketStatus(t.id, e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}