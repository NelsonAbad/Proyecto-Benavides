import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { Header } from './header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { ArrowLeft, Edit, Plus, Trash2, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';

interface Patient {
  id: string;
  name: string;
  curp: string;
  birthDate: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType: string;
  allergies: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const PatientManagement = () => {
  const { user, addLog } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    curp: '',
    birthDate: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    allergies: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    // Load patients from localStorage or use mock data
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      const mockPatients: Patient[] = [
        {
          id: '1',
          name: 'Ana Patricia Rodríguez López',
          curp: 'ROLA850615MDFPDN09',
          birthDate: '1985-06-15',
          phone: '5512345678',
          email: 'ana.rodriguez@email.com',
          emergencyContact: 'Pedro Rodríguez',
          emergencyPhone: '5587654321',
          bloodType: 'O+',
          allergies: 'Penicilina',
          status: 'active',
          createdAt: '2025-01-10'
        },
        {
          id: '2',
          name: 'Carlos Manuel Hernández García',
          curp: 'HEGC920823HDFRRL05',
          birthDate: '1992-08-23',
          phone: '5523456789',
          email: 'carlos.hernandez@email.com',
          emergencyContact: 'María Hernández',
          emergencyPhone: '5598765432',
          bloodType: 'A+',
          allergies: 'Ninguna',
          status: 'active',
          createdAt: '2025-02-05'
        },
        {
          id: '3',
          name: 'Laura Beatriz Martínez Sánchez',
          curp: 'MASL880412MDFRNR08',
          birthDate: '1988-04-12',
          phone: '5534567890',
          email: 'laura.martinez@email.com',
          emergencyContact: 'José Martínez',
          emergencyPhone: '5509876543',
          bloodType: 'B+',
          allergies: 'Polen, Aspirina',
          status: 'active',
          createdAt: '2025-03-01'
        }
      ];
      setPatients(mockPatients);
      localStorage.setItem('patients', JSON.stringify(mockPatients));
    }
    addLog('Acceso a gestión de pacientes', 'Pacientes');
  }, [addLog]);

  const handleCreatePatient = () => {
    setEditingPatient(null);
    setFormData({
      name: '',
      curp: '',
      birthDate: '',
      phone: '',
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      bloodType: '',
      allergies: '',
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      curp: patient.curp,
      birthDate: patient.birthDate,
      phone: patient.phone,
      email: patient.email,
      emergencyContact: patient.emergencyContact,
      emergencyPhone: patient.emergencyPhone,
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      status: patient.status
    });
    setIsDialogOpen(true);
  };

  const handleViewPatient = (patient: Patient) => {
    setViewingPatient(patient);
  };

  const handleSavePatient = () => {
    if (!formData.name || !formData.curp || !formData.birthDate) {
      toast.error('Complete los campos requeridos');
      return;
    }

    let updatedPatients;

    if (editingPatient) {
      updatedPatients = patients.map(p => p.id === editingPatient.id ? {
        ...p,
        ...formData
      } : p);
      toast.success('Paciente actualizado exitosamente');
      addLog(`Paciente actualizado: ${formData.name}`, 'Pacientes');
    } else {
      const newPatient: Patient = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      updatedPatients = [...patients, newPatient];
      toast.success('Paciente registrado exitosamente');
      addLog(`Paciente creado: ${formData.name}`, 'Pacientes');
    }

    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    setIsDialogOpen(false);
  };

  const handleDeletePatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    const updatedPatients = patients.filter(p => p.id !== patientId);
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    toast.success('Paciente dado de baja');
    addLog(`Paciente eliminado: ${patient?.name}`, 'Pacientes');
  };

  const filteredPatients = patients.filter(patient =>
    (patient.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.curp || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
          <h1>Gestión de Pacientes</h1>
          <p className="text-muted-foreground mt-2">
            Registro y seguimiento de pacientes del sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>Pacientes Registrados</CardTitle>
                <CardDescription>Total de pacientes: {patients.length}</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, CURP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleCreatePatient}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Paciente
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>CURP</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Tipo de Sangre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell className="font-mono text-xs">{patient.curp}</TableCell>
                    <TableCell>{calculateAge(patient.birthDate)} años</TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.bloodType}</Badge>
                    </TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                        {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPatient(patient)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPatient(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPatient ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
            </DialogTitle>
            <DialogDescription>
              Complete la información del paciente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre completo del paciente"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="curp">CURP *</Label>
                <Input
                  id="curp"
                  value={formData.curp}
                  onChange={(e) => setFormData({ ...formData, curp: e.target.value.toUpperCase() })}
                  placeholder="ABCD123456HDFRRL00"
                  maxLength={18}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="5512345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="paciente@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Nombre del contacto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="5512345678"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Tipo de Sangre</Label>
                <Input
                  id="bloodType"
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  placeholder="O+, A-, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-input-background"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Alergias</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="Lista de alergias conocidas"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePatient}>
              {editingPatient ? 'Actualizar' : 'Registrar'} Paciente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Patient Dialog */}
      <Dialog open={viewingPatient !== null} onOpenChange={() => setViewingPatient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Paciente</DialogTitle>
            <DialogDescription>
              Información completa del paciente
            </DialogDescription>
          </DialogHeader>

          {viewingPatient && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nombre Completo</Label>
                  <p>{viewingPatient.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CURP</Label>
                  <p className="font-mono text-xs">{viewingPatient.curp}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Fecha de Nacimiento</Label>
                  <p>{viewingPatient.birthDate} ({calculateAge(viewingPatient.birthDate)} años)</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo de Sangre</Label>
                  <p>{viewingPatient.bloodType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Teléfono</Label>
                  <p>{viewingPatient.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{viewingPatient.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Contacto de Emergencia</Label>
                  <p>{viewingPatient.emergencyContact}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Teléfono de Emergencia</Label>
                  <p>{viewingPatient.emergencyPhone}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Alergias</Label>
                <p>{viewingPatient.allergies || 'Ninguna registrada'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <p>
                    <Badge variant={viewingPatient.status === 'active' ? 'default' : 'secondary'}>
                      {viewingPatient.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fecha de Registro</Label>
                  <p>{viewingPatient.createdAt}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewingPatient(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
