'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBookManagementPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const fetchBooks = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/admin/books', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los libros');
      }

      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
        body: JSON.stringify({ bookId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el libro');
      }

      setMessage('Libro eliminado exitosamente');
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="admin-books-container">
      <header>
        <nav>
          <h1>Gestión de Libros</h1>
        </nav>
      </header>
      <main className="container">
        {message && <p className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
        <h3>Todos los Libros ({books.length})</h3>
        <div className="books-list">
          {books.length === 0 ? (
            <div className="empty-state">
              <p>Aún no hay libros en la base de datos.</p>
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
                  <button onClick={() => handleDeleteBook(book._id)} className="delete-btn">
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}