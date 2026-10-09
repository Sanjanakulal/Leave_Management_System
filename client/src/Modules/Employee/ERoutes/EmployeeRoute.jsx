import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Register from '../EComponent/Register'
import Login from '../EComponent/Login'
import EmployeeDashboard from '../EComponent/EmployeeDashboard'
import LeaveHistory from '../EComponent/LeaveHistory'
import ApplyLeave from '../EComponent/ApplyLeave'


export default function EmployeeRoute() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/Register' replace />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/Login' element={<Login />} />
       <Route path="/EmployeeDashboard" element={<EmployeeDashboard />}/>
        <Route path="/ApplyLeave" element={<ApplyLeave />} />
        <Route path="/LeaveHistory" element={<LeaveHistory />} />
      <Route path='*' element={<Navigate to='/Register' replace />} />
    </Routes>
  )
}