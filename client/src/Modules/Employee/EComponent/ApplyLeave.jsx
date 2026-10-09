import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ApplyLeave() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.endDate < form.startDate) {
      setMessage("End date cannot be before start date.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("EmployeeToken");

      const response = await axios.post(
        "http://localhost:5000/leave/apply",
        form,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      setMessage(response.data.message || "Leave applied successfully!");
      setForm({
        leaveType: "Casual Leave",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to apply for leave. Please log in again and try."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button
          type="button"
          style={styles.back}
          onClick={() => navigate("/EmployeeDashboard")}
        >
          ← Back to Dashboard
        </button>

        <h1 style={styles.heading}>Apply for Leave</h1>
        <p style={styles.subtitle}>
          Submit your leave request for admin approval.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Leave Type</label>
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            style={styles.field}
          >
            <option>Casual Leave</option>
            <option>Sick Leave</option>
            <option>Annual Leave</option>
          </select>

          <label style={styles.label}>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
            style={styles.field}
          />

          <label style={styles.label}>End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            min={form.startDate || new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
            style={styles.field}
          />

          <label style={styles.label}>Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Enter your reason for leave"
            required
            rows={4}
            style={{ ...styles.field, resize: "vertical" }}
          />

          {message && <p style={styles.message}>{message}</p>}

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading ? "Submitting..." : "Submit Leave Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#1e293b",
    padding: "32px",
    borderRadius: "16px",
    border: "1px solid #334155",
    boxSizing: "border-box",
  },
  back: {
    background: "transparent",
    color: "#93c5fd",
    border: "none",
    cursor: "pointer",
    marginBottom: "18px",
    fontSize: "14px",
  },
  heading: { margin: "0 0 8px", fontSize: "28px" },
  subtitle: { color: "#cbd5e1", marginBottom: "28px" },
  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "18px",
    fontSize: "14px",
    fontWeight: 600,
  },
  field: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#0f172a",
    color: "#f8fafc",
    boxSizing: "border-box",
    fontSize: "15px",
  },
  message: { color: "#fbbf24", fontSize: "14px", marginTop: "16px" },
  submit: {
    width: "100%",
    padding: "13px",
    marginTop: "24px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "15px",
  },
};
