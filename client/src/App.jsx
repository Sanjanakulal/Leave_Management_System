import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminRoute from "./Modules/Admin/ARoutes/AdminRoute";
import EmployeeRoute from "./Modules/Employee/ERoutes/EmployeeRoute";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Register" replace />} />
        <Route path="/Admin/*" element={<AdminRoute />} />
        <Route path="/*" element={<EmployeeRoute />} />
      </Routes>
    </BrowserRouter>
  );
}