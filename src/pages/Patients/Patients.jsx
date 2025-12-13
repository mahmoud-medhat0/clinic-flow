import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Phone, Mail, MapPin, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../context/DirectionContext';
import CustomDataTable from '../../components/common/CustomDataTable';
import CustomSelect from '../../components/common/CustomSelect';

const initialPatientsData = [
  { id: 1, name: 'Sarah Johnson', phone: '+1 555-0123', email: 'sarah.j@email.com', lastVisit: '2024-01-15', status: 'active', age: 35, address: '123 Main St, City', bloodType: 'A+', dob: '1989-05-15' },
  { id: 2, name: 'Ahmed Hassan', phone: '+1 555-0124', email: 'ahmed.h@email.com', lastVisit: '2024-01-14', status: 'active', age: 42, address: '456 Oak Ave, Town', bloodType: 'B+', dob: '1982-08-20' },
  { id: 3, name: 'Maria Garcia', phone: '+1 555-0125', email: 'maria.g@email.com', lastVisit: '2024-01-10', status: 'active', age: 28, address: '789 Pine Rd, Village', bloodType: 'O+', dob: '1996-03-10' },
  { id: 4, name: 'John Smith', phone: '+1 555-0126', email: 'john.s@email.com', lastVisit: '2024-01-08', status: 'inactive', age: 55, address: '321 Elm St, City', bloodType: 'AB-', dob: '1969-11-25' },
  { id: 5, name: 'Emily Chen', phone: '+1 555-0127', email: 'emily.c@email.com', lastVisit: '2024-01-05', status: 'active', age: 31, address: '654 Maple Dr, Town', bloodType: 'A-', dob: '1993-07-08' },
  { id: 6, name: 'Omar Ali', phone: '+1 555-0128', email: 'omar.a@email.com', lastVisit: '2024-01-03', status: 'active', age: 47, address: '987 Cedar Ln, Village', bloodType: 'O-', dob: '1977-01-30' },
];

function Patients() {
  const [patients, setPatients] = useState(initialPatientsData);
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    bloodType: '',
    dateFrom: '',
    dateTo: ''
  });

  // Form states
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '', dob: '', bloodType: ''
  });

  // Apply filters to patients data
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      if (filters.status && patient.status !== filters.status) return false;
      if (filters.bloodType && patient.bloodType !== filters.bloodType) return false;
      if (filters.dateFrom && new Date(patient.lastVisit) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(patient.lastVisit) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [patients, filters]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({ status: '', bloodType: '', dateFrom: '', dateTo: '' });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  // DataTables columns configuration
  const columns = [
    { 
      data: 'name',
      title: t('patients.patientName'),
      render: (data, type, row) => {
        if (type === 'display') {
          return `<div class="patient-name-cell">
            <div class="patient-avatar">${data.charAt(0)}</div>
            <a href="/patients/${row.id}" class="patient-link">${data}</a>
          </div>`;
        }
        return data;
      }
    },
    { data: 'phone', title: t('patients.phone') },
    { data: 'email', title: t('patients.email') },
    { 
      data: 'lastVisit', 
      title: t('patients.lastVisit'),
      render: (data) => new Date(data).toLocaleDateString()
    },
    { 
      data: 'status', 
      title: t('patients.status'),
      render: (data) => {
        const badgeClass = data === 'active' ? 'confirmed' : 'canceled';
        const statusText = data === 'active' ? t('patients.active') : t('patients.inactive');
        return `<span class="badge badge-${badgeClass}">${statusText}</span>`;
      }
    },
    {
      data: null,
      title: '',
      orderable: false,
      render: (data, type, row) => {
        return `<div class="action-btns">
          <button class="icon-btn edit-btn" data-id="${row.id}" title="${t('common.edit')}">
            <i class="fas fa-pen"></i>
          </button>
          <button class="icon-btn delete-btn" data-id="${row.id}" title="${t('common.delete')}">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
      }
    }
  ];

  const handleAdd = () => {
    setFormData({ name: '', phone: '', email: '', address: '', dob: '', bloodType: '' });
    setShowAddModal(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      dob: patient.dob || '',
      bloodType: patient.bloodType || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = (patientId) => {
    setPatients(patients.filter(p => p.id !== patientId));
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(patients[0]);
    }
  };

  const handleSaveAdd = () => {
    const newPatient = {
      id: Date.now(),
      ...formData,
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'active',
      age: formData.dob ? Math.floor((new Date() - new Date(formData.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 0
    };
    setPatients([newPatient, ...patients]);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    setPatients(patients.map(p => 
      p.id === editingPatient.id 
        ? { ...p, ...formData, age: formData.dob ? Math.floor((new Date() - new Date(formData.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : p.age }
        : p
    ));
    setShowEditModal(false);
  };

  // Handle row selection and action buttons
  const handleRowClick = (patient, e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    
    if (editBtn) {
      const id = parseInt(editBtn.dataset.id);
      const p = patients.find(x => x.id === id);
      if (p) handleEdit(p);
      return;
    }
    
    if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id);
      handleDelete(id);
      return;
    }
    
    setSelectedPatient(patient);
  };

  const PatientModal = ({ isEdit, onClose, onSave }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? t('common.edit') : t('patients.addPatient')}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>{t('patients.patientName')}</label>
              <input 
                type="text" 
                className="input" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>{t('patients.phone')}</label>
              <input 
                type="tel" 
                className="input" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('patients.email')}</label>
            <input 
              type="email" 
              className="input" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>{t('patientProfile.address')}</label>
            <input 
              type="text" 
              className="input" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('patientProfile.dateOfBirth')}</label>
              <input 
                type="date" 
                className="input" 
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>{t('patientProfile.bloodType')}</label>
              <CustomSelect
                placeholder={t('patientProfile.bloodType')}
                value={formData.bloodType ? { value: formData.bloodType, label: formData.bloodType } : null}
                onChange={(option) => setFormData({...formData, bloodType: option?.value || ''})}
                options={[
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' }
                ]}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={onSave}>{t('common.save')}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="patients-page">
      <div className="page-header">
        <div className="search-filter">
          <button 
            className={`btn btn-ghost ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            {t('common.filter')}
            {hasActiveFilters && <span className="filter-count">{Object.values(filters).filter(v => v !== '').length}</span>}
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} />
          {t('patients.addPatient')}
        </button>
      </div>

      {/* Collapsible Filters Panel */}
      {showFilters && (
        <div className="filters-panel card">
          <div className="filters-grid">
            <div className="filter-group">
              <label>{t('patients.status')}</label>
              <CustomSelect
                placeholder={t('common.all')}
                value={filters.status ? { value: filters.status, label: filters.status === 'active' ? t('patients.active') : t('patients.inactive') } : null}
                onChange={(option) => setFilters({...filters, status: option?.value || ''})}
                options={[
                  { value: 'active', label: t('patients.active') },
                  { value: 'inactive', label: t('patients.inactive') }
                ]}
              />
            </div>
            <div className="filter-group">
              <label>{t('patientProfile.bloodType')}</label>
              <CustomSelect
                placeholder={t('common.all')}
                value={filters.bloodType ? { value: filters.bloodType, label: filters.bloodType } : null}
                onChange={(option) => setFilters({...filters, bloodType: option?.value || ''})}
                options={[
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' }
                ]}
              />
            </div>
            <div className="filter-group">
              <label>{t('common.from')}</label>
              <input 
                type="date" 
                className="input"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>
            <div className="filter-group">
              <label>{t('common.to')}</label>
              <input 
                type="date" 
                className="input"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>
          </div>
          {hasActiveFilters && (
            <div className="filters-actions">
              <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                <RotateCcw size={14} />
                {t('common.resetFilters')}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="patients-content">
        <div className="patients-table-container card">
          <CustomDataTable
            data={filteredPatients}
            columns={columns}
            className="patients-datatable"
            onRowClick={handleRowClick}
          >
            <thead>
              <tr>
                <th>{t('patients.patientName')}</th>
                <th>{t('patients.phone')}</th>
                <th>{t('patients.email')}</th>
                <th>{t('patients.lastVisit')}</th>
                <th>{t('patients.status')}</th>
                <th></th>
              </tr>
            </thead>
          </CustomDataTable>
        </div>

        {selectedPatient && (
          <div className="patient-details-panel card">
            <div className="panel-header">
              <div className="patient-avatar-large">{selectedPatient.name.charAt(0)}</div>
              <h3>{selectedPatient.name}</h3>
              <span className="patient-age">{selectedPatient.age} {t('patients.yearsOld')}</span>
            </div>
            <div className="panel-section">
              <h4>{t('patients.contactInfo')}</h4>
              <div className="contact-item"><Phone size={16} /><span>{selectedPatient.phone}</span></div>
              <div className="contact-item"><Mail size={16} /><span>{selectedPatient.email}</span></div>
              <div className="contact-item"><MapPin size={16} /><span>{selectedPatient.address}</span></div>
            </div>
            <div className="panel-section">
              <h4>{t('patients.quickNotes')}</h4>
              <p className="notes-text">No allergies reported. Regular check-ups recommended every 6 months.</p>
            </div>
            <div className="panel-actions">
              <Link to={`/patients/${selectedPatient.id}`} className="btn btn-primary w-full">{t('patients.viewFullProfile')}</Link>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <PatientModal isEdit={false} onClose={() => setShowAddModal(false)} onSave={handleSaveAdd} />
      )}

      {showEditModal && (
        <PatientModal isEdit={true} onClose={() => setShowEditModal(false)} onSave={handleSaveEdit} />
      )}
    </div>
  );
}

export default Patients;
