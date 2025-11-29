import { useAuth } from './auth-context';
import { Button } from './ui/button';
import { LogOut, User, ArrowLeft, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import logoBenavides from 'figma:asset/6a7a77acf51edc1216bbe328deea973abc3f8c76.png';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      admin: 'destructive',
      medico: 'default',
      farmaceutico: 'secondary',
      paciente: 'outline'
    };
    return variants[role] || 'default';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      medico: 'Médico',
      farmaceutico: 'Farmacéutico',
      paciente: 'Paciente'
    };
    return labels[role] || role;
  };

  const isNotDashboard = location.pathname !== '/dashboard';

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isNotDashboard && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
              title="Regresar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src={logoBenavides} alt="Farmacias Benavides" className="h-10" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground leading-none mt-0.5">Historial Clínico Digital</p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name}</span>
                <Badge variant={getRoleBadgeVariant(user?.role || '')}>
                  {getRoleLabel(user?.role || '')}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
