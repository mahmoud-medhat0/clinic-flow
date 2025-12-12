import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Download,
  Eye,
  MoreVertical,
  X
} from 'lucide-react';
import './Invoices.css';

const invoicesData = [
  { id: 'INV-001', patient: 'Sarah Johnson', date: '2024-01-15', amount: 250, status: 'Paid' },
  { id: 'INV-002', patient: 'Ahmed Hassan', date: '2024-01-14', amount: 180, status: 'Paid' },
  { id: 'INV-003', patient: 'Maria Garcia', date: '2024-01-12', amount: 320, status: 'Pending' },
  { id: 'INV-004', patient: 'John Smith', date: '2024-01-10', amount: 150, status: 'Overdue' },
  { id: 'INV-005', patient: 'Emily Chen', date: '2024-01-08', amount: 275, status: 'Paid' },
  { id: 'INV-006', patient: 'Omar Ali', date: '2024-01-05', amount: 420, status: 'Pending' },
];

const StatusBadge = ({ status }) => {
  const statusMap = {
    'Paid': 'confirmed',
    'Pending': 'pending',
    'Overdue': 'canceled'
  };
  return <span className={`badge badge-${statusMap[status]}`}>{status}</span>;
};

function Invoices() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="invoices-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button className="btn btn-ghost">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-ghost">
            <Download size={18} />
            Export
          </button>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      {/* Table */}
      <div className="invoices-table-container card">
        <table className="table invoices-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoicesData.map((invoice) => (
              <tr key={invoice.id}>
                <td><span className="invoice-number">{invoice.id}</span></td>
                <td>{invoice.patient}</td>
                <td>{new Date(invoice.date).toLocaleDateString()}</td>
                <td><span className="amount">${invoice.amount.toFixed(2)}</span></td>
                <td><StatusBadge status={invoice.status} /></td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn" title="View">
                      <Eye size={16} />
                    </button>
                    <button className="icon-btn" title="More">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal invoice-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Invoice</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Patient</label>
                <select className="select">
                  <option>Select patient...</option>
                  <option>Sarah Johnson</option>
                  <option>Ahmed Hassan</option>
                  <option>Maria Garcia</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Service</label>
                <input type="text" className="input" placeholder="Enter service description" />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input type="number" className="input" placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" className="input" />
                </div>
              </div>

              <div className="invoice-items">
                <h4>Invoice Items</h4>
                <div className="item-row">
                  <input type="text" className="input" placeholder="Item description" />
                  <input type="number" className="input item-qty" placeholder="Qty" />
                  <input type="number" className="input item-price" placeholder="Price" />
                </div>
                <button className="btn btn-ghost btn-sm">
                  <Plus size={16} /> Add Item
                </button>
              </div>

              <div className="invoice-total">
                <span>Total:</span>
                <span className="total-amount">$0.00</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;
