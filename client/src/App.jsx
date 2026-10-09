import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminRoute from "./Modules/Admin/ARoutes/AdminRoute";
import EmployeeRoute from "./Modules/Employee/ERoutes/EmployeeRoute";
import Home from "./Modules/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Admin/*" element={<AdminRoute />} />
        <Route path="/*" element={<EmployeeRoute />} />
      </Routes>
    </BrowserRouter>
  );
}