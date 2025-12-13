import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { Plus, Filter, Download, X, ChevronDown, ChevronUp, RotateCcw, Printer } from 'lucide-react';
import { useTranslation, useDirection } from '../../context/DirectionContext';
import CustomDataTable from '../../components/common/CustomDataTable';
import CustomSelect from '../../components/common/CustomSelect';

const initialInvoicesData = [
  { id: 'INV-001', patient: 'Sarah Johnson', date: '2024-01-15', amount: 250, status: 'paid', service: 'Check-up', dueDate: '2024-01-30' },
  { id: 'INV-002', patient: 'Ahmed Hassan', date: '2024-01-14', amount: 180, status: 'paid', service: 'Follow-up', dueDate: '2024-01-28' },
  { id: 'INV-003', patient: 'Maria Garcia', date: '2024-01-12', amount: 320, status: 'pending', service: 'Consultation', dueDate: '2024-01-26' },
  { id: 'INV-004', patient: 'John Smith', date: '2024-01-10', amount: 150, status: 'overdue', service: 'Lab Results', dueDate: '2024-01-20' },
  { id: 'INV-005', patient: 'Emily Chen', date: '2024-01-08', amount: 275, status: 'paid', service: 'Vaccination', dueDate: '2024-01-22' },
  { id: 'INV-006', patient: 'Omar Ali', date: '2024-01-05', amount: 420, status: 'pending', service: 'Physical Exam', dueDate: '2024-01-19' },
];

// React-Select custom styles (for modal selects, filters use CustomSelect)
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '42px',
    borderColor: state.isFocused ? '#2A7CFF' : '#DDE2E8',
    boxShadow: state.isFocused ? '0 0 0 3px #E6F0FF' : 'none',
    '&:hover': { borderColor: '#2A7CFF' },
    borderRadius: '8px',
    fontSize: '14px',
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2A7CFF' : state.isFocused ? '#E6F0FF' : 'white',
    color: state.isSelected ? 'white' : '#1A1D1F',
    cursor: 'pointer',
    fontSize: '14px',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#97A0AB',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#1A1D1F',
  }),
};

function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoicesData);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  // Preview state
  const [previewInvoice, setPreviewInvoice] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    patient: '',
    dateFrom: '',
    dateTo: ''
  });

  // Form states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formService, setFormService] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDueDate, setFormDueDate] = useState('');

  // Apply filters to invoices data
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      if (filters.status && invoice.status !== filters.status) return false;
      if (filters.patient && invoice.patient !== filters.patient) return false;
      if (filters.dateFrom && new Date(invoice.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(invoice.date) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [invoices, filters]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({ status: '', patient: '', dateFrom: '', dateTo: '' });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const patientOptions = [
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Ahmed Hassan', label: 'Ahmed Hassan' },
    { value: 'Maria Garcia', label: 'Maria Garcia' },
    { value: 'John Smith', label: 'John Smith' },
    { value: 'Emily Chen', label: 'Emily Chen' },
    { value: 'Omar Ali', label: 'Omar Ali' },
  ];

  // DataTables columns configuration
  const columns = [
    { 
      data: 'id', 
      title: t('invoices.invoiceNumber'),
      render: (data) => `<span class="invoice-number">${data}</span>`
    },
    { data: 'patient', title: t('invoices.patient') },
    { 
      data: 'date', 
      title: t('invoices.date'),
      render: (data) => new Date(data).toLocaleDateString()
    },
    { 
      data: 'amount', 
      title: t('invoices.amount'),
      render: (data) => `<span class="amount">$${data.toFixed(2)}</span>`
    },
    { 
      data: 'status', 
      title: t('patients.status'),
      render: (data) => {
        const statusMap = { 'paid': 'confirmed', 'pending': 'pending', 'overdue': 'canceled' };
        const statusText = data === 'paid' ? t('invoices.paid') : data === 'pending' ? t('invoices.pending') : t('invoices.overdue');
        return `<span class="badge badge-${statusMap[data]}">${statusText}</span>`;
      }
    },
    {
      data: null,
      title: t('invoices.actions'),
      orderable: false,
      render: (data, type, row) => {
        return `<div class="action-btns">
          <button class="icon-btn view-btn" data-id="${row.id}" title="${t('common.view')}">
            <i class="fas fa-eye"></i>
          </button>
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

  const tableOptions = {
    order: [[2, 'desc']]
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setFormService('');
    setFormAmount('');
    setFormDueDate('');
    setEditingInvoice(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setSelectedPatient(patientOptions.find(p => p.value === invoice.patient) || null);
    setFormService(invoice.service || '');
    setFormAmount(invoice.amount.toString());
    setFormDueDate(invoice.dueDate || '');
    setShowModal(true);
  };

  const handleDelete = (invoiceId) => {
    setInvoices(invoices.filter(i => i.id !== invoiceId));
  };

  const handleSave = () => {
    if (editingInvoice) {
      setInvoices(invoices.map(i => 
        i.id === editingInvoice.id 
          ? { 
              ...i, 
              patient: selectedPatient?.value || i.patient,
              service: formService || i.service,
              amount: parseFloat(formAmount) || i.amount,
              dueDate: formDueDate || i.dueDate
            }
          : i
      ));
    } else {
      const newInvoice = {
        id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
        patient: selectedPatient?.value || 'New Patient',
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(formAmount) || 0,
        status: 'pending',
        service: formService,
        dueDate: formDueDate
      };
      setInvoices([newInvoice, ...invoices]);
    }
    setShowModal(false);
    resetForm();
  };

  // Handle row action clicks
  const handleRowClick = (invoice, e) => {
    const viewBtn = e.target.closest('.view-btn');
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    
    if (viewBtn) {
      const id = viewBtn.dataset.id;
      const inv = invoices.find(i => i.id === id);
      if (inv) setPreviewInvoice(inv);
      return;
    }
    
    if (editBtn) {
      const id = editBtn.dataset.id;
      const inv = invoices.find(i => i.id === id);
      if (inv) handleEdit(inv);
      return;
    }
    
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      handleDelete(id);
      return;
    }
  };

  // Handle print invoice
  const handlePrint = () => {
    const printContent = document.getElementById('invoice-preview-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${previewInvoice?.id} - Invoice</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; direction: ${isRTL ? 'rtl' : 'ltr'}; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .clinic-info h1 { color: #2A7CFF; margin: 0; font-size: 28px; }
            .clinic-info p { color: #666; margin: 5px 0; }
            .invoice-info { text-align: ${isRTL ? 'left' : 'right'}; }
            .invoice-info h2 { margin: 0; color: #1A1D1F; }
            .invoice-info p { color: #666; margin: 5px 0; }
            .patient-info { background: #f5f7fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .patient-info h3 { margin: 0 0 10px 0; color: #1A1D1F; }
            .patient-info p { margin: 5px 0; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: ${isRTL ? 'right' : 'left'}; border-bottom: 1px solid #eee; }
            th { background: #f5f7fa; font-weight: 600; color: #1A1D1F; }
            .total-row { font-weight: bold; font-size: 18px; }
            .total-row td { border-top: 2px solid #2A7CFF; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .status.paid { background: #E6F9F0; color: #12B76A; }
            .status.pending { background: #FFF8E6; color: #F79009; }
            .status.overdue { background: #FEE4E2; color: #F04438; }
            .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="invoices-page">
      <div className="page-header">
        <div className="header-left">
          <button 
            className={`btn btn-ghost ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            {t('common.filter')}
            {hasActiveFilters && <span className="filter-count">{Object.values(filters).filter(v => v !== '').length}</span>}
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button className="btn btn-ghost"><Download size={18} />{t('common.export')}</button>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} />
          {t('invoices.createInvoice')}
        </button>
      </div>

      {/* Collapsible Filters Panel */}
      {showFilters && (
        <div className="filters-panel card">
          <div className="filters-grid">
            <div className="filter-group">
              <label>{t('invoices.status')}</label>
              <CustomSelect
                placeholder={t('common.all')}
                value={filters.status ? { 
                  value: filters.status, 
                  label: filters.status === 'paid' ? t('invoices.paid') : 
                         filters.status === 'pending' ? t('invoices.pending') : t('invoices.overdue')
                } : null}
                onChange={(option) => setFilters({...filters, status: option?.value || ''})}
                options={[
                  { value: 'paid', label: t('invoices.paid') },
                  { value: 'pending', label: t('invoices.pending') },
                  { value: 'overdue', label: t('invoices.overdue') }
                ]}
              />
            </div>
            <div className="filter-group">
              <label>{t('invoices.patient')}</label>
              <CustomSelect
                placeholder={t('common.all')}
                value={filters.patient ? patientOptions.find(p => p.value === filters.patient) : null}
                onChange={(option) => setFilters({...filters, patient: option?.value || ''})}
                options={patientOptions}
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

      <div className="invoices-table-container card">
        <CustomDataTable
          data={filteredInvoices}
          columns={columns}
          options={tableOptions}
          className="invoices-datatable"
          onRowClick={handleRowClick}
        >
          <thead>
            <tr>
              <th>{t('invoices.invoiceNumber')}</th>
              <th>{t('invoices.patient')}</th>
              <th>{t('invoices.date')}</th>
              <th>{t('invoices.amount')}</th>
              <th>{t('patients.status')}</th>
              <th>{t('invoices.actions')}</th>
            </tr>
          </thead>
        </CustomDataTable>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal invoice-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingInvoice ? t('common.edit') : t('invoices.createInvoice')}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{t('invoices.patient')}</label>
                <Select
                  value={selectedPatient}
                  onChange={setSelectedPatient}
                  options={patientOptions}
                  placeholder={t('invoices.selectPatient')}
                  isClearable
                  isSearchable
                  isRtl={isRTL}
                  styles={selectStyles}
                  noOptionsMessage={() => t('common.noData')}
                />
              </div>
              <div className="form-group">
                <label>{t('invoices.service')}</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder={t('invoices.enterService')} 
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('invoices.amount')}</label>
                  <input 
                    type="number" 
                    className="input" 
                    placeholder="0.00" 
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>{t('invoices.dueDate')}</label>
                  <input 
                    type="date" 
                    className="input" 
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="invoice-items">
                <h4>{t('invoices.invoiceItems')}</h4>
                <div className="item-row">
                  <input type="text" className="input" placeholder={t('invoices.itemDescription')} />
                  <input type="number" className="input item-qty" placeholder={t('invoices.qty')} />
                  <input type="number" className="input item-price" placeholder={t('invoices.price')} />
                </div>
                <button className="btn btn-ghost btn-sm"><Plus size={16} /> {t('invoices.addItem')}</button>
              </div>
              <div className="invoice-total">
                <span>{t('invoices.total')}:</span>
                <span className="total-amount">${formAmount || '0.00'}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => { setShowModal(false); resetForm(); }}>{t('common.cancel')}</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editingInvoice ? t('common.save') : t('invoices.createInvoice')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {previewInvoice && (
        <div className="modal-overlay" onClick={() => setPreviewInvoice(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('invoices.invoicePreview')}</h2>
              <div className="modal-header-actions">
                <button className="btn btn-ghost btn-sm" onClick={handlePrint}>
                  <Printer size={18} />
                  {t('common.print')}
                </button>
                <button className="close-btn" onClick={() => setPreviewInvoice(null)}><X size={20} /></button>
              </div>
            </div>
            <div className="modal-body" id="invoice-preview-content">
              <div className="invoice-preview">
                <div className="invoice-header">
                  <div className="clinic-info">
                    <h1>ClinicFlow</h1>
                    <p>{t('invoices.clinicAddress')}</p>
                    <p>{t('invoices.clinicPhone')}</p>
                  </div>
                  <div className="invoice-info">
                    <h2>{previewInvoice.id}</h2>
                    <p>{t('invoices.date')}: {new Date(previewInvoice.date).toLocaleDateString()}</p>
                    <p>{t('invoices.dueDate')}: {new Date(previewInvoice.dueDate).toLocaleDateString()}</p>
                    <span className={`status ${previewInvoice.status}`}>
                      {previewInvoice.status === 'paid' ? t('invoices.paid') : 
                       previewInvoice.status === 'pending' ? t('invoices.pending') : 
                       t('invoices.overdue')}
                    </span>
                  </div>
                </div>
                <div className="patient-info">
                  <h3>{t('invoices.billTo')}</h3>
                  <p><strong>{previewInvoice.patient}</strong></p>
                </div>
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>{t('invoices.service')}</th>
                      <th>{t('invoices.qty')}</th>
                      <th>{t('invoices.price')}</th>
                      <th>{t('invoices.amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{previewInvoice.service}</td>
                      <td>1</td>
                      <td>${previewInvoice.amount.toFixed(2)}</td>
                      <td>${previewInvoice.amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan="3"><strong>{t('invoices.total')}</strong></td>
                      <td><strong>${previewInvoice.amount.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
                <div className="footer">
                  <p>{t('invoices.thankYou')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;
