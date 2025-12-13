import React, { useState } from 'react';
import Select from 'react-select';
import { Save } from 'lucide-react';
import { useTranslation, useDirection } from '../../context/DirectionContext';

// React-Select custom styles
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

function Settings() {
  const [activeTab, setActiveTab] = useState('clinic');
  const [selectedCountry, setSelectedCountry] = useState({ value: 'us', label: 'United States' });
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'sa', label: 'Saudi Arabia' },
    { value: 'ae', label: 'United Arab Emirates' },
    { value: 'eg', label: 'Egypt' },
  ];

  const weekDayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  const [workingHours, setWorkingHours] = useState(
    weekDayKeys.map((day, index) => ({ 
      dayKey: day, 
      enabled: index > 0 && index < 6, 
      open: '09:00', 
      close: '17:00' 
    }))
  );
  
  const [notifications, setNotifications] = useState({
    emailAppointments: true, emailReminders: true, smsAppointments: false, smsReminders: true
  });

  const toggleWorkingDay = (index) => {
    const updated = [...workingHours];
    updated[index].enabled = !updated[index].enabled;
    setWorkingHours(updated);
  };

  return (
    <div className="settings-page">
      <div className="settings-tabs">
        <button className={`tab ${activeTab === 'clinic' ? 'active' : ''}`} onClick={() => setActiveTab('clinic')}>{t('settings.clinicInfo')}</button>
        <button className={`tab ${activeTab === 'hours' ? 'active' : ''}`} onClick={() => setActiveTab('hours')}>{t('settings.workingHours')}</button>
        <button className={`tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>{t('settings.notifications')}</button>
      </div>

      <div className="settings-content card">
        {activeTab === 'clinic' && (
          <div className="tab-content">
            <h3>{t('settings.clinicInformation')}</h3>
            <p className="tab-description">{t('settings.updateClinicInfo')}</p>
            <div className="form-grid">
              <div className="form-group"><label>{t('settings.clinicName')}</label><input type="text" className="input" defaultValue="a2zenon ClinicFlow Medical Center" /></div>
              <div className="form-group"><label>{t('settings.phoneNumber')}</label><input type="tel" className="input" defaultValue="+1 555-0100" /></div>
              <div className="form-group"><label>{t('settings.emailAddress')}</label><input type="email" className="input" defaultValue="contact@clinicflow.com" /></div>
              <div className="form-group"><label>{t('settings.website')}</label><input type="url" className="input" defaultValue="https://clinicflow.com" /></div>
              <div className="form-group full-width"><label>{t('patientProfile.address')}</label><input type="text" className="input" defaultValue="123 Medical Center Dr, Suite 100" /></div>
              <div className="form-group"><label>{t('settings.city')}</label><input type="text" className="input" defaultValue="San Francisco" /></div>
              <div className="form-group"><label>{t('settings.stateProvince')}</label><input type="text" className="input" defaultValue="California" /></div>
              <div className="form-group"><label>{t('settings.postalCode')}</label><input type="text" className="input" defaultValue="94102" /></div>
              <div className="form-group">
                <label>{t('settings.country')}</label>
                <Select
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  options={countryOptions}
                  isClearable
                  isSearchable
                  isRtl={isRTL}
                  styles={selectStyles}
                  placeholder={t('common.search')}
                  noOptionsMessage={() => t('common.noData')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="tab-content">
            <h3>{t('settings.workingHours')}</h3>
            <p className="tab-description">{t('settings.setOperatingHours')}</p>
            <div className="hours-list">
              {workingHours.map((item, index) => (
                <div key={item.dayKey} className={`hours-row ${!item.enabled ? 'disabled' : ''}`}>
                  <div className="day-toggle">
                    <div className={`toggle ${item.enabled ? 'active' : ''}`} onClick={() => toggleWorkingDay(index)}></div>
                    <span className="day-name">{t(`days.${item.dayKey}`)}</span>
                  </div>
                  {item.enabled ? (
                    <div className="time-inputs">
                      <input type="time" className="input time-input" value={item.open} onChange={(e) => { const updated = [...workingHours]; updated[index].open = e.target.value; setWorkingHours(updated); }} />
                      <span className="time-separator">{t('settings.to')}</span>
                      <input type="time" className="input time-input" value={item.close} onChange={(e) => { const updated = [...workingHours]; updated[index].close = e.target.value; setWorkingHours(updated); }} />
                    </div>
                  ) : (
                    <span className="closed-label">{t('settings.closed')}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="tab-content">
            <h3>{t('settings.notificationPreferences')}</h3>
            <p className="tab-description">{t('settings.manageNotifications')}</p>
            <div className="notification-section">
              <h4>{t('settings.emailNotifications')}</h4>
              <div className="notification-item">
                <div className="notification-info"><span className="notification-title">{t('settings.appointmentConfirmations')}</span><span className="notification-desc">{t('settings.appointmentConfirmationsDesc')}</span></div>
                <div className={`toggle ${notifications.emailAppointments ? 'active' : ''}`} onClick={() => setNotifications({...notifications, emailAppointments: !notifications.emailAppointments})}></div>
              </div>
              <div className="notification-item">
                <div className="notification-info"><span className="notification-title">{t('settings.appointmentReminders')}</span><span className="notification-desc">{t('settings.appointmentRemindersDesc')}</span></div>
                <div className={`toggle ${notifications.emailReminders ? 'active' : ''}`} onClick={() => setNotifications({...notifications, emailReminders: !notifications.emailReminders})}></div>
              </div>
            </div>
            <div className="notification-section">
              <h4>{t('settings.smsNotifications')}</h4>
              <div className="notification-item">
                <div className="notification-info"><span className="notification-title">{t('settings.appointmentConfirmations')}</span><span className="notification-desc">{t('settings.appointmentConfirmationsDesc')}</span></div>
                <div className={`toggle ${notifications.smsAppointments ? 'active' : ''}`} onClick={() => setNotifications({...notifications, smsAppointments: !notifications.smsAppointments})}></div>
              </div>
              <div className="notification-item">
                <div className="notification-info"><span className="notification-title">{t('settings.appointmentReminders')}</span><span className="notification-desc">{t('settings.appointmentRemindersDesc')}</span></div>
                <div className={`toggle ${notifications.smsReminders ? 'active' : ''}`} onClick={() => setNotifications({...notifications, smsReminders: !notifications.smsReminders})}></div>
              </div>
            </div>
          </div>
        )}

        <div className="settings-footer">
          <button className="btn btn-primary"><Save size={18} />{t('settings.saveChanges')}</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
