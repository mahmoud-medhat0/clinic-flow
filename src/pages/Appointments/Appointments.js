import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Filter,
  Clock
} from 'lucide-react';
import './Appointments.css';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00'];

const sampleAppointments = [
  { id: 1, day: 1, time: '09:00', patient: 'Sarah Johnson', type: 'Check-up', duration: 30 },
  { id: 2, day: 1, time: '10:30', patient: 'Ahmed Hassan', type: 'Follow-up', duration: 30 },
  { id: 3, day: 2, time: '09:30', patient: 'Maria Garcia', type: 'Consultation', duration: 60 },
  { id: 4, day: 3, time: '14:00', patient: 'John Smith', type: 'Lab Results', duration: 30 },
  { id: 5, day: 4, time: '10:00', patient: 'Emily Chen', type: 'Check-up', duration: 30 },
  { id: 6, day: 5, time: '11:00', patient: 'Omar Ali', type: 'Vaccination', duration: 30 },
];

function Appointments() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

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

  return (
    <div className="appointments-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <div className="week-navigation">
            <button className="nav-btn" onClick={() => navigateWeek(-1)}>
              <ChevronLeft size={20} />
            </button>
            <span className="current-week">
              {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button className="nav-btn" onClick={() => navigateWeek(1)}>
              <ChevronRight size={20} />
            </button>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrentWeek(new Date())}>
            Today
          </button>
        </div>
        <div className="header-right">
          <button className="btn btn-ghost">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            New Appointment
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container card">
        <div className="calendar-grid">
          {/* Time Column */}
          <div className="time-column">
            <div className="time-header"></div>
            {timeSlots.map((time) => (
              <div key={time} className="time-slot">
                <Clock size={12} />
                {time}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDates.map((date, dayIndex) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const dayAppointments = sampleAppointments.filter(apt => apt.day === dayIndex);

            return (
              <div key={dayIndex} className={`day-column ${isToday ? 'today' : ''}`}>
                <div className={`day-header ${isToday ? 'today' : ''}`}>
                  <span className="day-name">{weekDays[dayIndex]}</span>
                  <span className={`day-date ${isToday ? 'today' : ''}`}>{date.getDate()}</span>
                </div>
                <div className="day-slots">
                  {timeSlots.map((time) => {
                    const appointment = dayAppointments.find(apt => apt.time === time);
                    return (
                      <div key={time} className="slot">
                        {appointment && (
                          <div className="appointment-block">
                            <span className="apt-patient">{appointment.patient}</span>
                            <span className="apt-type">{appointment.type}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
