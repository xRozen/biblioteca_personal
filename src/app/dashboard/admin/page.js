'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos del admin');
      }

      const data = await response.json();
      setUser(data.user);
      setUsers(data.users);
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleDeleteBook = async (bookId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este libro?");
    if (!confirmDelete) return;

    setMessage('');
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/admin/books', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el libro');
      }

      setMessage('Libro eliminado exitosamente');
      fetchAdminData();
    } catch (error) {
      console.error("Error deleting book:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-admin-container">
      <header>
        <nav>
          <h1>Panel de Administración</h1>
          <div>
            <span className="welcome">Hola, {user.name}</span>
            <button onClick={() => router.push('/dashboard/admin/manage-users')} className="manage-users-btn">
              Gestión de Usuarios
            </button>
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
          </div>
        </nav>
      </header>

      <main className="container">
        <section className="admin-banner">
          <h2>Panel de Administración de la Biblioteca</h2>
          <p>Gestión de libros de la plataforma</p>
        </section>

        <section className="admin-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Usuarios Registrados</h3>
              <span className="stat-number">{users.length}</span>
            </div>
            <div className="stat-card">
              <h3>Total de Libros</h3>
              <span className="stat-number">{books.length}</span>
            </div>
          </div>
        </section>
        
        {message && <p className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}

        <section className="books-list">
            <h3>Todos los Libros ({books.length})</h3>
            {books.length === 0 ? (
                <div className="empty-state">
                  <p>No hay libros en la base de datos.</p>
                </div>
              ) : (
                books.map(book => (
                  <div key={book._id} className="book-card">
                    <div className="book-details">
                      <h4>{book.title}</h4>
                      <p>por {book.author}</p>
                      <small>ID: {book._id}</small>
                    </div>
                    <div className="book-actions">
                      <button className="delete-btn" onClick={() => handleDeleteBook(book._id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
        </section>
      </main>
    </div>
  );
}