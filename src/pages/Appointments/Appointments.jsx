import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { ChevronLeft, ChevronRight, Plus, Filter, Clock, X, Edit, Trash2, ChevronDown, ChevronUp, RotateCcw, Calendar, List, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTranslation, useDirection } from '../../context/DirectionContext';
import CustomSelect from '../../components/common/CustomSelect';

const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00'];

const initialAppointments = [
  { id: 1, day: 1, time: '09:00', patient: 'Sarah Johnson', type: 'Check-up', duration: 30, notes: '' },
  { id: 2, day: 1, time: '10:30', patient: 'Ahmed Hassan', type: 'Follow-up', duration: 30, notes: '' },
  { id: 3, day: 2, time: '09:30', patient: 'Maria Garcia', type: 'Consultation', duration: 60, notes: '' },
  { id: 4, day: 3, time: '14:00', patient: 'John Smith', type: 'Lab Results', duration: 30, notes: '' },
  { id: 5, day: 4, time: '10:00', patient: 'Emily Chen', type: 'Check-up', duration: 30, notes: '' },
  { id: 6, day: 5, time: '11:00', patient: 'Omar Ali', type: 'Vaccination', duration: 30, notes: '' },
];

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
};

function Appointments() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  // View mode: 'calendar' or 'list'
  const [viewMode, setViewMode] = useState('calendar');

  // Form states
  const [formPatient, setFormPatient] = useState(null);
  const [formType, setFormType] = useState(null);
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    patient: '',
    dateFrom: '',
    dateTo: ''
  });

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const resetFilters = () => {
    setFilters({ type: '', patient: '', dateFrom: '', dateTo: '' });
  };

  const weekDayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const patientOptions = [
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Ahmed Hassan', label: 'Ahmed Hassan' },
    { value: 'Maria Garcia', label: 'Maria Garcia' },
    { value: 'John Smith', label: 'John Smith' },
    { value: 'Emily Chen', label: 'Emily Chen' },
    { value: 'Omar Ali', label: 'Omar Ali' },
  ];

  const typeOptions = [
    { value: 'Check-up', label: t('appointments.checkUp') },
    { value: 'Follow-up', label: t('appointments.followUp') },
    { value: 'Consultation', label: t('appointments.consultation') },
    { value: 'Lab Results', label: t('appointments.labResults') },
    { value: 'Vaccination', label: t('appointments.vaccination') },
  ];

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newDate);
  };

  const resetForm = () => {
    setFormPatient(null);
    setFormType(null);
    setFormDate('');
    setFormTime('');
    setFormNotes('');
    setEditingAppointment(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (apt) => {
    setEditingAppointment(apt);
    setFormPatient(patientOptions.find(p => p.value === apt.patient) || null);
    setFormType(typeOptions.find(t => t.value === apt.type) || null);
    setFormTime(apt.time);
    setFormNotes(apt.notes || '');
    setShowModal(true);
    setSelectedAppointment(null);
  };

  const handleDelete = (aptId) => {
    setAppointments(appointments.filter(a => a.id !== aptId));
    setSelectedAppointment(null);
  };

  // Handle drag end for appointments
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    // If dropped outside droppable area
    if (!destination) return;
    
    // If dropped in same spot
    if (source.droppableId === destination.droppableId) return;
    
    // Parse destination ID format: "day-{dayIndex}-slot-{time}"
    // Use more robust parsing since time contains colons
    const destId = destination.droppableId;
    const dayMatch = destId.match(/day-(\d+)-slot-(.+)/);
    
    if (!dayMatch) return;
    
    const newDay = parseInt(dayMatch[1]);
    const newTime = dayMatch[2];
    
    // Update appointment with new day and time
    const aptId = parseInt(draggableId.replace('apt-', ''));
    setAppointments(prev => prev.map(apt => 
      apt.id === aptId 
        ? { ...apt, day: newDay, time: newTime }
        : apt
    ));
    setSelectedAppointment(null);
  };

  const handleSave = () => {
    if (editingAppointment) {
      // Edit existing
      setAppointments(appointments.map(a => 
        a.id === editingAppointment.id 
          ? { 
              ...a, 
              patient: formPatient?.value || a.patient,
              type: formType?.value || a.type,
              time: formTime || a.time,
              notes: formNotes
            }
          : a
      ));
    } else {
      // Add new
      const newApt = {
        id: Date.now(),
        day: new Date().getDay(),
        time: formTime || '09:00',
        patient: formPatient?.value || 'New Patient',
        type: formType?.value || 'Check-up',
        duration: 30,
        notes: formNotes
      };
      setAppointments([...appointments, newApt]);
    }
    setShowModal(false);
    resetForm();
  };

  // Prepare data for DataTable - convert appointments to include full date
  const tableData = useMemo(() => {
    return appointments.map(apt => {
      const aptDate = new Date(weekDates[apt.day] || new Date());
      return {
        ...apt,
        date: aptDate.toISOString().split('T')[0],
        dateFormatted: aptDate.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      };
    });
  }, [appointments, weekDates, isRTL]);

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div className="header-left">
          <div className="week-navigation">
            <button className="nav-btn" onClick={() => navigateWeek(isRTL ? 1 : -1)}>
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <span className="current-week">
              {weekDates[0].toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button className="nav-btn" onClick={() => navigateWeek(isRTL ? -1 : 1)}>
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrentWeek(new Date())}>
            {t('common.today')}
          </button>
        </div>
        <div className="header-right">
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
              title={t('appointments.calendarView')}
            >
              <Calendar size={18} />
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title={t('appointments.listView')}
            >
              <List size={18} />
            </button>
          </div>
          <button 
            className={`btn btn-ghost ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            {t('common.filter')}
            {hasActiveFilters && <span className="filter-count">{Object.values(filters).filter(v => v !== '').length}</span>}
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={18} />
            {t('appointments.newAppointment')}
          </button>
        </div>
      </div>

      {/* Collapsible Filters Panel */}
      {showFilters && (
        <div className="filters-panel card">
          <div className="filters-grid">
            <div className="filter-group">
              <label>{t('appointments.type')}</label>
              <CustomSelect
                placeholder={t('common.all')}
                value={filters.type ? { value: filters.type, label: typeOptions.find(o => o.value === filters.type)?.label || filters.type } : null}
                onChange={(option) => setFilters({...filters, type: option?.value || ''})}
                options={typeOptions}
              />
            </div>
            <div className="filter-group">
              <label>{t('appointments.patient')}</label>
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

      {/* Calendar View */}
      {viewMode === 'calendar' && (
      <DragDropContext onDragEnd={onDragEnd}>
      <div className="calendar-container card">
        <div className="calendar-grid">
          <div className="time-column">
            <div className="time-header"></div>
            {timeSlots.map((time) => {
              const [hours, minutes] = time.split(':').map(Number);
              const isPM = hours >= 12;
              const hour12 = hours % 12 || 12;
              const ampm = isPM ? t('common.pm') : t('common.am');
              const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
              return (
                <div key={time} className="time-slot">
                  <Clock size={12} />
                  {formattedTime}
                </div>
              );
            })}
          </div>

          {weekDates.map((date, dayIndex) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const dayAppointments = appointments.filter(apt => apt.day === dayIndex);

            return (
              <div key={dayIndex} className={`day-column ${isToday ? 'today' : ''}`}>
                <div className={`day-header ${isToday ? 'today' : ''}`}>
                  <span className="day-name">{t(`days.${weekDayKeys[dayIndex]}`)}</span>
                  <span className={`day-date ${isToday ? 'today' : ''}`}>{date.getDate()}</span>
                </div>
                <div className="day-slots">
                  {timeSlots.map((time) => {
                    const appointment = dayAppointments.find(apt => apt.time === time);
                    const slotId = `day-${dayIndex}-slot-${time}`;
                    return (
                      <Droppable key={slotId} droppableId={slotId}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`slot ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                          >
                            {appointment && (
                              <Draggable draggableId={`apt-${appointment.id}`} index={0}>
                                {(provided, snapshot) => (
                                  <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`appointment-block ${snapshot.isDragging ? 'dragging' : ''}`}
                                    onClick={() => setSelectedAppointment(selectedAppointment?.id === appointment.id ? null : appointment)}
                                  >
                                    <span {...provided.dragHandleProps} className="drag-handle">
                                      <GripVertical size={14} />
                                    </span>
                                    <div className="apt-content">
                                      <span className="apt-patient">{appointment.patient}</span>
                                      <span className="apt-type">
                                        {appointment.type === 'Check-up' ? t('appointments.checkUp') :
                                         appointment.type === 'Follow-up' ? t('appointments.followUp') :
                                         appointment.type === 'Consultation' ? t('appointments.consultation') :
                                         appointment.type === 'Lab Results' ? t('appointments.labResults') :
                                         appointment.type === 'Vaccination' ? t('appointments.vaccination') :
                                         appointment.type}
                                      </span>
                                    </div>
                                    {selectedAppointment?.id === appointment.id && (
                                      <div className="apt-actions" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => handleEdit(appointment)}><Edit size={12} /></button>
                                        <button onClick={() => handleDelete(appointment.id)}><Trash2 size={12} /></button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </DragDropContext>
      )}

      {/* List View - Draggable List */}
      {viewMode === 'list' && (
      <DragDropContext onDragEnd={(result) => {
        if (!result.destination) return;
        const items = Array.from(appointments);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setAppointments(items);
      }}>
        <div className="appointments-list card">
          <div className="list-header">
            <span className="col-drag"></span>
            <span className="col-date">{t('invoices.date')}</span>
            <span className="col-time">{t('appointments.time')}</span>
            <span className="col-patient">{t('appointments.patient')}</span>
            <span className="col-type">{t('appointments.type')}</span>
            <span className="col-actions">{t('invoices.actions')}</span>
          </div>
          <Droppable droppableId="appointments-list">
            {(provided) => (
              <div className="list-body" ref={provided.innerRef} {...provided.droppableProps}>
                {tableData.map((apt, index) => {
                  const [hours, minutes] = apt.time.split(':').map(Number);
                  const isPM = hours >= 12;
                  const hour12 = hours % 12 || 12;
                  const ampm = isPM ? (isRTL ? 'م' : 'PM') : (isRTL ? 'ص' : 'AM');
                  const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
                  const typeMap = {
                    'Check-up': t('appointments.checkUp'),
                    'Follow-up': t('appointments.followUp'),
                    'Consultation': t('appointments.consultation'),
                    'Lab Results': t('appointments.labResults'),
                    'Vaccination': t('appointments.vaccination')
                  };
                  return (
                    <Draggable key={apt.id} draggableId={`list-apt-${apt.id}`} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`list-row ${snapshot.isDragging ? 'dragging' : ''}`}
                        >
                          <span {...provided.dragHandleProps} className="col-drag drag-handle">
                            <GripVertical size={16} />
                          </span>
                          <span className="col-date">{apt.dateFormatted}</span>
                          <span className="col-time">{formattedTime}</span>
                          <span className="col-patient">{apt.patient}</span>
                          <span className="col-type">
                            <span className="badge badge-confirmed">{typeMap[apt.type] || apt.type}</span>
                          </span>
                          <span className="col-actions">
                            <button className="icon-btn" onClick={() => handleEdit(apt)} title={t('common.edit')}>
                              <Edit size={16} />
                            </button>
                            <button className="icon-btn" onClick={() => handleDelete(apt.id)} title={t('common.delete')}>
                              <Trash2 size={16} />
                            </button>
                          </span>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      )}

      {/* Add/Edit Appointment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAppointment ? t('common.edit') : t('appointments.newAppointment')}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{t('invoices.patient')}</label>
                <Select
                  value={formPatient}
                  onChange={setFormPatient}
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
                <label>{t('appointments.title')}</label>
                <Select
                  value={formType}
                  onChange={setFormType}
                  options={typeOptions}
                  placeholder={t('common.search')}
                  isClearable
                  isSearchable
                  isRtl={isRTL}
                  styles={selectStyles}
                  noOptionsMessage={() => t('common.noData')}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('invoices.date')}</label>
                  <input 
                    type="date" 
                    className="input" 
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>{t('time.hour')}</label>
                  <input 
                    type="time" 
                    className="input" 
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('patientProfile.notesPlaceholder')}</label>
                <textarea 
                  className="textarea" 
                  placeholder={t('patientProfile.notesPlaceholder')} 
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => { setShowModal(false); resetForm(); }}>{t('common.cancel')}</button>
              <button className="btn btn-primary" onClick={handleSave}>{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
