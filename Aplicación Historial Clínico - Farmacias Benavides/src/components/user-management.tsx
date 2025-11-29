import { useState, useEffect } from 'react';
import { useAuth, UserRole } from './auth-context';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { ArrowLeft, Edit, Plus, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { Checkbox } from './ui/checkbox';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

const allPermissions = [
  { id: 'users', label: 'Gestión de Usuarios' },
  { id: 'patients', label: 'Gestión de Pacientes' },
  { id: 'logs', label: 'Logs de Acceso' },
  { id: 'settings', label: 'Configuración' },
  { id: 'reports', label: 'Reportes' },
  { id: 'records', label: 'Registros Médicos' },
  { id: 'prescriptions', label: 'Prescripciones' },
  { id: 'inventory', label: 'Inventario' }
];

export const UserManagement = () => {
  const { user: currentUser, addLog } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'paciente' as UserRole,
    permissions: [] as string[],
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    // Load mock users
    const mockUsers: SystemUser[] = [
      {
        id: '1',
        name: 'Admin Principal',
        email: 'admin@benavides.com',
        role: 'admin',
        permissions: ['users', 'patients', 'logs', 'settings', 'reports'],
        status: 'active',
        createdAt: '2025-01-15'
      },
      {
        id: '2',
        name: 'Dr. Carlos Méndez',
        email: 'carlos.mendez@benavides.com',
        role: 'medico',
        permissions: ['patients', 'records', 'prescriptions'],
        status: 'active',
        createdAt: '2025-02-01'
      },
      {
        id: '3',
        name: 'María González',
        email: 'maria.gonzalez@benavides.com',
        role: 'farmaceutico',
        permissions: ['prescriptions', 'inventory', 'patients'],
        status: 'active',
        createdAt: '2025-02-10'
      }
    ];
    setUsers(mockUsers);
    addLog('Acceso a gestión de usuarios', 'Usuarios');
  }, [addLog]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'paciente',
      permissions: [],
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      status: user.status
    });
    setIsDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      toast.error('Complete todos los campos requeridos');
      return;
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        ...formData
      } : u));
      toast.success('Usuario actualizado exitosamente');
      addLog(`Usuario actualizado: ${formData.email}`, 'Usuarios');
    } else {
      const newUser: SystemUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      toast.success('Usuario creado exitosamente');
      addLog(`Usuario creado: ${formData.email}`, 'Usuarios');
    }

    setIsDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast.success('Usuario eliminado');
    addLog(`Usuario eliminado: ${user?.email}`, 'Usuarios');
  };

  const togglePermission = (permissionId: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permissionId)
        ? formData.permissions.filter(p => p !== permissionId)
        : [...formData.permissions, permissionId]
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<UserRole, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      admin: { variant: 'destructive', label: 'Admin' },
      medico: { variant: 'default', label: 'Médico' },
      farmaceutico: { variant: 'secondary', label: 'Farmacéutico' },
      paciente: { variant: 'outline', label: 'Paciente' }
    };
    return variants[role];
  };

  if (currentUser?.role !== 'admin') {
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
          <h1>Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-2">
            Administre usuarios y sus permisos en el sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>Usuarios del Sistema</CardTitle>
                <CardDescription>Total de usuarios: {users.length}</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleCreateUser}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </DialogTitle>
            <DialogDescription>
              Configure los datos y permisos del usuario
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@benavides.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}>
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Permisos del Usuario</Label>
              <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                {allPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <label
                      htmlFor={permission.id}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? 'Actualizar' : 'Crear'} Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
