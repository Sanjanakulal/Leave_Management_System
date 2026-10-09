import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminLogin from "../AComponents/AdminLogin";
import Sidebar from "../AComponents/Sidebar";
import AdminDashboard from "../AComponents/AdminDashboard";
import LeaveRequests from "../AComponents/LeaveRequests";

export default function AdminRoute() {
    const token = localStorage.getItem("UserToken");

    return (
        <Routes>
            <Route path="/AdminLogin" element={<AdminLogin />} />

            <Route
                path="/"
                element={
                    token ? <Sidebar /> : <Navigate to="/AdminLogin" replace />
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="LeaveRequests" element={<LeaveRequests />} />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/AdminLogin" replace />}
            />
        </Routes>
    );
}
