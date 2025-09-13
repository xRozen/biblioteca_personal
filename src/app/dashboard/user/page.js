'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]); // Nuevo estado para los libros
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
        setReviews(data.reviews);
        setBooks(data.books); // Establece el estado de los libros
        setStats(data.stats);

      } catch (error) {
        console.error("Error fetching data:", error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
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

  const getReviewForBook = (bookId) => {
    if (!reviews || reviews.length === 0) return null;
    return reviews.find(review => review.bookId === bookId.toString());
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
          <h2>¡Califica y opina sobre tus lecturas!</h2>
          <p>Comparte tu experiencia con otros lectores</p>
          <button onClick={() => router.push('/dashboard/add-book')} className="add-btn">+ Agregar Nuevo Libro</button>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Libros en tu colección</h3>
              <span className="stat-number">{stats.totalBooks || 0}</span>
            </div>
            <div className="stat-card">
              <h3>Opiniones enviadas</h3>
              <span className="stat-number">{stats.totalReviews || 0}</span>
            </div>
            <div className="stat-card">
              <h3>Opiniones aprobadas</h3>
              <span className="stat-number">{stats.approvedReviews || 0}</span>
            </div>
          </div>
        </section>

        <section className="reviews-section">
          <h3>Tu colección de libros ({books.length})</h3>
          <p>Haz clic en un libro para calificarlo y escribir tu opinión</p>
          <div className="reviews-list">
            {books.length === 0 ? (
              <div className="empty-state">
                <p>Aún no has agregado ningún libro.</p>
              </div>
            ) : (
              books.map(book => {
                const review = getReviewForBook(book._id);
                const hasReview = !!review;

                return (
                  <div key={book._id} className="review-card">
                    <div className="review-header">
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                    </div>
                    <div className="review-body">
                      {hasReview ? (
                        <>
                          <StarRating rating={review.rating} />
                          <span className="rating-text">({review.rating}/5)</span>
                          {getStatusBadge(review.status)}
                          <p className="review-text">{review.review}</p>
                          <button onClick={() => router.push(`/reviews/edit/${review._id}`)} className="edit-btn">
                            Editar opinión
                          </button>
                        </>
                      ) : (
                        <button onClick={() => router.push(`/reviews/add/${book._id}`)} className="rate-btn">
                          Calificar libro
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}