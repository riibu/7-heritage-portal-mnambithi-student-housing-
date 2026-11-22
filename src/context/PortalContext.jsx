import { createContext, useContext, useState, useEffect } from "react";

const PortalContext = createContext();

const INITIAL_RESIDENCE = {
  id: "7-heritage",
  name: "7 Heritage",
  tagline: "Female Student Sharing Accommodation",
  address: "7 Heritage, Estcourt, 3310",
  startingPrice: 1200,
  genderPolicy: "Female Students Only",
  roomFormat: "Sharing Rooms (2-Sleeper & 3-Sleeper)",
  availableBeds: 8,
  amenities: [
    "Free Uncapped Wi-Fi",
    "Female-Only Residence",
    "Secure Perimeter & Access",
    "Communal Kitchen & Study Space",
    "Walking Distance to Town & Campus",
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
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem("portal_admin_auth") === "true";
  });

  const [residence, setResidence] = useState(() => {
    const saved = localStorage.getItem("heritage_residence_v1");
    return saved ? JSON.parse(saved) : INITIAL_RESIDENCE;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("heritage_applications_v1");
    return saved ? JSON.parse(saved) : [];
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem("heritage_tickets_v1");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("heritage_residence_v1", JSON.stringify(residence));
  }, [residence]);

  useEffect(() => {
    localStorage.setItem("heritage_applications_v1", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("heritage_tickets_v1", JSON.stringify(tickets));
  }, [tickets]);

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

  const submitApplication = (appData) => {
    const newApp = {
      id: `7H-${Date.now().toString().slice(-5)}`,
      status: "Pending",
      submittedAt: new Date().toLocaleDateString(),
      ...appData,
    };
    setApplications((prev) => [newApp, ...prev]);
    return newApp.id;
  };

  const submitTicket = (ticketData) => {
    const newTicket = {
      id: `MNT-${Date.now().toString().slice(-5)}`,
      status: "Open",
      createdAt: new Date().toLocaleDateString(),
      ...ticketData,
    };
    setTickets((prev) => [newTicket, ...prev]);
    return newTicket.id;
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          if (newStatus === "Approved" && app.status !== "Approved") {
            setResidence((res) => ({
              ...res,
              availableBeds: res.availableBeds > 0 ? res.availableBeds - 1 : 0,
            }));
          }
          return { ...app, status: newStatus };
        }
        return app;
      })
    );
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  const updateAvailableBeds = (newCount) => {
    setResidence((prev) => ({
      ...prev,
      availableBeds: Math.max(0, Number(newCount)),
    }));
  };

  return (
    <PortalContext.Provider
      value={{
        isAdmin,
        loginAdmin,
        logoutAdmin,
        residence,
        updateAvailableBeds,
        applications,
        submitApplication,
        updateApplicationStatus,
        tickets,
        submitTicket,
        updateTicketStatus,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export const usePortal = () => useContext(PortalContext);