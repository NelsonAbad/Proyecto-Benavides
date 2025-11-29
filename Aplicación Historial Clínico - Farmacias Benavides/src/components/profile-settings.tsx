import { useState } from 'react';
import { useAuth } from './auth-context';
import { Header } from './header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Bell, 
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { Switch } from './ui/switch';

export const ProfileSettings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [prescriptionAlerts, setPrescriptionAlerts] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      medico: 'Médico',
      farmaceutico: 'Farmacéutico',
      paciente: 'Paciente'
    };
    return labels[role] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      admin: 'destructive',
      medico: 'default',
      farmaceutico: 'secondary',
      paciente: 'outline'
    };
    return variants[role] || 'default';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileSave = async () => {
    if (!name || !email) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    setProfileSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setPasswordSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Contraseña actualizada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleNotificationsSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Preferencias de notificaciones guardadas');
    } catch (error) {
      toast.error('Error al guardar las preferencias');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1>Configuración de Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Administra tu información personal y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-gradient-to-br from-benavides-blue to-benavides-red text-white text-2xl">
                    {getInitials(user?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="mb-1">{user?.name}</h3>
                  <Badge variant={getRoleBadgeVariant(user?.role || '')}>
                    {getRoleLabel(user?.role || '')}
                  </Badge>
                </div>
                <Separator />
                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Cuenta verificada</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
                <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      Actualiza tu información de perfil y contacto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                            placeholder="Juan Pérez García"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            placeholder="usuario@benavides.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+52 (55) 1234-5678"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Rol del Usuario</Label>
                        <Input
                          id="role"
                          value={getRoleLabel(user?.role || '')}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        onClick={handleProfileSave} 
                        disabled={profileSaving}
                        className="w-full md:w-auto"
                      >
                        {profileSaving ? (
                          <>Guardando...</>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cambiar Contraseña</CardTitle>
                    <CardDescription>
                      Asegúrate de usar una contraseña segura de al menos 8 caracteres
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Contraseña Actual *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pl-10 pr-10"
                          placeholder="Ingresa tu contraseña actual"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10 pr-10"
                          placeholder="Mínimo 8 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nueva Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                          placeholder="Confirma tu nueva contraseña"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        onClick={handlePasswordChange} 
                        disabled={passwordSaving}
                        className="w-full md:w-auto"
                      >
                        {passwordSaving ? (
                          <>Actualizando...</>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Cambiar Contraseña
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seguridad de la Cuenta</CardTitle>
                    <CardDescription>
                      Información sobre la seguridad de tu cuenta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Cifrado AES-256 Activo</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tus datos están protegidos con cifrado de grado militar
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Conexión HTTPS/TLS</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Todas las comunicaciones están cifradas de extremo a extremo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Cumplimiento Normativo</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Cumple con NOM-024-SSA3-2012 y NOM-004-SSA3-2012
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de Notificaciones</CardTitle>
                    <CardDescription>
                      Configura cómo y cuándo quieres recibir notificaciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications" className="cursor-pointer">
                          Notificaciones por Correo
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe actualizaciones importantes por email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="prescription-alerts" className="cursor-pointer">
                          Alertas de Prescripciones
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Notificaciones sobre nuevas prescripciones médicas
                        </p>
                      </div>
                      <Switch
                        id="prescription-alerts"
                        checked={prescriptionAlerts}
                        onCheckedChange={setPrescriptionAlerts}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="appointment-reminders" className="cursor-pointer">
                          Recordatorios de Citas
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe recordatorios antes de tus citas médicas
                        </p>
                      </div>
                      <Switch
                        id="appointment-reminders"
                        checked={appointmentReminders}
                        onCheckedChange={setAppointmentReminders}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="system-updates" className="cursor-pointer">
                          Actualizaciones del Sistema
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Información sobre nuevas funciones y mejoras
                        </p>
                      </div>
                      <Switch
                        id="system-updates"
                        checked={systemUpdates}
                        onCheckedChange={setSystemUpdates}
                      />
                    </div>

                    <div className="pt-4">
                      <Button 
                        onClick={handleNotificationsSave}
                        className="w-full md:w-auto"
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Guardar Preferencias
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Logout Section */}
        <Card className="mt-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Cerrar Sesión</CardTitle>
            <CardDescription>
              Cierra tu sesión de forma segura en este dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={logout}
              className="w-full md:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
