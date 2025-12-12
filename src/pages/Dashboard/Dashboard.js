import React from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import './Dashboard.css';

// Sample data
const stats = [
  { 
    label: 'Appointments Today', 
    value: 12, 
    change: '+8%', 
    positive: true,
    icon: Calendar,
    color: 'primary'
  },
  { 
    label: 'Monthly Revenue', 
    value: '$24,500', 
    change: '+12%', 
    positive: true,
    icon: DollarSign,
    color: 'secondary'
  },
  { 
    label: 'New Patients', 
    value: 48, 
    change: '+23%', 
    positive: true,
    icon: Users,
    color: 'success'
  },
  { 
    label: 'Avg Wait Time', 
    value: '14 min', 
    change: '-5%', 
    positive: true,
    icon: Clock,
    color: 'warning'
  },
];

const appointments = [
  { time: '09:00 AM', patient: 'Sarah Johnson', type: 'Check-up', status: 'Confirmed' },
  { time: '09:30 AM', patient: 'Ahmed Hassan', type: 'Follow-up', status: 'Confirmed' },
  { time: '10:00 AM', patient: 'Maria Garcia', type: 'Consultation', status: 'Pending' },
  { time: '10:30 AM', patient: 'John Smith', type: 'Lab Results', status: 'Confirmed' },
  { time: '11:00 AM', patient: 'Emily Chen', type: 'Check-up', status: 'Canceled' },
  { time: '11:30 AM', patient: 'Omar Ali', type: 'Vaccination', status: 'Confirmed' },
];

const StatusBadge = ({ status }) => {
  const statusClass = status.toLowerCase();
  return <span className={`badge badge-${statusClass}`}>{status}</span>;
};

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card card">
              <div className="stat-header">
                <div className={`stat-icon stat-icon-${stat.color}`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Upcoming Appointments */}
        <div className="card appointments-card">
          <div className="card-header">
            <h3>Today's Appointments</h3>
            <button className="btn btn-ghost btn-sm">View All</button>
          </div>
          <div className="appointments-list">
            {appointments.map((apt, index) => (
              <div key={index} className="appointment-item">
                <div className="appointment-time">{apt.time}</div>
                <div className="appointment-info">
                  <span className="patient-name">{apt.patient}</span>
                  <span className="appointment-type">{apt.type}</span>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn">
              <Calendar size={24} />
              <span>New Appointment</span>
            </button>
            <button className="quick-action-btn">
              <Users size={24} />
              <span>Add Patient</span>
            </button>
            <button className="quick-action-btn">
              <DollarSign size={24} />
              <span>Create Invoice</span>
            </button>
            <button className="quick-action-btn">
              <TrendingUp size={24} />
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
