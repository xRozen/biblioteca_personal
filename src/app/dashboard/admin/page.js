'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews');
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
      setReviews(data.reviews);
      setUsers(data.users);
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const updateReviewStatus = async (reviewId, action) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      router.push('/login');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reviewId, action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la reseña');
      }

      await fetchAdminData();
      alert(`Reseña ${action === 'delete' ? 'eliminada' : 'actualizada'} exitosamente`);

    } catch (error) {
      console.error("Error updating review:", error);
      alert(`Hubo un error al realizar la operación: ${error.message}`);
    }
  };

  const approveReview = async (reviewId) => updateReviewStatus(reviewId, 'approve');
  const rejectReview = async (reviewId) => updateReviewStatus(reviewId, 'reject');
  const deleteReview = async (reviewId) => updateReviewStatus(reviewId, 'delete');

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
    <div className="dashboard-admin-container">
      <header>
        <nav>
          <h1>Panel de Administración</h1>
          <div>
            <span className="welcome">Hola, {user.name}</span>
            <button
              onClick={() => router.push('/dashboard/admin/manage-users')}
              className="manage-users-btn"
            >
              Gestión de Usuarios
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>
      <main className="container">
        <section className="admin-banner">
          <h2>Panel de Administración de la Biblioteca</h2>
          <p>Gestión de reseñas de libros y usuarios registrados</p>
        </section>

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

        <section className="tabs-section">
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'reviews' ? null : 'reviews')}
          >
            Reseñas Pendientes
          </button>
          <button
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'approved' ? null : 'approved')}
          >
            Reseñas Aprobadas
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'users' ? null : 'users')}
          >
            Usuarios
          </button>
        </section>

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
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <h4>{review.bookTitle}</h4>
                      <p>por {review.userName || 'Usuario'}</p>
                    </div>
                    <div className="review-rating">
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="review-content">
                      <p>{review.review}</p>
                    </div>
                    <div className="review-footer">
                      <span className="review-date">
                        Enviada el: {new Date(review.submittedAt).toLocaleDateString()}
                      </span>
                      <div className="review-actions">
                        <button className="approve-btn" onClick={() => approveReview(review._id)}>
                          ✅ Aprobar
                        </button>
                        <button className="reject-btn" onClick={() => rejectReview(review._id)}>
                          ❌ Rechazar
                        </button>
                        <button className="delete-btn" onClick={() => deleteReview(review._id)}>
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
                  <div key={review._id} className="review-card approved">
                    <div className="review-header">
                      <h4>{review.bookTitle}</h4>
                      <p>por {review.userName || 'Usuario'}</p>
                    </div>
                    <div className="review-rating">
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="review-content">
                      <p>{review.review}</p>
                    </div>
                    <div className="review-footer">
                      <span className="review-date">
                        Aprobada el: {new Date(review.submittedAt).toLocaleDateString()}
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
                  <div key={user._id} className="user-card">
                    <div className="user-header">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                    <div className="user-info">
                      <span className="user-role">Rol: {user.role}</span>
                    </div>
                    <div className="user-stats">
                      <p>Reseñas: {reviews.filter(r => r.userId.toString() === user._id.toString()).length}</p>
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