import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import './Patients.css';

const patientsData = [
  { id: 1, name: 'Sarah Johnson', phone: '+1 555-0123', email: 'sarah.j@email.com', lastVisit: '2024-01-15', status: 'Active', age: 35, address: '123 Main St, City' },
  { id: 2, name: 'Ahmed Hassan', phone: '+1 555-0124', email: 'ahmed.h@email.com', lastVisit: '2024-01-14', status: 'Active', age: 42, address: '456 Oak Ave, Town' },
  { id: 3, name: 'Maria Garcia', phone: '+1 555-0125', email: 'maria.g@email.com', lastVisit: '2024-01-10', status: 'Active', age: 28, address: '789 Pine Rd, Village' },
  { id: 4, name: 'John Smith', phone: '+1 555-0126', email: 'john.s@email.com', lastVisit: '2024-01-08', status: 'Inactive', age: 55, address: '321 Elm St, City' },
  { id: 5, name: 'Emily Chen', phone: '+1 555-0127', email: 'emily.c@email.com', lastVisit: '2024-01-05', status: 'Active', age: 31, address: '654 Maple Dr, Town' },
  { id: 6, name: 'Omar Ali', phone: '+1 555-0128', email: 'omar.a@email.com', lastVisit: '2024-01-03', status: 'Active', age: 47, address: '987 Cedar Ln, Village' },
];

function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(patientsData[0]);

  const filteredPatients = patientsData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patients-page">
      {/* Header */}
      <div className="page-header">
        <div className="search-filter">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost">
            <Filter size={18} />
            Filter
          </button>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Patient
        </button>
      </div>

      {/* Content */}
      <div className="patients-content">
        {/* Table */}
        <div className="patients-table-container card">
          <table className="table patients-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className={selectedPatient?.id === patient.id ? 'selected' : ''}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <td>
                    <div className="patient-name-cell">
                      <div className="patient-avatar">
                        {patient.name.charAt(0)}
                      </div>
                      <Link to={`/patients/${patient.id}`} className="patient-link">
                        {patient.name}
                      </Link>
                    </div>
                  </td>
                  <td>{patient.phone}</td>
                  <td>{patient.email}</td>
                  <td>{new Date(patient.lastVisit).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${patient.status.toLowerCase() === 'active' ? 'confirmed' : 'canceled'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td>
                    <button className="table-action-btn">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Details Panel */}
        {selectedPatient && (
          <div className="patient-details-panel card">
            <div className="panel-header">
              <div className="patient-avatar-large">
                {selectedPatient.name.charAt(0)}
              </div>
              <h3>{selectedPatient.name}</h3>
              <span className="patient-age">{selectedPatient.age} years old</span>
            </div>
            
            <div className="panel-section">
              <h4>Contact Information</h4>
              <div className="contact-item">
                <Phone size={16} />
                <span>{selectedPatient.phone}</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>{selectedPatient.email}</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>{selectedPatient.address}</span>
              </div>
            </div>

            <div className="panel-section">
              <h4>Quick Notes</h4>
              <p className="notes-text">No allergies reported. Regular check-ups recommended every 6 months.</p>
            </div>

            <div className="panel-actions">
              <Link to={`/patients/${selectedPatient.id}`} className="btn btn-primary w-full">
                View Full Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;
