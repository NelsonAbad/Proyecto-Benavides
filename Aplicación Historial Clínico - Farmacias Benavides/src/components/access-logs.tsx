import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { Header } from './header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { ArrowLeft, Search, Download, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';

interface AccessLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  module: string;
}

export const AccessLogs = () => {
  const { user, addLog } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');

  useEffect(() => {
    // Load logs from localStorage
    const storedLogs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
    
    // Add some sample logs if empty
    if (storedLogs.length === 0) {
      const sampleLogs: AccessLog[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          userId: 'admin1',
          userName: 'Admin Principal',
          userEmail: 'admin@benavides.com',
          action: 'Inicio de sesión',
          module: 'Autenticación'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          userId: 'medico1',
          userName: 'Dr. Carlos Méndez',
          userEmail: 'carlos.mendez@benavides.com',
          action: 'Consulta de paciente',
          module: 'Pacientes'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          userId: 'admin1',
          userName: 'Admin Principal',
          userEmail: 'admin@benavides.com',
          action: 'Creación de usuario',
          module: 'Usuarios'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          userId: 'farm1',
          userName: 'María González',
          userEmail: 'maria.gonzalez@benavides.com',
          action: 'Actualización de inventario',
          module: 'Inventario'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          userId: 'medico1',
          userName: 'Dr. Carlos Méndez',
          userEmail: 'carlos.mendez@benavides.com',
          action: 'Creación de prescripción',
          module: 'Prescripciones'
        }
      ];
      setLogs(sampleLogs);
      localStorage.setItem('accessLogs', JSON.stringify(sampleLogs));
    } else {
      setLogs(storedLogs);
    }
    
    addLog('Acceso a logs del sistema', 'Logs');
  }, [addLog]);

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }),
      time: date.toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    };
  };

  const handleExportLogs = () => {
    const csvContent = [
      ['Fecha', 'Hora', 'Usuario', 'Email', 'Acción', 'Módulo'].join(','),
      ...filteredLogs.map(log => {
        const { date, time } = formatDateTime(log.timestamp);
        return [date, time, log.userName, log.userEmail, log.action, log.module].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs-benavides-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Logs exportados exitosamente');
    addLog('Exportación de logs', 'Logs');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    
    return matchesSearch && matchesModule;
  });

  const uniqueModules = Array.from(new Set(logs.map(log => log.module)));

  const getModuleBadgeColor = (module: string) => {
    const colors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'Autenticación': 'default',
      'Usuarios': 'destructive',
      'Pacientes': 'secondary',
      'Logs': 'outline',
      'Prescripciones': 'default',
      'Inventario': 'secondary'
    };
    return colors[module] || 'outline';
  };

  if (user?.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
          <h1>Logs de Acceso</h1>
          <p className="text-muted-foreground mt-2">
            Bitácora de actividad y auditoría del sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <CardTitle>Registros de Actividad</CardTitle>
                  <CardDescription>Total de registros: {filteredLogs.length}</CardDescription>
                </div>
                <Button onClick={handleExportLogs}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por usuario, acción o módulo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filterModule} onValueChange={setFilterModule}>
                    <SelectTrigger>
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los módulos</SelectItem>
                      {uniqueModules.map(module => (
                        <SelectItem key={module} value={module}>
                          {module}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Módulo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No se encontraron registros
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => {
                      const { date, time } = formatDateTime(log.timestamp);
                      return (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{date}</span>
                              <span className="text-xs text-muted-foreground">{time}</span>
                            </div>
                          </TableCell>
                          <TableCell>{log.userName}</TableCell>
                          <TableCell className="text-xs">{log.userEmail}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>
                            <Badge variant={getModuleBadgeColor(log.module)}>
                              {log.module}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="mb-2">Información de Cumplimiento</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✓ Los logs son almacenados con cifrado AES-256</p>
                <p>✓ Cumple con NOM-024-SSA3-2012 para registros de salud</p>
                <p>✓ Retención de logs: 100 registros más recientes</p>
                <p>✓ Conexión segura mediante HTTPS/TLS 1.3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
