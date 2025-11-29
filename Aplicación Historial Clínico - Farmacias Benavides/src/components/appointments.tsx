import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { Header } from './header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar as CalendarIcon } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import { Calendar, Plus, Search, Clock, User, MapPin, Video, CheckCircle, XCircle, AlertCircle, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: string;
  type: 'presencial' | 'virtual';
  location: string;
  reason: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
}

export function Appointments() {
  const { user, addLog } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Form states for new appointment
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: '',
    time: '',
    duration: '30',
    type: 'presencial' as 'presencial' | 'virtual',
    location: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    loadAppointments();
    loadPatients();
    addLog('Acceso a citas médicas', 'Citas');
  }, []);

  const loadAppointments = () => {
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(storedAppointments);
  };

  const loadPatients = () => {
    const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    setPatients(storedPatients);
  };

  const handleAddAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.date || !newAppointment.time || !newAppointment.reason) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    const patient = patients.find(p => p.id === newAppointment.patientId);
    if (!patient) return;

    const appointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: patient.id,
      patientName: patient.name,
      patientEmail: patient.email,
      doctorId: user?.id || '',
      doctorName: user?.name || '',
      date: newAppointment.date,
      time: newAppointment.time,
      duration: newAppointment.duration,
      type: newAppointment.type,
      location: newAppointment.location,
      reason: newAppointment.reason,
      notes: newAppointment.notes,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    const updatedAppointments = [appointment, ...appointments];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    toast.success('Cita médica registrada exitosamente');
    addLog(`Cita médica creada para ${patient.name}`, 'Citas');

    setIsAddAppointmentOpen(false);
    setNewAppointment({
      patientId: '',
      date: '',
      time: '',
      duration: '30',
      type: 'presencial',
      location: '',
      reason: '',
      notes: ''
    });
  };

  const handleUpdateStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    
    const statusText = newStatus === 'completed' ? 'completada' : 
                      newStatus === 'cancelled' ? 'cancelada' : 
                      newStatus === 'no-show' ? 'marcada como no asistida' : 'actualizada';
    toast.success(`Cita ${statusText}`);
    addLog(`Estado de cita actualizado a ${newStatus}`, 'Citas');
  };

  const getFilteredAppointments = () => {
    let filtered = appointments;

    // Filter by user role
    if (user?.role === 'paciente') {
      filtered = filtered.filter(apt => apt.patientEmail === user.email);
    } else if (user?.role === 'medico') {
      filtered = filtered.filter(apt => apt.doctorId === user.id);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const config = {
      scheduled: { label: 'Programada', variant: 'default' as const, icon: AlertCircle },
      completed: { label: 'Completada', variant: 'secondary' as const, icon: CheckCircle },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const, icon: XCircle },
      'no-show': { label: 'No asistió', variant: 'outline' as const, icon: XCircle }
    };
    const { label, variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const filteredAppointments = getFilteredAppointments();
  const isMedico = user?.role === 'medico';
  const isPaciente = user?.role === 'paciente';

  const upcomingCount = appointments.filter(apt => 
    apt.status === 'scheduled' && 
    new Date(`${apt.date}T${apt.time}`) > new Date() &&
    (isMedico ? apt.doctorId === user?.id : apt.patientEmail === user?.email)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2">Citas Médicas</h1>
          <p className="text-muted-foreground">
            {isMedico ? 'Gestión de citas con sus pacientes' : 'Visualice sus citas médicas programadas'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Próximas Citas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{upcomingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Citas programadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Este Mes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {appointments.filter(apt => {
                  const aptDate = new Date(apt.date);
                  const now = new Date();
                  return aptDate.getMonth() === now.getMonth() &&
                         aptDate.getFullYear() === now.getFullYear() &&
                         (isMedico ? apt.doctorId === user?.id : apt.patientEmail === user?.email);
                }).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de citas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {appointments.filter(apt => 
                  apt.status === 'completed' && 
                  (isMedico ? apt.doctorId === user?.id : apt.patientEmail === user?.email)
                ).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Citas realizadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isMedico ? "Buscar por paciente o motivo..." : "Buscar citas..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="scheduled">Programadas</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>

          {isMedico && (
            <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Registrar Cita
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Registrar Nueva Cita</DialogTitle>
                  <DialogDescription>Programe una cita médica para un paciente</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="patient-select">Paciente *</Label>
                    <Select value={newAppointment.patientId} onValueChange={(value) => setNewAppointment({ ...newAppointment, patientId: value })}>
                      <SelectTrigger id="patient-select">
                        <SelectValue placeholder="Seleccione un paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No hay pacientes registrados. <br />
                            Primero registre pacientes desde el módulo de Gestión de Pacientes.
                          </div>
                        ) : (
                          patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} - {patient.email}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {patients.length === 0 && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          No hay pacientes registrados
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setIsAddAppointmentOpen(false);
                            navigate('/patients');
                          }}
                          className="gap-1"
                        >
                          <UserPlus className="h-3 w-3" />
                          Registrar Paciente
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Fecha *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Hora *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duración (minutos) *</Label>
                      <Select value={newAppointment.duration} onValueChange={(value) => setNewAppointment({ ...newAppointment, duration: value })}>
                        <SelectTrigger id="duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">60 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Tipo de Consulta *</Label>
                      <Select value={newAppointment.type} onValueChange={(value: any) => setNewAppointment({ ...newAppointment, type: value })}>
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="presencial">Presencial</SelectItem>
                          <SelectItem value="virtual">Virtual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Ubicación / Link</Label>
                    <Input
                      id="location"
                      value={newAppointment.location}
                      onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                      placeholder={newAppointment.type === 'virtual' ? 'https://meet.google.com/...' : 'Consultorio 3, Piso 2'}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reason">Motivo de la Consulta *</Label>
                    <Input
                      id="reason"
                      value={newAppointment.reason}
                      onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                      placeholder="Ej: Consulta general, seguimiento, etc."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                      placeholder="Información adicional sobre la cita"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddAppointmentOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAddAppointment}>Registrar Cita</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Appointments List */}
        <div className="grid gap-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay citas registradas</p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => {
              const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
              const isUpcoming = appointmentDateTime > new Date() && appointment.status === 'scheduled';

              return (
                <Card key={appointment.id} className={isUpcoming ? 'border-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {isMedico ? appointment.patientName : `Dr. ${appointment.doctorName}`}
                          </CardTitle>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <CardDescription className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(appointment.date), "d 'de' MMMM, yyyy", { locale: es })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.time} ({appointment.duration} min)
                          </span>
                          <span className="flex items-center gap-1">
                            {appointment.type === 'virtual' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                            {appointment.type === 'virtual' ? 'Virtual' : 'Presencial'}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Motivo de la Consulta</p>
                        <p>{appointment.reason}</p>
                      </div>

                      {appointment.location && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {appointment.type === 'virtual' ? 'Link de Reunión' : 'Ubicación'}
                          </p>
                          {appointment.type === 'virtual' ? (
                            <a href={appointment.location} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {appointment.location}
                            </a>
                          ) : (
                            <p>{appointment.location}</p>
                          )}
                        </div>
                      )}

                      {appointment.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Notas</p>
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}

                      {isMedico && appointment.status === 'scheduled' && (
                        <div className="flex gap-2 pt-3 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                            className="gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Marcar Completada
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(appointment.id, 'no-show')}
                            className="gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            No Asistió
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                            className="gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancelar
                          </Button>
                        </div>
                      )}

                      {isPaciente && (
                        <div className="text-sm text-muted-foreground pt-3 border-t">
                          <p>Registrada el {format(new Date(appointment.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
