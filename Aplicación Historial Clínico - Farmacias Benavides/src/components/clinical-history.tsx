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
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { FileText, Plus, Search, Calendar, User, Pill, ClipboardList, Activity } from 'lucide-react';

interface ClinicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientCURP: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
  };
  notes: string;
  doctorId: string;
  doctorName: string;
  prescriptions: string[];
}

interface Prescription {
  id: string;
  recordId: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  date: string;
  doctorId: string;
  doctorName: string;
  status: 'active' | 'completed' | 'cancelled';
}

export function ClinicalHistory() {
  const { user, addLog } = useAuth();
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [patients, setPatients] = useState<any[]>([]);

  // Form states for new record
  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    symptoms: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    notes: ''
  });

  // Form states for new prescription
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    loadRecords();
    loadPrescriptions();
    loadPatients();
    addLog('Acceso a historial clínico', 'Historial Clínico');
  }, []);

  const loadRecords = () => {
    const storedRecords = JSON.parse(localStorage.getItem('clinicalRecords') || '[]');
    setRecords(storedRecords);
  };

  const loadPrescriptions = () => {
    const storedPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    setPrescriptions(storedPrescriptions);
  };

  const loadPatients = () => {
    const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    setPatients(storedPatients);
  };

  const handleAddRecord = () => {
    if (!selectedPatient || !newRecord.diagnosis) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    const record: ClinicalRecord = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: patient.id,
      patientName: patient.name,
      patientCURP: patient.curp,
      date: new Date().toISOString(),
      diagnosis: newRecord.diagnosis,
      symptoms: newRecord.symptoms,
      vitalSigns: {
        bloodPressure: newRecord.bloodPressure,
        heartRate: newRecord.heartRate,
        temperature: newRecord.temperature,
        weight: newRecord.weight,
        height: newRecord.height
      },
      notes: newRecord.notes,
      doctorId: user?.id || '',
      doctorName: user?.name || '',
      prescriptions: []
    };

    const updatedRecords = [record, ...records];
    setRecords(updatedRecords);
    localStorage.setItem('clinicalRecords', JSON.stringify(updatedRecords));

    toast.success('Registro clínico agregado exitosamente');
    addLog(`Creación de registro clínico para ${patient.name}`, 'Historial Clínico');

    setIsAddRecordOpen(false);
    setNewRecord({
      diagnosis: '',
      symptoms: '',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      notes: ''
    });
    setSelectedPatient('');
  };

  const handleAddPrescription = () => {
    if (!selectedPatient || !newPrescription.medication || !newPrescription.dosage) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    const prescription: Prescription = {
      id: Math.random().toString(36).substr(2, 9),
      recordId: '',
      patientId: patient.id,
      patientName: patient.name,
      medication: newPrescription.medication,
      dosage: newPrescription.dosage,
      frequency: newPrescription.frequency,
      duration: newPrescription.duration,
      instructions: newPrescription.instructions,
      date: new Date().toISOString(),
      doctorId: user?.id || '',
      doctorName: user?.name || '',
      status: 'active'
    };

    const updatedPrescriptions = [prescription, ...prescriptions];
    setPrescriptions(updatedPrescriptions);
    localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));

    toast.success('Prescripción agregada exitosamente');
    addLog(`Prescripción creada para ${patient.name}`, 'Prescripciones');

    setIsAddPrescriptionOpen(false);
    setNewPrescription({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
    setSelectedPatient('');
  };

  const filteredRecords = records.filter(record =>
    (record.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.patientCURP || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrescriptions = prescriptions.filter(prescription =>
    (prescription.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prescription.medication || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2">Historial Clínico</h1>
          <p className="text-muted-foreground">Gestión de registros médicos y prescripciones</p>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por paciente, CURP o diagnóstico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Registro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nuevo Registro Clínico</DialogTitle>
                  <DialogDescription>Agregue un nuevo registro médico para el paciente</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="patient-select">Paciente *</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger id="patient-select">
                        <SelectValue placeholder="Seleccione un paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} - {patient.curp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="diagnosis">Diagnóstico *</Label>
                    <Input
                      id="diagnosis"
                      value={newRecord.diagnosis}
                      onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                      placeholder="Ingrese el diagnóstico"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="symptoms">Síntomas</Label>
                    <Textarea
                      id="symptoms"
                      value={newRecord.symptoms}
                      onChange={(e) => setNewRecord({ ...newRecord, symptoms: e.target.value })}
                      placeholder="Descripción de síntomas"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bp">Presión Arterial</Label>
                      <Input
                        id="bp"
                        value={newRecord.bloodPressure}
                        onChange={(e) => setNewRecord({ ...newRecord, bloodPressure: e.target.value })}
                        placeholder="120/80 mmHg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr">Frecuencia Cardíaca</Label>
                      <Input
                        id="hr"
                        value={newRecord.heartRate}
                        onChange={(e) => setNewRecord({ ...newRecord, heartRate: e.target.value })}
                        placeholder="72 bpm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="temp">Temperatura</Label>
                      <Input
                        id="temp"
                        value={newRecord.temperature}
                        onChange={(e) => setNewRecord({ ...newRecord, temperature: e.target.value })}
                        placeholder="36.5°C"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="weight">Peso</Label>
                      <Input
                        id="weight"
                        value={newRecord.weight}
                        onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })}
                        placeholder="70 kg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="height">Altura</Label>
                      <Input
                        id="height"
                        value={newRecord.height}
                        onChange={(e) => setNewRecord({ ...newRecord, height: e.target.value })}
                        placeholder="170 cm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      placeholder="Observaciones y recomendaciones"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRecordOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAddRecord}>Guardar Registro</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddPrescriptionOpen} onOpenChange={setIsAddPrescriptionOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <Pill className="h-4 w-4" />
                  Nueva Prescripción
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nueva Prescripción</DialogTitle>
                  <DialogDescription>Recete medicamento para el paciente</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="patient-select-rx">Paciente *</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger id="patient-select-rx">
                        <SelectValue placeholder="Seleccione un paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} - {patient.curp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="medication">Medicamento *</Label>
                    <Input
                      id="medication"
                      value={newPrescription.medication}
                      onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                      placeholder="Nombre del medicamento"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dosage">Dosis *</Label>
                      <Input
                        id="dosage"
                        value={newPrescription.dosage}
                        onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                        placeholder="500 mg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="frequency">Frecuencia</Label>
                      <Input
                        id="frequency"
                        value={newPrescription.frequency}
                        onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                        placeholder="Cada 8 horas"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duración</Label>
                    <Input
                      id="duration"
                      value={newPrescription.duration}
                      onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                      placeholder="7 días"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="instructions">Instrucciones</Label>
                    <Textarea
                      id="instructions"
                      value={newPrescription.instructions}
                      onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
                      placeholder="Instrucciones especiales para el paciente"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPrescriptionOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAddPrescription}>Guardar Prescripción</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs for Records and Prescriptions */}
        <Tabs defaultValue="records" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="records" className="gap-2">
              <FileText className="h-4 w-4" />
              Registros Clínicos
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="gap-2">
              <Pill className="h-4 w-4" />
              Prescripciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="mt-6">
            <div className="grid gap-4">
              {filteredRecords.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay registros clínicos</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRecords.map((record) => (
                  <Card key={record.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {record.patientName}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            CURP: {record.patientCURP}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(record.date).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Dr. {record.doctorName}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-2 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Diagnóstico
                          </h4>
                          <p className="text-muted-foreground">{record.diagnosis}</p>
                        </div>

                        {record.symptoms && (
                          <div>
                            <h4 className="mb-2">Síntomas</h4>
                            <p className="text-muted-foreground">{record.symptoms}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
                          {record.vitalSigns.bloodPressure && (
                            <div>
                              <p className="text-sm text-muted-foreground">Presión Arterial</p>
                              <p className="font-medium">{record.vitalSigns.bloodPressure}</p>
                            </div>
                          )}
                          {record.vitalSigns.heartRate && (
                            <div>
                              <p className="text-sm text-muted-foreground">Freq. Cardíaca</p>
                              <p className="font-medium">{record.vitalSigns.heartRate}</p>
                            </div>
                          )}
                          {record.vitalSigns.temperature && (
                            <div>
                              <p className="text-sm text-muted-foreground">Temperatura</p>
                              <p className="font-medium">{record.vitalSigns.temperature}</p>
                            </div>
                          )}
                          {record.vitalSigns.weight && (
                            <div>
                              <p className="text-sm text-muted-foreground">Peso</p>
                              <p className="font-medium">{record.vitalSigns.weight}</p>
                            </div>
                          )}
                          {record.vitalSigns.height && (
                            <div>
                              <p className="text-sm text-muted-foreground">Altura</p>
                              <p className="font-medium">{record.vitalSigns.height}</p>
                            </div>
                          )}
                        </div>

                        {record.notes && (
                          <div className="border-t pt-4">
                            <h4 className="mb-2">Notas</h4>
                            <p className="text-muted-foreground">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="prescriptions" className="mt-6">
            <div className="grid gap-4">
              {filteredPrescriptions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Pill className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay prescripciones</p>
                  </CardContent>
                </Card>
              ) : (
                filteredPrescriptions.map((prescription) => (
                  <Card key={prescription.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5" />
                            {prescription.medication}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Paciente: {prescription.patientName}
                          </CardDescription>
                        </div>
                        <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                          {prescription.status === 'active' ? 'Activa' : prescription.status === 'completed' ? 'Completada' : 'Cancelada'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Dosis</p>
                            <p className="font-medium">{prescription.dosage}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Frecuencia</p>
                            <p className="font-medium">{prescription.frequency}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Duración</p>
                            <p className="font-medium">{prescription.duration}</p>
                          </div>
                        </div>

                        {prescription.instructions && (
                          <div className="border-t pt-3">
                            <p className="text-sm text-muted-foreground mb-1">Instrucciones</p>
                            <p className="text-muted-foreground">{prescription.instructions}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                          <span>Dr. {prescription.doctorName}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(prescription.date).toLocaleDateString('es-MX')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
