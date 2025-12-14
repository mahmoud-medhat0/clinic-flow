import React, { useState } from 'react';
import { Monitor, Calendar, Users, FileText, ChevronLeft, ChevronRight, DollarSign, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const ScreenshotsSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();

  const screenshots = [
    {
      id: 'dashboard',
      icon: Monitor,
      titleKey: 'landing.screenshots.dashboard',
      descriptionKey: 'landing.screenshots.dashboardDesc',
    },
    {
      id: 'appointments',
      icon: Calendar,
      titleKey: 'landing.screenshots.appointments',
      descriptionKey: 'landing.screenshots.appointmentsDesc',
    },
    {
      id: 'patients',
      icon: Users,
      titleKey: 'landing.screenshots.patients',
      descriptionKey: 'landing.screenshots.patientsDesc',
    },
    {
      id: 'invoices',
      icon: FileText,
      titleKey: 'landing.screenshots.invoices',
      descriptionKey: 'landing.screenshots.invoicesDesc',
    },
  ];

  // Mock Dashboard - matches actual Dashboard.jsx layout
  const MockDashboard = () => (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 h-full overflow-hidden">
      {/* Stats Grid - 4 columns like actual dashboard */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: t('dashboard.appointmentsToday'), value: '12', change: '+8%', icon: Calendar, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
          { label: t('dashboard.monthlyRevenue'), value: '$24.5K', change: '+12%', icon: DollarSign, color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600' },
          { label: t('dashboard.newPatients'), value: '48', change: '+23%', icon: Users, color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
          { label: t('dashboard.avgWaitTime'), value: '14m', change: '-5%', icon: Clock, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Grid - 2 columns like actual dashboard */}
      <div className="grid grid-cols-3 gap-3 h-48">
        {/* Today's Appointments */}
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white">{t('dashboard.todaysAppointments')}</h4>
            <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">{t('common.viewAll')}</button>
          </div>
          <div className="p-2 space-y-1">
            {[
              { time: '9:00 AM', patient: 'Sarah Johnson', type: 'Check-up', status: 'confirmed' },
              { time: '9:30 AM', patient: 'Ahmed Hassan', type: 'Follow-up', status: 'confirmed' },
              { time: '10:00 AM', patient: 'Maria Garcia', type: 'Consultation', status: 'pending' },
              { time: '10:30 AM', patient: 'John Smith', type: 'Lab Results', status: 'confirmed' },
            ].map((apt) => (
              <div key={apt.time} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-14">{apt.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{apt.patient}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{apt.type}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  apt.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                  'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                }`}>{apt.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white">{t('dashboard.quickActions')}</h4>
          </div>
          <div className="p-3 space-y-2">
            {[
              { icon: Calendar, label: t('dashboard.newAppointment'), color: 'text-blue-600' },
              { icon: Users, label: t('dashboard.addPatient'), color: 'text-teal-600' },
              { icon: DollarSign, label: t('dashboard.createInvoice'), color: 'text-green-600' },
              { icon: TrendingUp, label: t('dashboard.viewReports'), color: 'text-purple-600' },
            ].map((action) => (
              <button key={action.label} className="w-full flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <action.icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const MockAppointments = () => (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 h-full">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{t('landing.screenshots.appointments')}</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 rounded-lg">{t('appointments.calendarView')}</button>
            <button className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 rounded-lg">{t('appointments.listView')}</button>
            <button className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-teal-500 text-white text-xs font-medium rounded-lg">+ {t('landing.screenshots.newAppointment')}</button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(28)].map((_, i) => (
              <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                i === 5 || i === 10 || i === 15 ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-semibold ring-2 ring-primary-500' :
                i === 8 || i === 20 ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold' :
                'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const MockPatients = () => (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 h-full">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{t('landing.screenshots.patientRecords')}</h3>
          <div className="flex gap-2">
            <input type="text" placeholder={t('landing.screenshots.searchPatients')} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg w-40 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400" />
            <button className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-teal-500 text-white text-xs font-medium rounded-lg">+ {t('landing.screenshots.addPatient')}</button>
          </div>
        </div>
        <div className="p-3 space-y-2">
          {[
            { name: 'Ahmed Hassan', id: 'P-001', phone: '+1 234 567 890', email: 'ahmed@email.com', status: 'Active' },
            { name: 'Sarah Johnson', id: 'P-002', phone: '+1 234 567 891', email: 'sarah@email.com', status: 'Active' },
            { name: 'Mohamed Ali', id: 'P-003', phone: '+1 234 567 892', email: 'mohamed@email.com', status: 'Active' },
            { name: 'Emily Brown', id: 'P-004', phone: '+1 234 567 893', email: 'emily@email.com', status: 'Pending' },
            { name: 'John Smith', id: 'P-005', phone: '+1 234 567 894', email: 'john@email.com', status: 'Active' },
          ].map((patient) => (
            <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white text-xs font-semibold">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{patient.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{patient.id} • {patient.phone}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${patient.status === 'Active' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'}`}>{patient.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MockInvoices = () => (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 h-full">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{t('landing.screenshots.invoices')}</h3>
          <button className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-teal-500 text-white text-xs font-medium rounded-lg">+ {t('landing.screenshots.createInvoice')}</button>
        </div>
        <div className="p-3 space-y-2">
          {[
            { id: 'INV-001', patient: 'Ahmed Hassan', amount: '$150.00', status: 'Paid', date: 'Dec 10, 2024' },
            { id: 'INV-002', patient: 'Sarah Johnson', amount: '$280.00', status: 'Pending', date: 'Dec 9, 2024' },
            { id: 'INV-003', patient: 'Mohamed Ali', amount: '$95.00', status: 'Paid', date: 'Dec 8, 2024' },
            { id: 'INV-004', patient: 'Emily Brown', amount: '$350.00', status: 'Overdue', date: 'Dec 1, 2024' },
            { id: 'INV-005', patient: 'John Smith', amount: '$125.00', status: 'Paid', date: 'Nov 28, 2024' },
          ].map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{invoice.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.patient} • {invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{invoice.amount}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  invoice.status === 'Paid' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                  invoice.status === 'Pending' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' :
                  'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                }`}>{invoice.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const mockScreens = [MockDashboard, MockAppointments, MockPatients, MockInvoices];
  const ActiveScreen = mockScreens[activeTab];

  return (
    <section id="screenshots" className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 dark:from-primary-900/50 dark:to-teal-900/50 text-primary-700 dark:text-primary-300 font-medium text-sm mb-4">
            {t('landing.screenshots.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('landing.screenshots.title')}{' '}
            <span className="bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
              ClinicFlow
            </span>{' '}
            {t('landing.screenshots.titleSuffix')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('landing.screenshots.description')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {screenshots.map((screen, index) => (
            <button
              key={screen.id}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-glow'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <screen.icon className="w-4 h-4" />
              {t(screen.titleKey)}
            </button>
          ))}
        </div>

        {/* Screenshot Display */}
        <div className="relative">
          {/* Browser Frame */}
          <div className="bg-gray-800 rounded-t-2xl p-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-700 rounded-lg px-4 py-1.5 text-sm text-gray-300 text-center">
                app.clinicflow.com/{screenshots[activeTab].id}
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-soft-xl overflow-hidden border border-gray-200 dark:border-gray-700 border-t-0" style={{ height: '400px' }}>
            <ActiveScreen />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setActiveTab(activeTab === 0 ? screenshots.length - 1 : activeTab - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-soft-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab(activeTab === screenshots.length - 1 ? 0 : activeTab + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-soft-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Active Tab Description */}
        <div className="text-center mt-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{t(screenshots[activeTab].titleKey)}</h3>
          <p className="text-gray-600 dark:text-gray-300">{t(screenshots[activeTab].descriptionKey)}</p>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;
