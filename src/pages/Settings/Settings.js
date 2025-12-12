import React, { useState } from 'react';
import { Save } from 'lucide-react';
import './Settings.css';

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Settings() {
  const [activeTab, setActiveTab] = useState('clinic');
  const [workingHours, setWorkingHours] = useState(
    weekDays.map((day, index) => ({
      day,
      enabled: index > 0 && index < 6,
      open: '09:00',
      close: '17:00'
    }))
  );

  const [notifications, setNotifications] = useState({
    emailAppointments: true,
    emailReminders: true,
    smsAppointments: false,
    smsReminders: true
  });

  const toggleWorkingDay = (index) => {
    const updated = [...workingHours];
    updated[index].enabled = !updated[index].enabled;
    setWorkingHours(updated);
  };

  return (
    <div className="settings-page">
      {/* Tabs */}
      <div className="settings-tabs">
        <button 
          className={`tab ${activeTab === 'clinic' ? 'active' : ''}`}
          onClick={() => setActiveTab('clinic')}
        >
          Clinic Info
        </button>
        <button 
          className={`tab ${activeTab === 'hours' ? 'active' : ''}`}
          onClick={() => setActiveTab('hours')}
        >
          Working Hours
        </button>
        <button 
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      {/* Content */}
      <div className="settings-content card">
        {/* Clinic Info Tab */}
        {activeTab === 'clinic' && (
          <div className="tab-content">
            <h3>Clinic Information</h3>
            <p className="tab-description">Update your clinic's basic information</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Clinic Name</label>
                <input type="text" className="input" defaultValue="a2zenon ClinicFlow Medical Center" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="input" defaultValue="+1 555-0100" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="input" defaultValue="contact@clinicflow.com" />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input type="url" className="input" defaultValue="https://clinicflow.com" />
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <input type="text" className="input" defaultValue="123 Medical Center Dr, Suite 100" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" className="input" defaultValue="San Francisco" />
              </div>
              <div className="form-group">
                <label>State/Province</label>
                <input type="text" className="input" defaultValue="California" />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" className="input" defaultValue="94102" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select className="select">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Working Hours Tab */}
        {activeTab === 'hours' && (
          <div className="tab-content">
            <h3>Working Hours</h3>
            <p className="tab-description">Set your clinic's operating hours</p>
            
            <div className="hours-list">
              {workingHours.map((item, index) => (
                <div key={item.day} className={`hours-row ${!item.enabled ? 'disabled' : ''}`}>
                  <div className="day-toggle">
                    <div 
                      className={`toggle ${item.enabled ? 'active' : ''}`}
                      onClick={() => toggleWorkingDay(index)}
                    ></div>
                    <span className="day-name">{item.day}</span>
                  </div>
                  {item.enabled ? (
                    <div className="time-inputs">
                      <input 
                        type="time" 
                        className="input time-input" 
                        value={item.open}
                        onChange={(e) => {
                          const updated = [...workingHours];
                          updated[index].open = e.target.value;
                          setWorkingHours(updated);
                        }}
                      />
                      <span className="time-separator">to</span>
                      <input 
                        type="time" 
                        className="input time-input" 
                        value={item.close}
                        onChange={(e) => {
                          const updated = [...workingHours];
                          updated[index].close = e.target.value;
                          setWorkingHours(updated);
                        }}
                      />
                    </div>
                  ) : (
                    <span className="closed-label">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="tab-content">
            <h3>Notification Preferences</h3>
            <p className="tab-description">Manage how you receive notifications</p>
            
            <div className="notification-section">
              <h4>Email Notifications</h4>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Appointment Confirmations</span>
                  <span className="notification-desc">Receive emails when appointments are booked</span>
                </div>
                <div 
                  className={`toggle ${notifications.emailAppointments ? 'active' : ''}`}
                  onClick={() => setNotifications({...notifications, emailAppointments: !notifications.emailAppointments})}
                ></div>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Appointment Reminders</span>
                  <span className="notification-desc">Get reminded about upcoming appointments</span>
                </div>
                <div 
                  className={`toggle ${notifications.emailReminders ? 'active' : ''}`}
                  onClick={() => setNotifications({...notifications, emailReminders: !notifications.emailReminders})}
                ></div>
              </div>
            </div>

            <div className="notification-section">
              <h4>SMS Notifications</h4>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Appointment Confirmations</span>
                  <span className="notification-desc">Receive SMS when appointments are booked</span>
                </div>
                <div 
                  className={`toggle ${notifications.smsAppointments ? 'active' : ''}`}
                  onClick={() => setNotifications({...notifications, smsAppointments: !notifications.smsAppointments})}
                ></div>
              </div>
              <div className="notification-item">
                <div className="notification-info">
                  <span className="notification-title">Appointment Reminders</span>
                  <span className="notification-desc">Get SMS reminders for upcoming appointments</span>
                </div>
                <div 
                  className={`toggle ${notifications.smsReminders ? 'active' : ''}`}
                  onClick={() => setNotifications({...notifications, smsReminders: !notifications.smsReminders})}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="settings-footer">
          <button className="btn btn-primary">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
