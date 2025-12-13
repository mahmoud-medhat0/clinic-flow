import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useTranslation } from '../../context/DirectionContext';

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Format time with AM/PM translation
  const formatTime = (hour, minute) => {
    const isPM = hour >= 12;
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    const period = isPM ? t('time.pm') : t('time.am');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const appointments = [
    { hour: 9, minute: 0, patient: 'Sarah Johnson', type: 'Check-up', status: 'confirmed' },
    { hour: 9, minute: 30, patient: 'Ahmed Hassan', type: 'Follow-up', status: 'confirmed' },
    { hour: 10, minute: 0, patient: 'Maria Garcia', type: 'Consultation', status: 'pending' },
    { hour: 10, minute: 30, patient: 'John Smith', type: 'Lab Results', status: 'confirmed' },
    { hour: 11, minute: 0, patient: 'Emily Chen', type: 'Check-up', status: 'canceled' },
    { hour: 11, minute: 30, patient: 'Omar Ali', type: 'Vaccination', status: 'confirmed' },
  ];

  const stats = [
    { label: t('dashboard.appointmentsToday'), value: 12, change: '+8%', positive: true, icon: Calendar, color: 'primary' },
    { label: t('dashboard.monthlyRevenue'), value: '$24,500', change: '+12%', positive: true, icon: DollarSign, color: 'secondary' },
    { label: t('dashboard.newPatients'), value: 48, change: '+23%', positive: true, icon: Users, color: 'success' },
    { label: t('dashboard.avgWaitTime'), value: `14 ${t('time.min')}`, change: '-5%', positive: true, icon: Clock, color: 'warning' },
  ];

  const StatusBadge = ({ status }) => {
    return <span className={`badge badge-${status}`}>{t(`status.${status}`)}</span>;
  };

  // Quick action handlers
  const handleNewAppointment = () => {
    navigate('/appointments');
  };

  const handleAddPatient = () => {
    navigate('/patients');
  };

  const handleCreateInvoice = () => {
    navigate('/invoices');
  };

  const handleViewReports = () => {
    // For now, navigate to settings. Can be changed to a reports page later
    navigate('/settings');
  };

  return (
    <div className="dashboard">
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

      <div className="content-grid">
        <div className="card appointments-card">
          <div className="card-header">
            <h3>{t('dashboard.todaysAppointments')}</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/appointments')}>
              {t('common.viewAll')}
            </button>
          </div>
          <div className="appointments-list">
            {appointments.map((apt, index) => (
              <div key={index} className="appointment-item">
                <div className="appointment-time">{formatTime(apt.hour, apt.minute)}</div>
                <div className="appointment-info">
                  <span className="patient-name">{apt.patient}</span>
                  <span className="appointment-type">{apt.type}</span>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card quick-actions-card">
          <div className="card-header">
            <h3>{t('dashboard.quickActions')}</h3>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={handleNewAppointment}>
              <Calendar size={24} />
              <span>{t('dashboard.newAppointment')}</span>
            </button>
            <button className="quick-action-btn" onClick={handleAddPatient}>
              <Users size={24} />
              <span>{t('dashboard.addPatient')}</span>
            </button>
            <button className="quick-action-btn" onClick={handleCreateInvoice}>
              <DollarSign size={24} />
              <span>{t('dashboard.createInvoice')}</span>
            </button>
            <button className="quick-action-btn" onClick={handleViewReports}>
              <TrendingUp size={24} />
              <span>{t('dashboard.viewReports')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
