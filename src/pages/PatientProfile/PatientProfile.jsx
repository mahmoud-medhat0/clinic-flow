import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, FileText, Plus, Edit2 } from 'lucide-react';
import { useTranslation } from '../../context/DirectionContext';

const patientData = {
  id: 1,
  name: 'Sarah Johnson',
  phone: '+1 555-0123',
  email: 'sarah.j@email.com',
  address: '123 Main St, City, State 12345',
  dob: '1989-05-15',
  age: 35,
  bloodType: 'A+',
  allergies: 'None reported',
  insuranceProvider: 'HealthCare Plus',
  insuranceNumber: 'HCP-123456789'
};

const visitHistory = [
  { date: '2024-01-15', type: 'Check-up', doctor: 'Dr. Ahmed', notes: 'Routine checkup, all vitals normal' },
  { date: '2024-01-02', type: 'Follow-up', doctor: 'Dr. Ahmed', notes: 'Follow-up for previous condition' },
  { date: '2023-12-10', type: 'Lab Results', doctor: 'Dr. Sarah', notes: 'Blood work results reviewed' },
  { date: '2023-11-20', type: 'Consultation', doctor: 'Dr. Ahmed', notes: 'Initial consultation for symptoms' },
];

function PatientProfile() {
  useParams(); // Get id from URL (used for future data fetching)
  const { t } = useTranslation();

  return (
    <div className="patient-profile-page">
      <div className="profile-header">
        <Link to="/patients" className="back-link">
          <ArrowLeft size={20} />
          {t('patientProfile.backToPatients')}
        </Link>
        <button className="btn btn-ghost">
          <Edit2 size={18} />
          {t('patientProfile.editProfile')}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="card info-card">
            <div className="patient-header">
              <div className="patient-avatar-xl">{patientData.name.charAt(0)}</div>
              <div className="patient-info">
                <h1>{patientData.name}</h1>
                <span className="patient-meta">{patientData.age} {t('patients.yearsOld')} • {patientData.bloodType}</span>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-item"><Phone size={18} /><div><label>{t('patients.phone')}</label><span>{patientData.phone}</span></div></div>
              <div className="info-item"><Mail size={18} /><div><label>{t('patients.email')}</label><span>{patientData.email}</span></div></div>
              <div className="info-item"><Calendar size={18} /><div><label>{t('patientProfile.dateOfBirth')}</label><span>{new Date(patientData.dob).toLocaleDateString()}</span></div></div>
              <div className="info-item"><MapPin size={18} /><div><label>{t('patientProfile.address')}</label><span>{patientData.address}</span></div></div>
            </div>
          </div>

          <div className="card history-card">
            <div className="card-header">
              <h3>{t('patientProfile.visitHistory')}</h3>
              <button className="btn btn-primary btn-sm"><Plus size={16} />{t('patientProfile.addVisit')}</button>
            </div>
            <div className="visit-timeline">
              {visitHistory.map((visit, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="visit-type badge badge-primary">{visit.type}</span>
                      <span className="visit-date">{new Date(visit.date).toLocaleDateString()}</span>
                    </div>
                    <p className="visit-doctor">{visit.doctor}</p>
                    <p className="visit-notes">{visit.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="card sidebar-card">
            <h4>{t('patientProfile.insuranceInfo')}</h4>
            <div className="sidebar-item"><label>{t('patientProfile.provider')}</label><span>{patientData.insuranceProvider}</span></div>
            <div className="sidebar-item"><label>{t('patientProfile.policyNumber')}</label><span>{patientData.insuranceNumber}</span></div>
          </div>
          <div className="card sidebar-card">
            <h4>{t('patientProfile.medicalInfo')}</h4>
            <div className="sidebar-item"><label>{t('patientProfile.bloodType')}</label><span>{patientData.bloodType}</span></div>
            <div className="sidebar-item"><label>{t('patientProfile.allergies')}</label><span>{patientData.allergies}</span></div>
          </div>
          <div className="card sidebar-card">
            <h4>{t('patients.quickNotes')}</h4>
            <textarea className="notes-textarea" placeholder={t('patientProfile.notesPlaceholder')} rows={4}></textarea>
            <button className="btn btn-ghost btn-sm w-full"><FileText size={16} />{t('patientProfile.saveNotes')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
