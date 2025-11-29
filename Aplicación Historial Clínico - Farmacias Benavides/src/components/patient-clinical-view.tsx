import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { Header } from './header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { FileText, Pill, Calendar, User, Activity, ClipboardList, Heart, Download } from 'lucide-react';
import { Button } from './ui/button';

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

export function PatientClinicalView() {
  const { user, addLog } = useAuth();
  const [myRecords, setMyRecords] = useState<ClinicalRecord[]>([]);
  const [myPrescriptions, setMyPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMyData();
    addLog('Acceso a mi historial clínico', 'Historial Clínico');
  }, []);

  const loadMyData = () => {
    // Get patient info from stored patients
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const myPatientRecord = patients.find((p: any) => p.email === user?.email);

    if (myPatientRecord) {
      // Load clinical records
      const allRecords = JSON.parse(localStorage.getItem('clinicalRecords') || '[]');
      const patientRecords = allRecords.filter((r: ClinicalRecord) => r.patientId === myPatientRecord.id);
      setMyRecords(patientRecords);

      // Load prescriptions
      const allPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
      const patientPrescriptions = allPrescriptions.filter((p: Prescription) => p.patientId === myPatientRecord.id);
      setMyPrescriptions(patientPrescriptions);
    }
  };

  const filteredRecords = myRecords.filter(record =>
    (record.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrescriptions = myPrescriptions.filter(prescription =>
    (prescription.medication || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prescription.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePrescriptions = filteredPrescriptions.filter(p => p.status === 'active');
  const completedPrescriptions = filteredPrescriptions.filter(p => p.status !== 'active');

  const downloadPrescription = (prescription: Prescription) => {
    toast.success('Descargando prescripción...');
    addLog(`Descarga de prescripción: ${prescription.medication}`, 'Prescripciones');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2">Mi Historial Clínico</h1>
          <p className="text-muted-foreground">Consulta tu historial médico y prescripciones</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Consultas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{myRecords.length}</div>
              <p className="text-xs text-muted-foreground">Registros médicos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Prescripciones Activas</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{activePrescriptions.length}</div>
              <p className="text-xs text-muted-foreground">Tratamientos en curso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Última Consulta</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {myRecords.length > 0 
                  ? new Date(myRecords[0].date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
                  : 'N/A'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {myRecords.length > 0 
                  ? new Date(myRecords[0].date).toLocaleDateString('es-MX', { year: 'numeric' })
                  : 'Sin consultas'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Records and Prescriptions */}
        <Tabs defaultValue="prescriptions" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="prescriptions" className="gap-2">
              <Pill className="h-4 w-4" />
              Mis Prescripciones
            </TabsTrigger>
            <TabsTrigger value="records" className="gap-2">
              <FileText className="h-4 w-4" />
              Historial Médico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="mt-6">
            <div className="space-y-6">
              {/* Active Prescriptions */}
              <div>
                <h3 className="mb-4">Prescripciones Activas</h3>
                <div className="grid gap-4">
                  {activePrescriptions.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Pill className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No tienes prescripciones activas</p>
                      </CardContent>
                    </Card>
                  ) : (
                    activePrescriptions.map((prescription) => (
                      <Card key={prescription.id} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2">
                                <Pill className="h-5 w-5 text-primary" />
                                {prescription.medication}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                Recetado por Dr. {prescription.doctorName}
                              </CardDescription>
                            </div>
                            <Badge className="bg-green-500">Activa</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Dosis</p>
                                <p className="font-medium">{prescription.dosage}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Frecuencia</p>
                                <p className="font-medium">{prescription.frequency}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Duración</p>
                                <p className="font-medium">{prescription.duration}</p>
                              </div>
                            </div>

                            {prescription.instructions && (
                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-2">📋 Instrucciones</p>
                                <p className="text-sm text-blue-800">{prescription.instructions}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Recetado el {new Date(prescription.date).toLocaleDateString('es-MX', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-2"
                                onClick={() => downloadPrescription(prescription)}
                              >
                                <Download className="h-4 w-4" />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Completed/Past Prescriptions */}
              {completedPrescriptions.length > 0 && (
                <div>
                  <h3 className="mb-4">Prescripciones Anteriores</h3>
                  <div className="grid gap-4">
                    {completedPrescriptions.map((prescription) => (
                      <Card key={prescription.id} className="opacity-75">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2">
                                <Pill className="h-5 w-5" />
                                {prescription.medication}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                Dr. {prescription.doctorName}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">
                              {prescription.status === 'completed' ? 'Completada' : 'Cancelada'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
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
                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <span className="text-sm text-muted-foreground">
                              {new Date(prescription.date).toLocaleDateString('es-MX')}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="gap-2"
                              onClick={() => downloadPrescription(prescription)}
                            >
                              <Download className="h-4 w-4" />
                              Descargar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="records" className="mt-6">
            <div className="grid gap-4">
              {filteredRecords.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No tienes registros médicos</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRecords.map((record) => (
                  <Card key={record.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            {record.diagnosis}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Dr. {record.doctorName}
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
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {record.symptoms && (
                          <div>
                            <h4 className="mb-2">Síntomas Reportados</h4>
                            <p className="text-muted-foreground">{record.symptoms}</p>
                          </div>
                        )}

                        {/* Vital Signs */}
                        {(record.vitalSigns.bloodPressure || record.vitalSigns.heartRate || 
                          record.vitalSigns.temperature || record.vitalSigns.weight || 
                          record.vitalSigns.height) && (
                          <div className="pt-2">
                            <h4 className="mb-3 flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              Signos Vitales
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
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
                          </div>
                        )}

                        {record.notes && (
                          <div className="border-t pt-4">
                            <h4 className="mb-2">Notas del Médico</h4>
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
        </Tabs>
      </div>
    </div>
  );
}
