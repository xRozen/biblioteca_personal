'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); 
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error de inicio de sesión');
        return;
      }

      // 1. Almacena el token de seguridad
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);

      // 2. Redirige según el rol del usuario
      if (data.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }

    } catch (err) {
      console.error('Error de conexión:', err);
      setError('No se pudo conectar al servidor.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <h1 className="titulo">Iniciar Sesión</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="example@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ingrese su contraseña (min 8 caracteres)"
            />
          </div>
          
          <button type="submit" className="auth-button">
            Iniciar Sesión
          </button>
        </form>
        
        <p className="auth-link">
          ¿No tienes cuenta? <Link href="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}