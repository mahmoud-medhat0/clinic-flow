import React, { useState } from 'react';
import { Monitor, Calendar, Users, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const ScreenshotsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const screenshots = [
    {
      id: 'dashboard',
      icon: Monitor,
      title: 'Dashboard',
      description: 'Get a complete overview of your clinic at a glance',
    },
    {
      id: 'appointments',
      icon: Calendar,
      title: 'Appointments',
      description: 'Manage your schedule with ease',
    },
    {
      id: 'patients',
      icon: Users,
      title: 'Patient Records',
      description: 'Access complete patient information',
    },
    {
      id: 'invoices',
      icon: FileText,
      title: 'Invoices',
      description: 'Track payments and billing',
    },
  ];

  const MockDashboard = () => (
    <div className="bg-gray-50 p-6 h-full">
      <div className="bg-white rounded-xl shadow-soft p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Dashboard Overview</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-primary-50 text-primary-600 rounded-lg">Today</button>
            <button className="px-3 py-1.5 text-sm text-gray-500 rounded-lg">Week</button>
            <button className="px-3 py-1.5 text-sm text-gray-500 rounded-lg">Month</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today's Patients", value: '12', color: 'primary' },
            { label: 'Pending', value: '5', color: 'amber' },
            { label: 'Completed', value: '7', color: 'green' },
            { label: 'Revenue', value: '$2,450', color: 'teal' },
          ].map((stat) => (
            <div key={stat.label} className={`p-4 rounded-xl bg-${stat.color === 'primary' ? 'primary' : stat.color === 'teal' ? 'teal' : stat.color === 'green' ? 'green' : 'amber'}-50`}>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color === 'primary' ? 'primary' : stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Upcoming Appointments</h4>
            <div className="space-y-2">
              {['Dr. Sarah - 10:00 AM', 'Dr. John - 11:30 AM', 'Dr. Lisa - 2:00 PM'].map((apt) => (
                <div key={apt} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-sm text-gray-600">{apt}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {['New patient registered', 'Invoice #1234 paid', 'Appointment confirmed'].map((activity) => (
                <div key={activity} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-sm text-gray-600">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MockAppointments = () => (
    <div className="bg-gray-50 p-6 h-full">
      <div className="bg-white rounded-xl shadow-soft p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-teal-500 text-white text-sm font-medium rounded-lg">+ New Appointment</button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
          ))}
          {[...Array(28)].map((_, i) => (
            <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
              i === 5 || i === 10 || i === 15 ? 'bg-primary-100 text-primary-700 font-semibold' :
              i === 8 || i === 20 ? 'bg-teal-100 text-teal-700 font-semibold' :
              'bg-gray-50 text-gray-600'
            }`}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MockPatients = () => (
    <div className="bg-gray-50 p-6 h-full">
      <div className="bg-white rounded-xl shadow-soft p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Patient Records</h3>
          <div className="flex gap-2">
            <input type="text" placeholder="Search patients..." className="px-3 py-2 text-sm border border-gray-200 rounded-lg w-48" />
            <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-teal-500 text-white text-sm font-medium rounded-lg">+ Add Patient</button>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Ahmed Hassan', id: 'P-001', lastVisit: '2 days ago', status: 'Active' },
            { name: 'Sarah Johnson', id: 'P-002', lastVisit: '1 week ago', status: 'Active' },
            { name: 'Mohamed Ali', id: 'P-003', lastVisit: '3 days ago', status: 'Active' },
            { name: 'Emily Brown', id: 'P-004', lastVisit: '2 weeks ago', status: 'Pending' },
          ].map((patient) => (
            <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-semibold">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{patient.name}</p>
                  <p className="text-xs text-gray-500">{patient.id} • Last visit: {patient.lastVisit}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{patient.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MockInvoices = () => (
    <div className="bg-gray-50 p-6 h-full">
      <div className="bg-white rounded-xl shadow-soft p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Invoices</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-teal-500 text-white text-sm font-medium rounded-lg">+ Create Invoice</button>
        </div>
        <div className="space-y-3">
          {[
            { id: 'INV-001', patient: 'Ahmed Hassan', amount: '$150', status: 'Paid', date: 'Dec 10, 2024' },
            { id: 'INV-002', patient: 'Sarah Johnson', amount: '$280', status: 'Pending', date: 'Dec 9, 2024' },
            { id: 'INV-003', patient: 'Mohamed Ali', amount: '$95', status: 'Paid', date: 'Dec 8, 2024' },
            { id: 'INV-004', patient: 'Emily Brown', amount: '$350', status: 'Overdue', date: 'Dec 1, 2024' },
          ].map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{invoice.id}</p>
                  <p className="text-xs text-gray-500">{invoice.patient} • {invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-800">{invoice.amount}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                  invoice.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
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
    <section id="screenshots" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 text-primary-700 font-medium text-sm mb-4">
            Product Preview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            See{' '}
            <span className="bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
              ClinicFlow
            </span>{' '}
            in action
          </h2>
          <p className="text-lg text-gray-600">
            A powerful yet intuitive interface designed for healthcare professionals.
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
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <screen.icon className="w-4 h-4" />
              {screen.title}
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
          <div className="bg-white rounded-b-2xl shadow-soft-xl overflow-hidden border border-gray-200 border-t-0" style={{ height: '400px' }}>
            <ActiveScreen />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setActiveTab(activeTab === 0 ? screenshots.length - 1 : activeTab - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-soft-lg flex items-center justify-center text-gray-600 hover:text-primary-600 hover:scale-110 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab(activeTab === screenshots.length - 1 ? 0 : activeTab + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-soft-lg flex items-center justify-center text-gray-600 hover:text-primary-600 hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Active Tab Description */}
        <div className="text-center mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{screenshots[activeTab].title}</h3>
          <p className="text-gray-600">{screenshots[activeTab].description}</p>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;
