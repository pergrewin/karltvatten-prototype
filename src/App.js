import React, { useState, useRef, useEffect } from 'react';
import { Calendar, CheckCircle2, ListTodo, Building, User, Users, Clock, MapPin, MessageSquare, Menu, X, PlusCircle, MoreHorizontal, Trash2, Edit, Save, FileText, AlertTriangle, ChevronLeft, ChevronRight, Phone, Hash, ArrowLeft, Mail, KeyRound, Repeat, Tag, Copy, XCircle, SprayCan, Banknote, TrendingUp } from 'lucide-react';

// --- PLATSHÅLLARDATA (MOCK DATA) ---
// I en riktig applikation kommer denna data från din databas (t.ex. Supabase).
const initialCustomers = [
  { id: 1, name: 'BRF Solrosen', address: 'Solrosvägen 1', zip: '123 45', city: 'Stockholm', phone: '070-1234567', email: 'kontakt@solrosen.se', contactPerson: 'Anna Svensson', binCount: 8, roomCount: 2, notes: 'Portkod 1234. Kärl i källaren.', washesPerYear: 12, isActive: true, emptyingDays: 'Måndag & Torsdag' },
  { id: 2, name: 'BRF Eken', address: 'Ekgatan 5', zip: '111 22', city: 'Stockholm', phone: '070-2345678', email: 'styrelsen@eken.com', contactPerson: 'Erik Johansson', binCount: 12, roomCount: 3, notes: 'Nyckel finns i nyckelbox, kod 5678.', washesPerYear: 6, isActive: true, emptyingDays: 'Tisdag' },
  { id: 3, name: 'Företag AB', address: 'Industrivägen 10', zip: '167 51', city: 'Bromma', phone: '070-3456789', email: 'info@foretagab.se', contactPerson: 'Karl Nilsson', binCount: 5, roomCount: 1, notes: '', washesPerYear: 4, isActive: false, emptyingDays: 'Fredag' },
  { id: 4, name: 'BRF Björken', address: 'Björkvägen 22', zip: '172 75', city: 'Sundbyberg', phone: '070-4567890', email: 'brfbjorken@mail.com', contactPerson: 'Maria Berg', binCount: 10, roomCount: 2, notes: 'Ring på hos vaktmästaren för nyckel till soprummet.', washesPerYear: 12, isActive: true, emptyingDays: 'Onsdag' },
  { id: 5, name: 'Villa Vintergatan', address: 'Vintergatan 7', zip: '181 32', city: 'Lidingö', phone: '070-5678901', email: 'villa@vintergatan.se', contactPerson: 'Lars Larsson', binCount: 2, roomCount: 1, notes: 'Kärlen står på baksidan av huset.', washesPerYear: 2, isActive: true, emptyingDays: '' },
];

const initialDrivers = [
  { id: 1, name: 'Anna Andersson' },
  { id: 2, name: 'Erik Eriksson' },
];

const initialJobs = [
  // Augusti
  { id: 1, customerId: 1, driverId: 1, scheduledDate: '2025-08-04', status: 'completed', driverNotes: 'Allt gick bra.', plannedBinCount: 8, plannedRoomCount: 2, binCount: 9, roomCount: 2, binPrice: 1100, roomCleaning: true, cleaningPrice: 300 }, // Avvikelse
  { id: 2, customerId: 2, driverId: 2, scheduledDate: '2025-08-05', status: 'completed', driverNotes: '', plannedBinCount: 12, plannedRoomCount: 3, binCount: 12, roomCount: 3, binPrice: 2200, roomCleaning: false, cleaningPrice: 0 },
  { id: 3, customerId: 3, driverId: 1, scheduledDate: '2025-08-05', status: 'failed', driverNotes: 'Kunde inte komma in genom grinden, fel kod.', plannedBinCount: 5, plannedRoomCount: 0, binCount: 5, roomCount: 0, binPrice: 800, roomCleaning: false, cleaningPrice: 0 },
  { id: 4, customerId: 4, driverId: 2, scheduledDate: '2025-08-06', status: 'completed', driverNotes: '', plannedBinCount: 10, plannedRoomCount: 2, binCount: 10, roomCount: 2, binPrice: 1500, roomCleaning: true, cleaningPrice: 300 },
  { id: 5, customerId: 5, driverId: 1, scheduledDate: '2025-08-07', status: 'completed', driverNotes: 'Kunden ej hemma, nyckel under matta.', plannedBinCount: 2, plannedRoomCount: 1, binCount: 2, roomCount: 1, binPrice: 400, roomCleaning: true, cleaningPrice: 100 },
  { id: 6, customerId: 1, driverId: 2, scheduledDate: '2025-08-11', status: 'completed', driverNotes: '', plannedBinCount: 8, plannedRoomCount: 2, binCount: 8, roomCount: 2, binPrice: 1100, roomCleaning: true, cleaningPrice: 300 },
  { id: 7, customerId: 2, driverId: 1, scheduledDate: '2025-08-12', status: 'completed', driverNotes: '', plannedBinCount: 12, plannedRoomCount: 3, binCount: 12, roomCount: 3, binPrice: 2200, roomCleaning: false, cleaningPrice: 0 },
  
  // Idag (13 Aug) - Gul dag (12 kärl)
  { id: 8, customerId: 4, driverId: 1, scheduledDate: '2025-08-13', status: 'booked', driverNotes: '', plannedBinCount: 10, plannedRoomCount: 2, binCount: 10, roomCount: 2, binPrice: 1500, roomCleaning: true, cleaningPrice: 300 },
  { id: 9, customerId: 5, driverId: 2, scheduledDate: '2025-08-13', status: 'booked', driverNotes: '', plannedBinCount: 2, plannedRoomCount: 1, binCount: 2, roomCount: 1, binPrice: 500, roomCleaning: false, cleaningPrice: 0 },

  // Kommande i Augusti
  { id: 10, customerId: 3, driverId: 1, scheduledDate: '2025-08-19', status: 'booked', driverNotes: '', plannedBinCount: 5, plannedRoomCount: 1, binCount: 5, roomCount: 1, binPrice: 600, roomCleaning: true, cleaningPrice: 300 }, // Grön dag
  { id: 11, customerId: 1, driverId: 2, scheduledDate: '2025-08-20', status: 'booked', driverNotes: '', plannedBinCount: 8, plannedRoomCount: 2, binCount: 8, roomCount: 2, binPrice: 1100, roomCleaning: true, cleaningPrice: 300 }, // Gul dag (8 kärl)
  { id: 12, customerId: 2, driverId: 1, scheduledDate: '2025-08-21', status: 'booked', driverNotes: '', plannedBinCount: 12, plannedRoomCount: 3, binCount: 12, roomCount: 3, binPrice: 2200, roomCleaning: false, cleaningPrice: 0 },
  { id: 13, customerId: 4, driverId: 2, scheduledDate: '2025-08-21', status: 'booked', driverNotes: '', plannedBinCount: 10, plannedRoomCount: 2, binCount: 10, roomCount: 2, binPrice: 1500, roomCleaning: true, cleaningPrice: 300 }, // Röd dag (22 kärl)
  
  // September
  { id: 21, customerId: 1, driverId: 2, scheduledDate: '2025-09-03', status: 'booked', driverNotes: '', plannedBinCount: 8, plannedRoomCount: 2, binCount: 8, roomCount: 2, binPrice: 1100, roomCleaning: true, cleaningPrice: 300 },
  { id: 22, customerId: 2, driverId: 1, scheduledDate: '2025-09-06', status: 'booked', driverNotes: '', plannedBinCount: 0, plannedRoomCount: 3, binCount: 0, roomCount: 3, binPrice: 0, roomCleaning: true, cleaningPrice: 1000 },
];
// --- SLUT PÅ PLATSHÅLLARDATA ---


// --- HJÄLPFUNKTIONER ---
const getCustomerById = (customers, id) => customers.find(c => c.id === id);
const getDriverById = (drivers, id) => drivers.find(d => d.id === id);
const formatDate = (date) => new Date(date).toISOString().split('T')[0];

// Funktion för att hämta ISO veckonummer
const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

// --- HUVUDKOMPONENT ---
const App = () => {
  const [currentView, setCurrentView] = useState('login'); 
  const [customers, setCustomers] = useState(initialCustomers);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [jobs, setJobs] = useState(initialJobs);

  const renderView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminPanel 
                  goToLogin={() => setCurrentView('login')} 
                  customers={customers}
                  setCustomers={setCustomers}
                  drivers={drivers}
                  jobs={jobs}
                  setJobs={setJobs}
                />;
      case 'driver':
        return <DriverView 
                  goToLogin={() => setCurrentView('login')} 
                  drivers={drivers}
                  jobs={jobs}
                  setJobs={setJobs}
                  customers={customers}
                />;
      case 'login':
      default:
        return <LoginPage setView={setCurrentView} />;
    }
  };

  return <div className="bg-gray-50 min-h-screen font-sans">{renderView()}</div>;
};


// --- INLOGGNINGSSIDA ---
const LoginPage = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800">Kärltvätt AB</h1>
        <p className="text-xl text-gray-500 mt-2">Bokningssystem</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Välj inloggning</h2>
        <div className="space-y-4">
          <button 
            onClick={() => setView('admin')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Logga in som Admin
          </button>
          <button 
            onClick={() => setView('driver')}
            className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Logga in som Förare
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ADMINPANEL ---
const AdminPanel = ({ goToLogin, customers, setCustomers, drivers, jobs, setJobs }) => {
  const [activeTab, setActiveTab] = useState('bookings'); 

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold text-gray-800">Adminpanel</h1>
            <button 
              onClick={goToLogin}
              className="bg-red-500 text-white py-2 px-5 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Logga ut
            </button>
        </div>
      </header>
      
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4">
            <AdminTabButton label="Bokningar" isActive={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
            <AdminTabButton label="Kunder" isActive={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
            <AdminTabButton label="Ekonomi" isActive={activeTab === 'economy'} onClick={() => setActiveTab('economy')} />
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
            {activeTab === 'bookings' && <BookingView jobs={jobs} setJobs={setJobs} customers={customers} drivers={drivers}/>}
            {activeTab === 'customers' && <CustomerView customers={customers} setCustomers={setCustomers} jobs={jobs} setJobs={setJobs} drivers={drivers} />}
            {activeTab === 'economy' && <EconomyView jobs={jobs} customers={customers} />}
        </div>
      </main>
    </div>
  );
};

const AdminTabButton = ({ label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`py-3 px-2 font-semibold transition-colors duration-200 ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
  >
    {label}
  </button>
);

// --- KUNDHANTERINGSVY (ROUTER) ---
const CustomerView = ({ customers, setCustomers, jobs, setJobs, drivers }) => {
  const [viewingCustomerId, setViewingCustomerId] = useState(null);
  const [jobToDuplicate, setJobToDuplicate] = useState(null);

  const handleAddJob = (newJobData) => {
    const newJob = {
      id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1,
      status: 'booked',
      driverNotes: '',
      ...newJobData,
    };
    setJobs([...jobs, newJob]);
    setJobToDuplicate(null);
  };

  if (viewingCustomerId) {
    const customer = getCustomerById(customers, viewingCustomerId);
    return (
      <>
        <CustomerDetailView 
          customer={customer} 
          jobs={jobs.filter(j => j.customerId === viewingCustomerId)}
          drivers={drivers}
          onBack={() => setViewingCustomerId(null)}
          onDuplicateJob={(job) => setJobToDuplicate(job)}
        />
        {jobToDuplicate && (
          <AddJobModal 
            onSave={handleAddJob}
            onClose={() => setJobToDuplicate(null)}
            customers={customers}
            drivers={drivers}
            initialJobData={jobToDuplicate}
          />
        )}
      </>
    );
  }

  return <CustomerListView 
            customers={customers} 
            setCustomers={setCustomers}
            onCustomerClick={(id) => setViewingCustomerId(id)}
          />;
};

// --- KUNDLISTA ---
const CustomerListView = ({ customers, setCustomers, onCustomerClick }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const handleAddCustomer = (newCustomerData) => {
    const newCustomer = {
      id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
      ...newCustomerData
    };
    setCustomers([...customers, newCustomer]);
    setIsAddModalOpen(false);
  };

  const handleUpdateCustomer = (updatedCustomerData) => {
    setCustomers(customers.map(c => c.id === updatedCustomerData.id ? updatedCustomerData : c));
    setCustomerToEdit(null);
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter(c => c.id !== customerId));
    setCustomerToDelete(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Kundöversikt</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Lägg till ny kund
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
              <tr className="border-b text-sm text-gray-500 uppercase">
                <th className="p-4">Kund</th>
                <th className="p-4">Aktiv</th>
                <th className="p-4">Stadsdel</th>
                <th className="p-4 text-right">Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map(customer => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50 group">
                    <td className="p-4">
                      <button onClick={() => onCustomerClick(customer.id)} className="text-left w-full">
                        <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.address}</p>
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {customer.isActive ? 'Ja' : 'Nej'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{customer.city}</td>
                    <td className="p-4 text-right align-top">
                      <ActionsDropdown 
                        onEdit={() => setCustomerToEdit(customer)}
                        onDelete={() => setCustomerToDelete(customer)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
                    Inga kunder hittades.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isAddModalOpen && <CustomerModal mode="add" onSave={handleAddCustomer} onClose={() => setIsAddModalOpen(false)} />}
      {customerToEdit && <CustomerModal mode="edit" customer={customerToEdit} onSave={handleUpdateCustomer} onClose={() => setCustomerToEdit(null)} />}
      {customerToDelete && <DeleteConfirmationModal customer={customerToDelete} onConfirm={() => handleDeleteCustomer(customerToDelete.id)} onCancel={() => setCustomerToDelete(null)} />}
    </div>
  );
};

// --- KUNDKORT ---
const CustomerDetailView = ({ customer, jobs, drivers, onBack, onDuplicateJob }) => {
    const upcomingJob = jobs
        .filter(job => new Date(job.scheduledDate) >= new Date())
        .sort((a,b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))[0];

    return (
        <div>
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-semibold">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Tillbaka till kundöversikt
            </button>
            
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{customer.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoSection title="Kontaktuppgifter">
                        <InfoRow icon={User} label="Kontaktperson" value={customer.contactPerson} />
                        <InfoRow icon={Mail} label="Email" value={customer.email} />
                        <InfoRow icon={Phone} label="Telefon" value={customer.phone} />
                        <InfoRow icon={Clock} label="Tömningsdagar" value={customer.emptyingDays || 'Ej specificerat'} />
                    </InfoSection>
                    <InfoSection title="Standarduppgifter">
                        <InfoRow icon={KeyRound} label="Nyckel/Portkod" value={customer.notes || 'Inga anteckningar'} />
                        <InfoRow icon={Repeat} label="Tvättar/år" value={customer.washesPerYear} />
                        <InfoRow icon={Trash2} label="Standardantal kärl" value={customer.binCount} />
                         <InfoRow icon={Building} label="Standardantal soprum" value={customer.roomCount} />
                    </InfoSection>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Kommande tvätt</h4>
                        {upcomingJob ? (
                            <div>
                                <p className="font-bold text-blue-800 text-xl">{new Date(upcomingJob.scheduledDate).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })}</p>
                                <p className="text-sm text-gray-600">Förare: {getDriverById(drivers, upcomingJob.driverId).name}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">Ingen kommande tvätt inbokad.</p>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Bokningshistorik</h3>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="space-y-4">
                        {jobs.length > 0 ? (
                            [...jobs].sort((a,b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)).map(job => (
                                <div key={job.id} className="p-3 border rounded-lg flex justify-between items-center">
                                    <div className="flex-1">
                                        <p className="font-semibold">{new Date(job.scheduledDate).toLocaleDateString('sv-SE')}</p>
                                        <p className="text-sm text-gray-500">Förare: {getDriverById(drivers, job.driverId).name}</p>
                                        <p className="text-sm text-gray-500">Kärl: {job.binCount}, Soprum: {job.roomCount}, Städ: {job.roomCleaning ? 'Ja' : 'Nej'}</p>
                                    </div>
                                    <div className="text-right mx-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {job.status === 'completed' ? 'Utförd' : 'Bokad'}
                                        </span>
                                        <p className="font-semibold mt-1">{job.binPrice + job.cleaningPrice} kr</p>
                                    </div>
                                    <button onClick={() => onDuplicateJob(job)} className="p-2 rounded-full hover:bg-gray-200" title="Duplicera jobb">
                                        <Copy className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Ingen bokningshistorik.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- ÅTGÄRDSMENY ---
const ActionsDropdown = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1">
                        <button
                            onClick={() => { onEdit(); setIsOpen(false); }}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Edit className="w-4 h-4 mr-3" /> Redigera
                        </button>
                        <button
                            onClick={() => { onDelete(); setIsOpen(false); }}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-3" /> Radera
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MODAL FÖR KUND (LÄGG TILL/REDIGERA) ---
const CustomerModal = ({ mode, customer, onSave, onClose }) => {
  const isEditMode = mode === 'edit';
  const [formData, setFormData] = useState({
    name: isEditMode ? customer.name : '',
    address: isEditMode ? customer.address : '',
    zip: isEditMode ? customer.zip : '',
    city: isEditMode ? customer.city : '',
    phone: isEditMode ? customer.phone : '',
    email: isEditMode ? customer.email : '',
    contactPerson: isEditMode ? customer.contactPerson : '',
    binCount: isEditMode ? customer.binCount : '',
    roomCount: isEditMode ? customer.roomCount : '',
    washesPerYear: isEditMode ? customer.washesPerYear : '',
    notes: isEditMode ? customer.notes : '',
    isActive: isEditMode ? customer.isActive : true,
    emptyingDays: isEditMode ? customer.emptyingDays : '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        id: isEditMode ? customer.id : undefined,
        binCount: parseInt(formData.binCount, 10) || 0,
        roomCount: parseInt(formData.roomCount, 10) || 0,
        washesPerYear: parseInt(formData.washesPerYear, 10) || 0,
    };
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h3 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Redigera kund' : 'Lägg till ny kund'}</h3>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <InputField label="BRF-namn" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Kontaktperson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                <InputField label="Telefon" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>
            <InputField label="Adress" name="address" value={formData.address} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Postnummer" name="zip" value={formData.zip} onChange={handleChange} required />
                <InputField label="Stad" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <InputField label="Tömningsdagar" name="emptyingDays" value={formData.emptyingDays} onChange={handleChange} placeholder="ex. Måndag & Torsdag" />
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Standardantal kärl" name="binCount" type="number" value={formData.binCount} onChange={handleChange} />
              <InputField label="Standardantal soprum" name="roomCount" type="number" value={formData.roomCount} onChange={handleChange} />
              <InputField label="Tvättar/år" name="washesPerYear" type="number" value={formData.washesPerYear} onChange={handleChange} />
            </div>
            <InputField label="Anteckningar (Nyckel-ID/Portkod etc.)" name="notes" isTextarea={true} value={formData.notes} onChange={handleChange} />
            <div className="flex items-center">
                <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Aktiv kund</label>
            </div>
          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-2xl gap-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">Avbryt</button>
            <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center">
              <Save className="w-5 h-5 mr-2"/>Spara kund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODAL FÖR ATT BEKRÄFTA BORTTAGNING ---
const DeleteConfirmationModal = ({ customer, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">Ta bort kund</h3>
            <p className="text-gray-600 mt-2">
                Är du säker på att du vill ta bort <span className="font-semibold">{customer.name}</span>? Denna åtgärd kan inte ångras.
            </p>
        </div>
        <div className="flex justify-center items-center p-4 bg-gray-50 rounded-b-2xl gap-3">
          <button onClick={onCancel} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
            Avbryt
          </button>
          <button onClick={onConfirm} className="py-2 px-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center">
            <Trash2 className="w-5 h-5 mr-2"/>Ja, ta bort
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = 'text', value, onChange, required, isTextarea, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {isTextarea ? (
            <textarea id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
        ) : (
            <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
        )}
    </div>
);


// --- BOKNINGSVY ---
const BookingView = ({ jobs, setJobs, customers, drivers }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  const handleAddJob = (newJobData) => {
    const newJob = {
      id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1,
      status: 'booked',
      driverNotes: '',
      ...newJobData,
    };
    setJobs([...jobs, newJob]);
    setIsAddJobModalOpen(false);
  };

  const jobsForSelectedDate = jobs.filter(job => formatDate(job.scheduledDate) === formatDate(selectedDate));

  const summary = {
      customers: new Set(jobsForSelectedDate.map(j => j.customerId)).size,
      bins: jobsForSelectedDate.reduce((sum, j) => sum + j.binCount, 0),
      rooms: jobsForSelectedDate.reduce((sum, j) => sum + j.roomCount, 0),
      revenue: jobsForSelectedDate.reduce((sum, j) => sum + j.binPrice + j.cleaningPrice, 0),
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Bokningskalender</h2>
        <button 
          onClick={() => setIsAddJobModalOpen(true)}
          className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Lägg till jobb
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <CalendarComponent 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate}
            jobs={jobs}
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Jobb för {selectedDate.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          
          {jobsForSelectedDate.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
              <DailySummaryCard icon={Users} title="Antal kunder" value={summary.customers} />
              <DailySummaryCard icon={Trash2} title="Antal kärl" value={summary.bins} />
              <DailySummaryCard icon={Building} title="Antal soprum" value={summary.rooms} />
              <DailySummaryCard icon={Banknote} title="Omsättning" value={`${summary.revenue} kr`} />
            </div>
          )}

          <div className="space-y-4">
            {jobsForSelectedDate.length > 0 
              ? jobsForSelectedDate.map(job => <JobListItem key={job.id} job={job} customers={customers} drivers={drivers} onJobClick={() => setViewingJob(job)} />) 
              : <p className="text-gray-500 text-center mt-8">Inga uppdrag för detta datum.</p>
            }
          </div>
        </div>
      </div>

      {isAddJobModalOpen && (
        <AddJobModal 
          onSave={handleAddJob}
          onClose={() => setIsAddJobModalOpen(false)}
          customers={customers}
          drivers={drivers}
          initialDate={new Date()}
        />
      )}

      {viewingJob && (
        <JobDetailsModal
          job={viewingJob}
          customer={getCustomerById(customers, viewingJob.customerId)}
          driver={getDriverById(drivers, viewingJob.driverId)}
          onClose={() => setViewingJob(null)}
        />
      )}
    </div>
  );
};

const DailySummaryCard = ({ icon: Icon, title, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <Icon className="w-6 h-6 text-gray-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
);

// --- KALENDERKOMPONENT ---
const CalendarComponent = ({ selectedDate, setSelectedDate, jobs }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

    const binsByDate = jobs.reduce((acc, job) => {
        const date = formatDate(job.scheduledDate);
        acc[date] = (acc[date] || 0) + job.binCount;
        return acc;
    }, {});

    const getIndicatorColor = (binCount) => {
        if (binCount > 15) return 'bg-red-500';
        if (binCount >= 7) return 'bg-yellow-400';
        if (binCount >= 1) return 'bg-green-500';
        return null;
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => (new Date(year, month, 1).getDay() + 6) % 7; // Monday is 0

    const changeMonth = (offset) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const daysArray = [...Array(startDay).fill(null), ...Array(numDays).keys()].map(i => i === null ? null : i + 1);
    
    const weeks = [];
    for (let i = 0; i < daysArray.length; i += 7) {
        weeks.push(daysArray.slice(i, i + 7));
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft /></button>
                <h3 className="text-xl font-semibold">{currentMonth.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight /></button>
            </div>
            <div className="flex">
                <div className="w-8 text-center text-sm text-gray-500 mb-2 flex flex-col justify-around">
                    <div></div> {/* Empty corner */}
                    {weeks.map((week, weekIndex) => {
                        const firstDayOfWeek = week.find(d => d !== null);
                        if (firstDayOfWeek === undefined) return <div key={weekIndex} className="h-12"></div>;
                        const weekDate = new Date(year, month, firstDayOfWeek);
                        const weekNumber = getWeekNumber(weekDate);
                        return <div key={weekIndex} className="h-12 flex items-center justify-center text-xs text-gray-400">{weekNumber}</div>
                    })}
                </div>
                <div className="flex-1 border-l border-gray-200 ml-2 pl-2">
                    <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                        {['M', 'T', 'O', 'T', 'F', 'L', 'S'].map((day, index) => <div key={index}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="grid grid-cols-7 gap-1 items-center">
                                {week.map((day, dayIndex) => {
                                    if (!day) return <div key={`${weekIndex}-${dayIndex}`}></div>;
                                    const date = new Date(year, month, day);
                                    const dateString = formatDate(date);
                                    const isSelected = formatDate(selectedDate) === dateString;
                                    const binCount = binsByDate[dateString] || 0;
                                    const indicatorColor = getIndicatorColor(binCount);

                                    return (
                                        <div key={`${weekIndex}-${dayIndex}`} className="relative">
                                            <button
                                                onClick={() => setSelectedDate(date)}
                                                className={`w-full h-12 rounded-lg transition-colors flex items-center justify-center ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                                            >
                                                {day}
                                                {indicatorColor && <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 ${indicatorColor} rounded-full`}></div>}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MODAL FÖR ATT LÄGGA TILL JOBB ---
const AddJobModal = ({ onSave, onClose, customers, drivers, initialDate, initialJobData }) => {
  const [formData, setFormData] = useState({
    customerId: initialJobData?.customerId || (customers.length > 0 ? customers[0].id : ''),
    driverId: initialJobData?.driverId || (drivers.length > 0 ? drivers[0].id : ''),
    scheduledDate: initialDate ? formatDate(initialDate) : formatDate(new Date()),
    binCount: initialJobData?.binCount || '',
    roomCount: initialJobData?.roomCount || '',
    binPrice: initialJobData?.binPrice || '',
    cleaningPrice: initialJobData?.cleaningPrice || '',
    roomCleaning: initialJobData?.roomCleaning || false,
  });

  useEffect(() => {
      if(formData.customerId && !initialJobData) {
          const customer = getCustomerById(customers, parseInt(formData.customerId));
          if(customer) {
              setFormData(prev => ({
                  ...prev,
                  binCount: customer.binCount,
                  roomCount: customer.roomCount,
              }));
          }
      }
  }, [formData.customerId, customers, initialJobData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.driverId) {
        console.error("Vänligen välj en kund och en förare.");
        return;
    }
    onSave({
        ...formData,
        customerId: parseInt(formData.customerId),
        driverId: parseInt(formData.driverId),
        plannedBinCount: parseInt(formData.binCount) || 0, // Sätt planned vid skapande
        plannedRoomCount: parseInt(formData.roomCount) || 0, // Sätt planned vid skapande
        binCount: parseInt(formData.binCount) || 0,
        roomCount: parseInt(formData.roomCount) || 0,
        binPrice: parseInt(formData.binPrice) || 0,
        cleaningPrice: formData.roomCleaning ? (parseInt(formData.cleaningPrice) || 0) : 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h3 className="text-2xl font-bold text-gray-800">{initialJobData ? 'Duplicera jobb' : 'Lägg till nytt jobb'}</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">Kund</label>
              <select id="customerId" name="customerId" value={formData.customerId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Antal kärl" name="binCount" type="number" value={formData.binCount} onChange={handleChange} />
                <InputField label="Antal soprum" name="roomCount" type="number" value={formData.roomCount} onChange={handleChange} />
            </div>
            <InputField label="Pris Kärl (SEK)" name="binPrice" type="number" value={formData.binPrice} onChange={handleChange} />
            <div className="flex items-center">
                <input type="checkbox" id="roomCleaning" name="roomCleaning" checked={formData.roomCleaning} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="roomCleaning" className="ml-2 block text-sm font-medium text-gray-700">Städ av soprum</label>
            </div>
            {formData.roomCleaning && (
                <InputField label="Pris Städning (SEK)" name="cleaningPrice" type="number" value={formData.cleaningPrice} onChange={handleChange} />
            )}
            <div>
              <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 mb-1">Förare</label>
              <select id="driverId" name="driverId" value={formData.driverId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <InputField label="Datum" name="scheduledDate" type="date" value={formData.scheduledDate} onChange={handleChange} required />
          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-2xl gap-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">Avbryt</button>
            <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center">
              <Save className="w-5 h-5 mr-2"/>Spara jobb
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODAL FÖR JOBBDETALJER ---
const JobDetailsModal = ({ job, customer, driver, onClose }) => {
    if (!job || !customer || !driver) return null;

    const hasDiscrepancy = job.status === 'completed' && (job.binCount !== job.plannedBinCount || job.roomCount !== job.plannedRoomCount);

    const statusStyles = {
        booked: { bgColor: 'bg-blue-100', textColor: 'text-blue-800', text: 'Bokat' },
        completed: { bgColor: 'bg-green-100', textColor: 'text-green-800', text: 'Slutfört' },
        failed: { bgColor: 'bg-red-100', textColor: 'text-red-800', text: 'Ej slutfört' },
        discrepancy: { bgColor: 'bg-orange-100', textColor: 'text-orange-800', text: 'Avvikelse' },
    };
    
    let style;
    if (hasDiscrepancy) {
        style = statusStyles.discrepancy;
    } else {
        style = statusStyles[job.status];
    }
    
    const fullAddress = `${customer.address}, ${customer.zip} ${customer.city}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{customer.name}</h3>
                        <p className="text-gray-500">{new Date(job.scheduledDate).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${style.bgColor} ${style.textColor}`}>{style.text}</span>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <InfoSection title="Kundinformation">
                        <InfoRow icon={MapPin} label="Adress" value={fullAddress} />
                        <InfoRow icon={Phone} label="Telefon" value={customer.phone} />
                    </InfoSection>
                    <InfoSection title="Detta uppdrag">
                        <InfoRow icon={Building} label="Antal soprum" value={job.roomCount} />
                        <InfoRow icon={Trash2} label="Antal kärl" value={job.binCount} />
                        <InfoRow icon={SprayCan} label="Städ av soprum" value={job.roomCleaning ? 'Ja' : 'Nej'} />
                        <InfoRow icon={Tag} label="Pris Kärl" value={`${job.binPrice} kr`} />
                        {job.roomCleaning && <InfoRow icon={Tag} label="Pris Städning" value={`${job.cleaningPrice} kr`} />}
                        <InfoRow icon={Tag} label="Totalt Pris" value={`${job.binPrice + job.cleaningPrice} kr`} />
                        {customer.notes && <InfoRow icon={FileText} label="Anteckningar (kund)" value={customer.notes} />}
                        <InfoRow icon={User} label="Tilldelad förare" value={driver.name} />
                        {job.driverNotes && <InfoRow icon={MessageSquare} label="Anteckningar (förare)" value={job.driverNotes} />}
                    </InfoSection>
                </div>
                <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-2xl">
                    <button onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">Stäng</button>
                </div>
            </div>
        </div>
    );
};

const InfoSection = ({ title, children }) => (
    <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">{title}</h4>
        <div className="space-y-2">{children}</div>
    </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start">
        <Icon className="w-5 h-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
        <div>
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-gray-600">{value}</p>
        </div>
    </div>
);


const JobListItem = ({ job, customers, drivers, onJobClick }) => {
  const customer = getCustomerById(customers, job.customerId);
  const driver = getDriverById(drivers, job.driverId);
  
  const hasDiscrepancy = job.status === 'completed' && (job.binCount !== job.plannedBinCount || job.roomCount !== job.plannedRoomCount);

  const statusStyles = {
    booked: { bgColor: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-500', text: 'Bokat' },
    completed: { bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-500', text: 'Slutfört' },
    failed: { bgColor: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-500', text: 'Ej slutfört' },
    discrepancy: { bgColor: 'bg-orange-100', textColor: 'text-orange-800', borderColor: 'border-orange-500', text: 'Avvikelse' },
  };
  
  let style;
  if (hasDiscrepancy) {
      style = statusStyles.discrepancy;
  } else {
      style = statusStyles[job.status];
  }

  if (!customer || !driver) return null;

  return (
    <button onClick={onJobClick} className={`w-full text-left p-4 rounded-lg border-l-4 ${style.borderColor} ${style.bgColor} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1 pr-4 min-w-0">
          <p className="font-bold text-lg text-gray-900 truncate">{customer.name}</p>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{customer.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Förare: {driver.name}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${style.bgColor} ${style.textColor}`}>{style.text}</span>
        </div>
      </div>
      {job.driverNotes && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-start text-sm text-gray-700">
          <MessageSquare className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <p><strong>Förarens anteckning:</strong> {job.driverNotes}</p>
        </div>
      )}
    </button>
  );
};

// --- FÖRARVY ---
const DriverView = ({ goToLogin, drivers, jobs, setJobs, customers }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date('2025-08-13'));

  const handleUpdateJob = (updatedJob) => {
    setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
    setViewingJob(updatedJob);
  };
  
  if (!selectedDriver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Vem är du?</h1>
        <div className="w-full max-w-xs space-y-4">
          {drivers.map(driver => (
            <button 
              key={driver.id} 
              onClick={() => setSelectedDriver(driver)}
              className="w-full bg-white text-gray-800 py-4 px-6 rounded-xl shadow-md font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105"
            >
              {driver.name}
            </button>
          ))}
        </div>
        <button onClick={goToLogin} className="mt-8 text-gray-600 hover:text-gray-800 font-semibold">Tillbaka</button>
      </div>
    );
  }

  if (viewingJob) {
    return <DriverJobDetails 
              job={viewingJob} 
              customer={getCustomerById(customers, viewingJob.customerId)}
              onBack={() => setViewingJob(null)}
              onUpdate={handleUpdateJob}
            />
  }

  const driverJobs = jobs.filter(job => job.driverId === selectedDriver.id);
  const jobsForSelectedDate = driverJobs.filter(job => formatDate(job.scheduledDate) === formatDate(selectedDate));

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
       <header className="flex items-center justify-between mb-6">
        <button onClick={() => setSelectedDriver(null)} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Byt förare
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{selectedDriver.name}</h1>
        <User className="w-8 h-8 rounded-full bg-gray-700 text-white p-1.5" />
      </header>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <CalendarComponent 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate}
            jobs={driverJobs}
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Jobb för {selectedDate.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          <div className="space-y-4">
            {jobsForSelectedDate.length > 0 
              ? jobsForSelectedDate.map(job => <JobListItem key={job.id} job={job} customers={customers} drivers={drivers} onJobClick={() => setViewingJob(job)} />) 
              : <p className="text-gray-500 text-center mt-8">Inga uppdrag för detta datum.</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const DriverJobDetails = ({ job, customer, onBack, onUpdate }) => {
  const [driverNotes, setDriverNotes] = useState(job.driverNotes || '');
  const [isEditing, setIsEditing] = useState(false);
  const [actualBinCount, setActualBinCount] = useState(job.binCount);
  const [actualRoomCount, setActualRoomCount] = useState(job.roomCount);

  const handleComplete = () => {
    onUpdate({ ...job, status: 'completed', driverNotes, binCount: actualBinCount, roomCount: actualRoomCount });
    onBack();
  };

  const handleFail = () => {
    onUpdate({ ...job, status: 'failed', driverNotes, binCount: actualBinCount, roomCount: actualRoomCount });
    onBack();
  }
  
  const handleSaveNotes = () => {
    onUpdate({ ...job, driverNotes });
    setIsEditing(false);
  };

  const isCompleted = job.status === 'completed';
  const isFailed = job.status === 'failed';
  const isBooked = job.status === 'booked';
  const fullAddress = `${customer.address}, ${customer.zip} ${customer.city}`;

  const NumberDropdown = ({ label, value, onChange, max = 50 }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select value={value} onChange={onChange} disabled={!isBooked} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100">
            {[...Array(max + 1).keys()].map(num => <option key={num} value={num}>{num}</option>)}
        </select>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white min-h-screen">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="font-semibold">Tillbaka till listan</span>
        </button>
      </header>

      <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                <p className="text-lg text-gray-500">{new Date(job.scheduledDate).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            {isCompleted && (
                <span className="mt-1 flex items-center bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4 mr-1.5"/>
                    Uppdrag slutfört
                </span>
            )}
            {isFailed && (
                <span className="mt-1 flex items-center bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                    <XCircle className="w-4 h-4 mr-1.5"/>
                    Ej slutfört
                </span>
            )}
        </div>
        
        <InfoSection title="Uppdragsinformation">
          <InfoRow icon={MapPin} label="Adress" value={fullAddress} />
          <InfoRow icon={Building} label="Planerat antal soprum" value={job.plannedRoomCount} />
          <InfoRow icon={Trash2} label="Planerat antal kärl" value={job.plannedBinCount} />
          <InfoRow icon={SprayCan} label="Städ av soprum" value={job.roomCleaning ? 'Ja' : 'Nej'} />
          <InfoRow icon={KeyRound} label="Nyckel/Portkod & Anteckningar" value={customer.notes || 'Inga'} />
        </InfoSection>

        {isBooked && (
            <InfoSection title="Rapportera faktiskt antal">
                <div className="grid grid-cols-2 gap-4">
                    <NumberDropdown label="Utförda soprum" value={actualRoomCount} onChange={(e) => setActualRoomCount(parseInt(e.target.value))} />
                    <NumberDropdown label="Utförda kärl" value={actualBinCount} onChange={(e) => setActualBinCount(parseInt(e.target.value))} />
                </div>
            </InfoSection>
        )}
        
        { (isCompleted || isFailed) && (
            <InfoSection title="Rapporterat antal">
                <InfoRow icon={Building} label="Rapporterade soprum" value={job.roomCount} />
                <InfoRow icon={Trash2} label="Rapporterade kärl" value={job.binCount} />
            </InfoSection>
        )}

        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="driverNotes" className="block text-lg font-semibold text-gray-700">Dina anteckningar</label>
                {(isCompleted || isFailed) && (
                    isEditing ? (
                        <button onClick={handleSaveNotes} className="flex items-center text-sm text-blue-600 font-semibold hover:text-blue-800 p-2">
                            <Save className="w-4 h-4 mr-1" /> Spara
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-gray-600 font-semibold hover:text-gray-800 p-2">
                            <Edit className="w-4 h-4 mr-1" /> Ändra
                        </button>
                    )
                )}
            </div>
            <textarea 
                id="driverNotes"
                value={driverNotes}
                readOnly={(isCompleted || isFailed) && !isEditing}
                onChange={(e) => setDriverNotes(e.target.value)}
                placeholder="Problem med nyckel, extra kärl etc."
                className={`w-full p-3 border border-gray-300 rounded-lg h-28 focus:ring-2 focus:ring-blue-500 transition-colors ${(isCompleted || isFailed) && !isEditing ? 'bg-gray-100' : ''}`}
            />
        </div>
        
        {isBooked && (
          <div className="space-y-3">
            <button 
              onClick={handleComplete}
              className="w-full bg-green-500 text-white py-4 rounded-xl shadow-lg font-bold text-xl hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center justify-center"
            >
              <CheckCircle2 className="w-7 h-7 mr-3" />
              Markera som slutfört
            </button>
            <button 
              onClick={handleFail}
              className="w-full bg-red-500 text-white py-3 rounded-xl shadow-lg font-semibold text-lg hover:bg-red-600 transition flex items-center justify-center"
            >
              <XCircle className="w-6 h-6 mr-2" />
              Kunde ej slutföras
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- EKONOMIVY (NY) ---
const EconomyView = ({ jobs, customers }) => {
    const currentYear = 2025;
    const completedJobs = jobs.filter(j => (j.status === 'completed' || (j.status === 'completed' && (j.binCount !== j.plannedBinCount || j.roomCount !== j.plannedRoomCount))) && new Date(j.scheduledDate).getFullYear() === currentYear);

    const totalRevenue = completedJobs.reduce((sum, job) => sum + job.binPrice + job.cleaningPrice, 0);

    const revenueByCustomer = customers.map(customer => {
        const customerJobs = completedJobs.filter(job => job.customerId === customer.id);
        const customerRevenue = customerJobs.reduce((sum, job) => sum + job.binPrice + job.cleaningPrice, 0);
        return {
            ...customer,
            revenue: customerRevenue,
            jobCount: customerJobs.length,
        };
    }).filter(c => c.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Ekonomiöversikt {currentYear}</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-lg text-gray-500">Total Omsättning (slutförda jobb)</p>
                        <p className="text-4xl font-bold text-gray-800">{totalRevenue.toLocaleString('sv-SE')} kr</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md">
                <h3 className="text-xl font-semibold p-6 border-b">Omsättning per kund</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50">
                            <tr className="text-sm text-gray-500 uppercase">
                                <th className="p-4">Kund</th>
                                <th className="p-4 text-right">Antal jobb</th>
                                <th className="p-4 text-right">Total Omsättning</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenueByCustomer.map(customer => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-semibold text-gray-800">{customer.name}</td>
                                    <td className="p-4 text-right text-gray-600">{customer.jobCount}</td>
                                    <td className="p-4 text-right text-gray-800 font-semibold">{customer.revenue.toLocaleString('sv-SE')} kr</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default App;
