import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from './auth-context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Lock, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoBenavides from 'figma:asset/6a7a77acf51edc1216bbe328deea973abc3f8c76.png';

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('paciente');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, role);
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto bg-white rounded-2xl p-4 shadow-md">
            <img src={logoBenavides} alt="Farmacias Benavides" className="h-12" />
          </div>
          <CardTitle>Historial Clínico Digital</CardTitle>
          <CardDescription>Farmacias Benavides - Acceso Seguro</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@benavides.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol de Usuario</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                    <SelectItem value="farmaceutico">Farmacéutico</SelectItem>
                    <SelectItem value="paciente">Paciente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿No tienes cuenta? </span>
              <Link to="/register" className="text-primary hover:underline">
                Registrarse
              </Link>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                🔒 Conexión segura cifrada AES-256 | Cumple con NOM-024-SSA3-2012
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
