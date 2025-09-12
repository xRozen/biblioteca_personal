'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de login:', formData);
    // Aquí iría la lógica de login
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
              placeholder="••••••••"
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