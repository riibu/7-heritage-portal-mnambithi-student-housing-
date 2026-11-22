import { useState } from "react";
import { ShieldCheck, GraduationCap, Building2 } from "lucide-react";
import { PortalProvider } from "./context/PortalContext";
import PublicStudentView from "./pages/PublicStudentView";
import LandlordDashboard from "./pages/LandlordDashboard";

export default function App() {
  const [view, setView] = useState("student");

  return (
    <PortalProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <header className="bg-indigo-950 text-white sticky top-0 z-40 shadow-md">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div
              onClick={() => setView("student")}
              className="font-bold text-lg tracking-tight cursor-pointer flex items-center gap-2.5"
            >
              <Building2 className="w-7 h-7 text-pink-400" />
              <div>
                <span className="block leading-none">7 Heritage</span>
                <span className="text-[11px] font-normal text-indigo-200">
                  7 Heritage Road, Estcourt • Girls Sharing Residence
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-2 bg-indigo-900/80 p-1 rounded-xl">
              <button
                onClick={() => setView("student")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  view === "student"
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-200 hover:text-white"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student View
              </button>

              <button
                onClick={() => setView("landlord")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  view === "landlord"
                    ? "bg-pink-600 text-white"
                    : "text-indigo-200 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Landlord Portal
              </button>
            </nav>
          </div>
        </header>

        <main>
          {view === "student" ? <PublicStudentView /> : <LandlordDashboard />}
        </main>
      </div>
    </PortalProvider>
  );
}