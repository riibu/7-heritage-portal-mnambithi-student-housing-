import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const PortalContext = createContext();

const INITIAL_RESIDENCE = {
  id: "7-heritage",
  name: "7 Heritage",
  tagline: "Female Student Sharing Accommodation",
  address: "7 Heritage Road, Estcourt, 3310",
  distanceToCampus: "0.6 km (8 min walk) to Mnambithi TVET College",
  image:
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
  starting_price: 1200,
  startingPrice: 1200,
  genderPolicy: "Female Students Only",
  roomFormat: "Sharing Rooms (2-Sleeper & 3-Sleeper)",
  available_beds: 8,
  availableBeds: 8,
  contact: "+27 82 123 4567",
  amenities: [
    "Free Uncapped Wi-Fi",
    "Female-Only Residence",
    "Solar Backup Power",
    "Secure Perimeter & Access",
    "Communal Kitchen & Study Space",
    "0.6 km Walk to Campus",
  ],
  roomOptions: [
    {
      id: "tier-3-share",
      title: "3-Sleeper Sharing Room",
      price: 1200,
      badge: "Most Affordable",
      details: "Spacious shared room for 3 female students • Wi-Fi & utilities included",
    },
    {
      id: "tier-2-share",
      title: "2-Sleeper Sharing Room",
      price: 1500,
      badge: "Popular",
      details: "Shared room for 2 female students • Extra study & storage space • Wi-Fi included",
    },
  ],
};

export function PortalProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem("portal_admin_auth") === "true"
  );
  const [residence, setResidence] = useState(INITIAL_RESIDENCE);
  const [applications, setApplications] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [verifiedTenant, setVerifiedTenant] = useState(() => {
    const saved = sessionStorage.getItem("heritage_verified_tenant");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Load initial data from Supabase & subscribe to real-time updates
  useEffect(() => {
    fetchAllData();

    const channel = supabase
      .channel("heritage-portal-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => fetchApplications()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "maintenance_tickets" },
        () => fetchTickets()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "residence_settings" },
        () => fetchResidence()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchResidence(), fetchApplications(), fetchTickets()]);
    setLoading(false);
  };

  const fetchResidence = async () => {
    const { data, error } = await supabase
      .from("residence_settings")
      .select("*")
      .eq("id", "7-heritage")
      .maybeSingle();

    if (!error && data) {
      setResidence((prev) => ({
        ...prev,
        ...data,
        startingPrice: data.starting_price,
        availableBeds: data.available_beds,
      }));
    }
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setApplications(
        data.map((app) => ({
          ...app,
          // Backward-compatible aliases so existing components work seamlessly
          fullName: app.full_name,
          idNumber: app.id_number,
          studentNumber: app.student_number,
          nextOfKinPhone: app.next_of_kin_phone,
          roomPreference: app.room_preference,
          fundingType: app.funding_type,
          moveInDate: app.move_in_date,
          roomNumber: app.room_number,
          isRead: app.is_read,
          submittedAt: new Date(app.created_at).toLocaleDateString(),
        }))
      );
    }
  };

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from("maintenance_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTickets(
        data.map((t) => ({
          ...t,
          tenantName: t.tenant_name,
          roomNumber: t.room_number,
          createdAt: new Date(t.created_at).toLocaleDateString(),
        }))
      );
    }
  };

  // Landlord Auth
  const loginAdmin = (username, password) => {
    if (username === "admin" && password === "admin123") {
      setIsAdmin(true);
      sessionStorage.setItem("portal_admin_auth", "true");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("portal_admin_auth");
  };

  // Student Application Submission -> Saves to Supabase
  const submitApplication = async (appData) => {
    const refCode = `7H-${Date.now().toString().slice(-5)}`;
    const payload = {
      ref_code: refCode,
      full_name: appData.fullName || appData.full_name,
      id_number: appData.idNumber || appData.id_number,
      student_number: appData.studentNumber || appData.student_number,
      phone: appData.phone,
      next_of_kin_phone: appData.nextOfKinPhone || appData.next_of_kin_phone,
      room_preference: appData.roomPreference || appData.room_preference,
      funding_type: appData.fundingType || appData.funding_type,
      move_in_date: appData.moveInDate || appData.move_in_date,
      status: "Pending",
      is_read: false,
    };

    const { error } = await supabase.from("applications").insert([payload]);
    if (error) {
      console.error("Error submitting application:", error.message);
      throw error;
    }

    await fetchApplications();
    return refCode;
  };

  // Strict Gate: Only students with status === "Approved" can unlock maintenance
  const verifyApprovedTenant = async (identifier) => {
    const clean = identifier.trim();
    if (!clean) {
      return { ok: false, message: "Please enter your Reference Code or Student Number." };
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("status", "Approved")
      .or(`ref_code.ilike.${clean},student_number.eq.${clean}`)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return {
        ok: false,
        message:
          "Access Denied: Your application is still Pending, Rejected, or not found. Maintenance is restricted to landlord-approved 7 Heritage residents.",
      };
    }

    setVerifiedTenant(data);
    sessionStorage.setItem("heritage_verified_tenant", JSON.stringify(data));
    return { ok: true, tenant: data };
  };

  const clearVerifiedTenant = () => {
    setVerifiedTenant(null);
    sessionStorage.removeItem("heritage_verified_tenant");
  };

  // Maintenance Ticket Submission -> Double-checks Approved status before inserting
  const submitTicket = async (ticketData) => {
    if (!verifiedTenant || verifiedTenant.status !== "Approved") {
      throw new Error("Only approved residents can log maintenance requests.");
    }

    const ticketCode = `MNT-${Date.now().toString().slice(-5)}`;
    const payload = {
      ticket_code: ticketCode,
      application_id: verifiedTenant.id,
      tenant_name: verifiedTenant.full_name,
      room_number: verifiedTenant.room_number || ticketData.roomNumber || "Assigned Room",
      category: ticketData.category,
      urgency: ticketData.urgency || "Normal",
      description: ticketData.description,
      status: "Open",
    };

    const { error } = await supabase.from("maintenance_tickets").insert([payload]);
    if (error) {
      console.error("Error submitting ticket:", error.message);
      throw error;
    }

    await fetchTickets();
    return ticketCode;
  };

  // Landlord Approval / Rejection + Automatic Bed Count Update
  const updateApplicationStatus = async (appId, newStatus, assignedRoom = null) => {
    const target = applications.find((a) => a.id === appId);
    if (!target) return;

    const updates = {
      status: newStatus,
      is_read: true,
    };
    if (assignedRoom) {
      updates.room_number = assignedRoom;
    }

    const { error } = await supabase
      .from("applications")
      .update(updates)
      .eq("id", appId);

    if (error) {
      console.error("Error updating application:", error.message);
      return;
    }

    if (newStatus === "Approved" && target.status !== "Approved") {
      const nextBeds = Math.max(0, (residence.available_beds ?? 8) - 1);
      await updateAvailableBeds(nextBeds);
    }

    await fetchApplications();
  };

  const markApplicationRead = async (appId) => {
    await supabase.from("applications").update({ is_read: true }).eq("id", appId);
    await fetchApplications();
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    const { error } = await supabase
      .from("maintenance_tickets")
      .update({ status: newStatus })
      .eq("id", ticketId);

    if (!error) {
      await fetchTickets();
    }
  };

  const updateAvailableBeds = async (newCount) => {
    const safeCount = Math.max(0, Number(newCount));
    const { error } = await supabase
      .from("residence_settings")
      .update({ available_beds: safeCount })
      .eq("id", "7-heritage");

    if (!error) {
      setResidence((prev) => ({
        ...prev,
        available_beds: safeCount,
        availableBeds: safeCount,
      }));
    }
  };

  const unreadCount = applications.filter((a) => !a.is_read).length;

  return (
    <PortalContext.Provider
      value={{
        loading,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        residence,
        updateAvailableBeds,
        applications,
        unreadCount,
        submitApplication,
        updateApplicationStatus,
        markApplicationRead,
        tickets,
        submitTicket,
        updateTicketStatus,
        verifiedTenant,
        verifyApprovedTenant,
        clearVerifiedTenant,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export const usePortal = () => useContext(PortalContext);