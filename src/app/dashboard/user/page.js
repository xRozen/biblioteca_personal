'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener datos del usuario');
      }

      const data = await response.json();
      setUser(data.user);
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching data:", error);
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
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
    <div className="dashboard-user-container">
      <header>
        <nav>
          <h1>Lexora</h1>
          <div>
            <span className="welcome">Hola, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
          </div>
        </nav>
      </header>

      <main className="container">
        <section className="dashboard-header">
          <h2>¡Gestiona tu biblioteca personal!</h2>
          <p>Aquí puedes ver y organizar los libros que has agregado</p>
          <button onClick={() => router.push('/dashboard/add-book')} className="add-btn">+ Agregar Nuevo Libro</button>
        </section>

        <section className="books-section">
          <h3>Tus libros ({books.length})</h3>
          <div className="books-list">
            {books.length === 0 ? (
              <div className="empty-state">
                <p>Aún no has agregado ningún libro.</p>
              </div>
            ) : (
              books.map(book => (
                <div key={book._id} className="book-card">
                  <div className="book-details">
                    <h4>{book.title}</h4>
                    <p>por {book.author}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}