'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews');
  const router = useRouter();

  // Datos de ejemplo
  const sampleReviews = [
    {
      id: 1,
      bookTitle: 'Cien años de soledad',
      bookAuthor: 'Gabriel García Márquez',
      userName: 'Ana García',
      userEmail: 'ana@ejemplo.com',
      rating: 5,
      review: 'Una obra maestra de la literatura latinoamericana. García Márquez te transporta a Macondo con su narrativa mágica.',
      status: 'pendiente',
      submittedAt: '2024-01-15'
    },
    {
      id: 2,
      bookTitle: '1984',
      bookAuthor: 'George Orwell',
      userName: 'Carlos López',
      userEmail: 'carlos@ejemplo.com',
      rating: 4,
      review: 'Muy buena distopía, aunque un poco deprimente. La vigilancia constante te hace reflexionar.',
      status: 'aprobado',
      submittedAt: '2024-01-14'
    },
    {
      id: 3,
      bookTitle: 'El principito',
      bookAuthor: 'Antoine de Saint-Exupéry',
      userName: 'María Rodríguez',
      userEmail: 'maria@ejemplo.com',
      rating: 3,
      review: 'Bonito para niños, pero esperaba más profundidad. Las ilustraciones son encantadoras.',
      status: 'rechazado',
      submittedAt: '2024-01-13'
    },
    {
      id: 4,
      bookTitle: 'Don Quijote de la Mancha',
      bookAuthor: 'Miguel de Cervantes',
      userName: 'Juan Martínez',
      userEmail: 'juan@ejemplo.com',
      rating: 5,
      review: 'Obra cumbre de la literatura española. La locura de Don Quijote es conmovedora y divertida.',
      status: 'pendiente',
      submittedAt: '2024-01-12'
    }
  ];

  const sampleUsers = [
    {
      id: 1,
      name: 'Ana García',
      email: 'ana@ejemplo.com',
      role: 'usuario',
      joinedAt: '2024-01-01',
      reviewsCount: 3,
      approvedReviews: 2
    },
    {
      id: 2,
      name: 'Carlos López',
      email: 'carlos@ejemplo.com',
      role: 'usuario',
      joinedAt: '2024-01-05',
      reviewsCount: 5,
      approvedReviews: 4
    },
    {
      id: 3,
      name: 'María Rodríguez',
      email: 'maria@ejemplo.com',
      role: 'usuario',
      joinedAt: '2024-01-10',
      reviewsCount: 2,
      approvedReviews: 1
    },
    {
      id: 4,
      name: 'Admin Principal',
      email: 'admin@biblioteca.com',
      role: 'admin',
      joinedAt: '2024-01-01',
      reviewsCount: 0,
      approvedReviews: 0
    }
  ];

  useEffect(() => {
    // Simular verificación de admin
    const userData = {
      name: 'Admin Principal',
      email: 'admin@biblioteca.com',
      role: 'admin'
    };
    
    setUser(userData);
    setReviews(sampleReviews);
    setUsers(sampleUsers);
  }, []);

  const handleLogout = () => {
    alert('Sesión cerrada');
    router.push('/');
  };

  const approveReview = (reviewId) => {
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'aprobado' } : review
    ));
    alert('Reseña aprobada exitosamente');
  };

  const rejectReview = (reviewId) => {
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'rechazado' } : review
    ));
    alert('Reseña rechazada');
  };

  const deleteReview = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
    alert('Reseña eliminada');
  };

  const StarRating = ({ rating, readonly = true }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'aprobado':
        return <span className="status-badge approved">Aprobado</span>;
      case 'pendiente':
        return <span className="status-badge pending">Pendiente</span>;
      case 'rechazado':
        return <span className="status-badge rejected">Rechazado</span>;
      default:
        return <span className="status-badge">Desconocido</span>;
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <nav>
          <h1>Panel de Administración</h1>
          <div>
            <span className="welcome">Hola, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
          </div>
        </nav>
      </header>

      <main className="container">
        {/* Banner de administración */}
        <section className="admin-banner">
          <div className="admin-content">
            <h2>Panel de Control del Administrador</h2>
            <p>Gestiona reseñas y usuarios del sistema</p>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="admin-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total de Reseñas</h3>
              <span className="stat-number">{reviews.length}</span>
            </div>
            <div className="stat-card">
              <h3>Reseñas Pendientes</h3>
              <span className="stat-number">
                {reviews.filter(r => r.status === 'pendiente').length}
              </span>
            </div>
            <div className="stat-card">
              <h3>Reseñas Aprobadas</h3>
              <span className="stat-number">
                {reviews.filter(r => r.status === 'aprobado').length}
              </span>
            </div>
            <div className="stat-card">
              <h3>Usuarios Registrados</h3>
              <span className="stat-number">{users.length}</span>
            </div>
          </div>
        </section>

        {/* Navegación por pestañas */}
        <section className="tabs-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              📝 Reseñas Pendientes
            </button>
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Usuarios
            </button>
            <button 
              className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              ✅ Reseñas Aprobadas
            </button>
          </div>
        </section>

        {/* Contenido de las pestañas */}
        <section className="tab-content">
          {activeTab === 'reviews' && (
            <div className="reviews-list">
              <h3>Reseñas Pendientes de Revisión</h3>
              {reviews.filter(r => r.status === 'pendiente').length === 0 ? (
                <div className="empty-state">
                  <p>No hay reseñas pendientes de revisión</p>
                </div>
              ) : (
                reviews.filter(r => r.status === 'pendiente').map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-book">
                        <h4>{review.bookTitle}</h4>
                        <p>por {review.bookAuthor}</p>
                      </div>
                      <div className="review-user">
                        <span className="user-name">{review.userName}</span>
                        <span className="user-email">{review.userEmail}</span>
                      </div>
                    </div>

                    <div className="review-rating">
                      <StarRating rating={review.rating} />
                      <span className="rating-text">({review.rating}/5)</span>
                    </div>

                    <div className="review-content">
                      <p>{review.review}</p>
                    </div>

                    <div className="review-footer">
                      <span className="review-date">
                        Enviada el: {new Date(review.submittedAt).toLocaleDateString()}
                      </span>
                      <div className="review-actions">
                        <button 
                          className="approve-btn"
                          onClick={() => approveReview(review.id)}
                        >
                          ✅ Aprobar
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => rejectReview(review.id)}
                        >
                          ❌ Rechazar
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteReview(review.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'approved' && (
            <div className="reviews-list">
              <h3>Reseñas Aprobadas</h3>
              {reviews.filter(r => r.status === 'aprobado').length === 0 ? (
                <div className="empty-state">
                  <p>No hay reseñas aprobadas</p>
                </div>
              ) : (
                reviews.filter(r => r.status === 'aprobado').map(review => (
                  <div key={review.id} className="review-card approved">
                    <div className="review-header">
                      <div className="review-book">
                        <h4>{review.bookTitle}</h4>
                        <p>por {review.bookAuthor}</p>
                      </div>
                      <div className="review-user">
                        <span className="user-name">{review.userName}</span>
                        <span className="user-email">{review.userEmail}</span>
                      </div>
                    </div>

                    <div className="review-rating">
                      <StarRating rating={review.rating} />
                      <span className="rating-text">({review.rating}/5)</span>
                    </div>

                    <div className="review-content">
                      <p>{review.review}</p>
                    </div>

                    <div className="review-footer">
                      <span className="review-date">
                        Aprobada el: {new Date().toLocaleDateString()}
                      </span>
                      {getStatusBadge(review.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-list">
              <h3>Usuarios Registrados</h3>
              <div className="users-grid">
                {users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-header">
                      <h4>{user.name}</h4>
                      <span className={`user-role ${user.role}`}>
                        {user.role}
                      </span>
                    </div>
                    
                    <div className="user-info">
                      <p className="user-email">{user.email}</p>
                      <p className="user-joined">
                        Miembro desde: {new Date(user.joinedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="user-stats">
                      <div className="user-stat">
                        <span className="stat-number">{user.reviewsCount}</span>
                        <span className="stat-label">Reseñas</span>
                      </div>
                      <div className="user-stat">
                        <span className="stat-number">{user.approvedReviews}</span>
                        <span className="stat-label">Aprobadas</span>
                      </div>
                    </div>

                    <div className="user-actions">
                      <button className="user-btn view-btn">
                        👁️ Ver Perfil
                      </button>
                      {user.role === 'usuario' && (
                        <button className="user-btn delete-btn">
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}