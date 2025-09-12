'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    console.log('Datos de registro:', formData);
    // Aquí iría la lógica de registro
    alert('Usuario registrado exitosamente');
    router.push('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <h1 className="titulo">Crear Cuenta</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Tu nombre"
            />
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="auth-button">
            Registrarse
          </button>
        </form>
        
        <p className="auth-link">
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}