'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'usuario' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const router = useRouter();

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      const response = await fetch('/api/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('No se pudieron cargar los usuarios');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("No tienes permisos para ver esta página o tu sesión ha expirado.");
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newUser, action: 'create_user' }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      alert('Usuario creado exitosamente.');
      setNewUser({ name: '', email: '', password: '', role: 'usuario' });
      fetchUsers(); // Actualiza la lista de usuarios
    } catch (error) {
      alert(`Error al crear usuario: ${error.message}`);
    }
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'assign_role', targetUserId: selectedUser, newRole }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      alert('Rol de usuario actualizado.');
      setSelectedUser(null);
      setNewRole('');
      fetchUsers(); // Actualiza la lista de usuarios
    } catch (error) {
      alert(`Error al asignar rol: ${error.message}`);
    }
  };

  return (
    <div className="manage-users-container">
      <h1>Gestión de Usuarios</h1>
      <button onClick={() => router.push('/dashboard/admin')}>
        Volver al Panel Principal
      </button>

      <div className="forms-container">
        <section className="create-user-form">
          <h2>Crear Nuevo Usuario</h2>
          <form onSubmit={handleCreateUser}>
            <label>Nombre:</label>
            <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
            <label>Email:</label>
            <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
            <label>Contraseña:</label>
            <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
            <label>Rol:</label>
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Crear Usuario</button>
          </form>
        </section>

        <section className="assign-role-form">
          <h2>Asignar Rol a Usuario Existente</h2>
          <form onSubmit={handleAssignRole}>
            <label>Seleccionar Usuario:</label>
            <select value={selectedUser || ''} onChange={(e) => setSelectedUser(e.target.value)} required>
              <option value="" disabled>Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
            <label>Nuevo Rol:</label>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} required>
              <option value="" disabled>Selecciona un rol</option>
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={!selectedUser || !newRole}>
              Asignar Rol
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}