import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Appointments from './pages/Appointments/Appointments';
import Patients from './pages/Patients/Patients';
import PatientProfile from './pages/PatientProfile/PatientProfile';
import Invoices from './pages/Invoices/Invoices';
import Settings from './pages/Settings/Settings';
import './styles/design-system.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
