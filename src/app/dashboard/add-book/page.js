'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No autorizado. Por favor, inicia sesión.');
      }

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar el libro');
      }

      const result = await response.json();
      setMessage('Libro agregado exitosamente');
      setFormData({ title: '', author: '' });
      
      setTimeout(() => {
        router.push('/dashboard/user');
      }, 2000);
      
    } catch (error) {
      console.error("Error al agregar libro:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-container">
      <h1>Agregar Nuevo Libro</h1>
      <form onSubmit={handleSubmit} className="add-book-form">
        {message && <p className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
        
        <label>Título:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Autor:</label>
        <input type="text" name="author" value={formData.author} onChange={handleChange} required />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Agregando...' : 'Agregar Libro'}
        </button>
      </form>
      <button onClick={() => router.push('/dashboard/user')} className="back-btn">Volver</button>
    </div>
  );
}