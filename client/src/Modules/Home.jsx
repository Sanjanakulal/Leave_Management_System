import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, ShieldCheck, CalendarDays } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const cardStyle = {
    flex: "1",
    minWidth: "220px",
    padding: "28px",
    background: "#1e293b",
    color: "white",
    border: "1px solid #475569",
    borderRadius: "16px",
    textAlign: "left",
    cursor: "pointer",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "700px", textAlign: "center" }}>
        <CalendarDays size={48} color="#60a5fa" />
        <h1>Leave Management System</h1>
        <p style={{ color: "#cbd5e1", marginBottom: "36px" }}>
          Welcome! Select your role to continue.
        </p>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}>
          <button
            style={cardStyle}
            onClick={() => navigate("/Register")}
          >
            <Users size={32} color="#60a5fa" />
            <h2>Employee</h2>
            <p>Apply for leave, and track leave balance.</p>
            <strong style={{ color: "#60a5fa" }}>Continue as Employee →</strong>
          </button>

          <button
            style={cardStyle}
            onClick={() => navigate("/Admin/AdminLogin")}
          >
            <ShieldCheck size={32} color="#c084fc" />
            <h2>Admin</h2>
            <p>Review employee leave requests and manage approvals.</p>
            <strong style={{ color: "#c084fc" }}>Continue as Admin →</strong>
          </button>
        </div>
      </div>
    </div>
  );
}