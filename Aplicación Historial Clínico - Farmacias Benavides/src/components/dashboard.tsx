import { useAuth } from './auth-context';
import { Header } from './header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Shield, 
  Activity,
  ClipboardList,
  Calendar,
  Pill,
  Palette
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getModulesByRole = () => {
    const allModules = [
      {
        title: 'Gestión de Usuarios',
        description: 'Crear, editar y eliminar usuarios del sistema',
        icon: Users,
        path: '/users',
        roles: ['admin'],
        color: 'from-red-500 to-red-600'
      },
      {
        title: 'Gestión de Pacientes',
        description: 'Registro y seguimiento de pacientes',
        icon: UserPlus,
        path: '/patients',
        roles: ['admin', 'medico', 'farmaceutico'],
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Logs de Acceso',
        description: 'Bitácora de actividad del sistema',
        icon: FileText,
        path: '/logs',
        roles: ['admin'],
        color: 'from-purple-500 to-purple-600'
      },
      {
        title: 'Historial Clínico',
        description: 'Gestionar registros y prescripciones',
        icon: ClipboardList,
        path: '/clinical-history',
        roles: ['medico', 'farmaceutico'],
        color: 'from-green-500 to-green-600'
      },
      {
        title: 'Mi Historial Clínico',
        description: 'Ver mis consultas y prescripciones',
        icon: FileText,
        path: '/my-clinical',
        roles: ['paciente'],
        color: 'from-teal-500 to-teal-600'
      },
      {
        title: 'Citas Médicas',
        description: 'Agendar y consultar citas',
        icon: Calendar,
        path: '/appointments',
        roles: ['paciente', 'medico'],
        color: 'from-orange-500 to-orange-600'
      },
      {
        title: 'Design System',
        description: 'Guía de tipografía y componentes',
        icon: Palette,
        path: '/design-system',
        roles: ['admin'],
        color: 'from-indigo-500 to-indigo-600'
      }
    ];

    return allModules.filter(module => module.roles.includes(user?.role || ''));
  };

  const modules = getModulesByRole();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1>Bienvenido, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Panel de control - {user?.role === 'admin' ? 'Administrador' : user?.role === 'medico' ? 'Médico' : user?.role === 'farmaceutico' ? 'Farmacéutico' : 'Paciente'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.path} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(module.path)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Acceder →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Seguridad</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">AES-256</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cifrado de datos activo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Normatividad</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">✓ Cumple</div>
              <p className="text-xs text-muted-foreground mt-1">
                NOM-024-SSA3-2012
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Conexión</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">HTTPS</div>
              <p className="text-xs text-muted-foreground mt-1">
                Conexión segura TLS 1.3
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
