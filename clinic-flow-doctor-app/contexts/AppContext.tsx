import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { appointmentsData, Appointment, AppointmentStatus } from '../data/appointments';
import { patientsData, Patient } from '../data/patients';
import { 
  inventoryItemsData, 
  categoriesData, 
  stockMovementsData, 
  InventoryItem, 
  Category, 
  StockMovement 
} from '../data/inventory';
import { notificationsData, Notification } from '../data/notifications';
import { doctorData } from '../data/doctor';
import { invoicesData, Invoice, InvoiceStatus } from '../data/invoices';

interface AppContextType {
  // Doctor
  doctor: typeof doctorData;
  
  // Appointments
  appointments: Appointment[];
  getAppointment: (id: number) => Appointment | undefined;
  getTodayAppointments: () => Appointment[];
  getUpcomingAppointments: () => Appointment[];
  updateAppointmentStatus: (id: number, status: AppointmentStatus) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  
  // Patients
  patients: Patient[];
  getPatient: (id: number) => Patient | undefined;
  searchPatients: (query: string) => Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'visits'>) => void;
  
  // Inventory
  inventoryItems: InventoryItem[];
  categories: Category[];
  movements: StockMovement[];
  getItem: (id: number) => InventoryItem | undefined;
  getCategory: (id: number) => Category | undefined;
  getCategoryItems: (categoryId: number) => InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  addMovement: (movement: Omit<StockMovement, 'id'>) => void;
  
  // Stats
  getMonthlyRevenue: () => number;
  getNewPatientsCount: () => number;

  // Notifications
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Invoices
  invoices: Invoice[];
  getInvoice: (id: number) => Invoice | undefined;
  getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoiceStatus: (id: number, status: InvoiceStatus) => void;
  deleteInvoice: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);
  const [patients, setPatients] = useState<Patient[]>(patientsData);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(inventoryItemsData);
  const [categories, setCategories] = useState<Category[]>(categoriesData);
  const [movements, setMovements] = useState<StockMovement[]>(stockMovementsData);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [invoices, setInvoices] = useState<Invoice[]>(invoicesData);

  // Appointments
  const getAppointment = useCallback((id: number) => 
    appointments.find(a => a.id === id), [appointments]);

  const getTodayAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(a => a.day === today);
  }, [appointments]);

  const getUpcomingAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(a => a.day >= today).slice(0, 5);
  }, [appointments]);

  const updateAppointmentStatus = useCallback((id: number, status: AppointmentStatus) => {
    setAppointments(prev => 
      prev.map(a => a.id === id ? { ...a, status } : a)
    );
  }, []);

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id'>) => {
    const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
    setAppointments(prev => [...prev, { ...appointment, id: newId }]);
  }, [appointments]);

  // Patients
  const getPatient = useCallback((id: number) => 
    patients.find(p => p.id === id), [patients]);

  const searchPatients = useCallback((query: string) => {
    if (!query.trim()) return patients;
    const lower = query.toLowerCase();
    return patients.filter(p => 
      p.name.toLowerCase().includes(lower) ||
      p.phone.includes(query) ||
      p.email.toLowerCase().includes(lower)
    );
  }, [patients]);

  const addPatient = useCallback((patient: Omit<Patient, 'id' | 'visits'>) => {
    const newId = Math.max(...patients.map(p => p.id), 0) + 1;
    setPatients(prev => [...prev, { ...patient, id: newId, visits: [] }]);
  }, [patients]);

  // Inventory
  const getItem = useCallback((id: number) => 
    inventoryItems.find(i => i.id === id), [inventoryItems]);

  const getCategory = useCallback((id: number) => 
    categories.find(c => c.id === id), [categories]);

  const getCategoryItems = useCallback((categoryId: number) => 
    inventoryItems.filter(i => i.categoryId === categoryId), [inventoryItems]);

  const addItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    const newId = Math.max(...inventoryItems.map(i => i.id), 0) + 1;
    setInventoryItems(prev => [...prev, { ...item, id: newId }]);
  }, [inventoryItems]);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;
    setCategories(prev => [...prev, { ...category, id: newId }]);
  }, [categories]);

  const addMovement = useCallback((movement: Omit<StockMovement, 'id'>) => {
    const newId = Math.max(...movements.map(m => m.id), 0) + 1;
    setMovements(prev => [...prev, { ...movement, id: newId }]);
    
    // Update item quantity
    setInventoryItems(prev => prev.map(item => {
      if (item.id === movement.itemId) {
        const quantity = movement.type === 'in' 
          ? item.quantity + movement.quantity 
          : Math.max(0, item.quantity - movement.quantity);
        return { ...item, quantity };
      }
      return item;
    }));
  }, [movements]);

  // Stats
  const getMonthlyRevenue = useCallback(() => {
    // Mock revenue calculation
    return 45250;
  }, []);

  const getNewPatientsCount = useCallback(() => {
    // Count patients added this month (mock)
    return 12;
  }, []);

  // Notifications
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Invoices
  const getInvoice = useCallback((id: number) => 
    invoices.find(i => i.id === id), [invoices]);

  const getInvoicesByStatus = useCallback((status: InvoiceStatus) => 
    invoices.filter(i => i.status === status), [invoices]);

  const addInvoice = useCallback((invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const newId = Math.max(...invoices.map(i => i.id), 0) + 1;
    const invoiceNumber = `INV-${String(newId).padStart(3, '0')}`;
    setInvoices(prev => [...prev, { ...invoice, id: newId, invoiceNumber }]);
  }, [invoices]);

  const updateInvoiceStatus = useCallback((id: number, status: InvoiceStatus) => {
    setInvoices(prev => 
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  }, []);

  const deleteInvoice = useCallback((id: number) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      doctor: doctorData,
      appointments,
      getAppointment,
      getTodayAppointments,
      getUpcomingAppointments,
      updateAppointmentStatus,
      addAppointment,
      patients,
      getPatient,
      searchPatients,
      addPatient,
      inventoryItems,
      categories,
      movements,
      getItem,
      getCategory,
      getCategoryItems,
      addItem,
      addCategory,
      addMovement,
      getMonthlyRevenue,
      getNewPatientsCount,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      unreadNotificationsCount,
      invoices,
      getInvoice,
      getInvoicesByStatus,
      addInvoice,
      updateInvoiceStatus,
      deleteInvoice,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
