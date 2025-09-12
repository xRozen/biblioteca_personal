'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: ''
  });
  const router = useRouter();

  // Datos de ejemplo
  const sampleBooks = [
    { 
      id: 1, 
      title: 'Cien años de soledad', 
      author: 'Gabriel García Márquez', 
      genre: 'Realismo mágico',
      userRating: 0,
      userReview: '',
      reviewStatus: 'sin-opinion'
    },
    { 
      id: 2, 
      title: '1984', 
      author: 'George Orwell', 
      genre: 'Ciencia ficción',
      userRating: 4,
      userReview: 'Me gustó mucho, pero el final fue algo triste.',
      reviewStatus: 'pendiente'
    },
    { 
      id: 3, 
      title: 'El principito', 
      author: 'Antoine de Saint-Exupéry', 
      genre: 'Fábula',
      userRating: 5,
      userReview: 'Un libro maravilloso lleno de enseñanzas.',
      reviewStatus: 'aprobado'
    }
  ];

  useEffect(() => {
    const userData = {
      name: 'Ana García',
      email: 'ana@ejemplo.com',
      role: 'usuario'
    };
    
    setUser(userData);
    setBooks(sampleBooks);
  }, []);

  const handleLogout = () => {
    alert('Sesión cerrada');
    router.push('/');
  };

  const openReviewModal = (book) => {
    setSelectedBook(book);
    setRating(book.userRating || 0);
    setReviewText(book.userReview || '');
    setShowReviewModal(true);
  };

  const openAddBookModal = () => {
    setNewBook({ title: '', author: '', genre: '' });
    setShowAddBookModal(true);
  };

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.genre) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newBookData = {
      id: Date.now(),
      title: newBook.title,
      author: newBook.author,
      genre: newBook.genre,
      userRating: 0,
      userReview: '',
      reviewStatus: 'sin-opinion'
    };

    setBooks([...books, newBookData]);
    setShowAddBookModal(false);
    alert('¡Libro agregado exitosamente!');
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert('Por favor califica el libro con al menos 1 estrella');
      return;
    }

    const updatedBooks = books.map(book => 
      book.id === selectedBook.id 
        ? { 
            ...book, 
            userRating: rating, 
            userReview: reviewText,
            reviewStatus: 'pendiente'
          }
        : book
    );

    setBooks(updatedBooks);
    setShowReviewModal(false);
    alert('¡Reseña enviada! Espera la aprobación de un administrador.');
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
        return <span className="status-badge no-review">Sin opinión</span>;
    }
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => !readonly && onRatingChange(star)}
            style={{ cursor: readonly ? 'default' : 'pointer' }}
          >
            ⭐
          </span>
        ))}
      </div>
    );
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
          <h1>Mi Biblioteca</h1>
          <div>
            <span className="welcome">Hola, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
          </div>
        </nav>
      </header>

      <main className="container">
        {/* Banner de bienvenida */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <h2>¡Califica y opina sobre tus lecturas!</h2>
            <p>Comparte tu experiencia con otros lectores</p>
          </div>
        </section>

        {/* Botón para agregar libro */}
        <section className="add-book-section">
          <button onClick={openAddBookModal} className="add-book-btn">
            <span className="add-icon">➕</span>
            Agregar Nuevo Libro
          </button>
        </section>

        {/* Estadísticas */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Libros en tu colección</h3>
              <span className="stat-number">{books.length}</span>
            </div>
            <div className="stat-card">
              <h3>Opiniones enviadas</h3>
              <span className="stat-number">
                {books.filter(b => b.userRating > 0).length}
              </span>
            </div>
            <div className="stat-card">
              <h3>Opiniones aprobadas</h3>
              <span className="stat-number">
                {books.filter(b => b.reviewStatus === 'aprobado').length}
              </span>
            </div>
          </div>
        </section>

        {/* Lista de libros para calificar */}
        <section className="books-section">
          <h3>Tu colección de libros ({books.length})</h3>
          <p className="section-subtitle">Haz clic en un libro para calificarlo y escribir tu opinión</p>

          {books.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h4>No tienes libros en tu colección</h4>
              <p>Agrega tu primer libro para empezar a calificar y opinar</p>
              <button onClick={openAddBookModal} className="empty-btn">
                Agregar Primer Libro
              </button>
            </div>
          ) : (
            <div className="books-grid">
              {books.map(book => (
                <div 
                  key={book.id} 
                  className="book-card"
                  onClick={() => openReviewModal(book)}
                >
                  <div className="book-content">
                    <h4 className="book-title">{book.title}</h4>
                    <p className="book-author">{book.author}</p>
                    <span className="book-genre">{book.genre}</span>
                    
                    <div className="book-rating">
                      <StarRating rating={book.userRating} readonly={true} />
                      {book.userRating > 0 && (
                        <span className="rating-number">({book.userRating}/5)</span>
                      )}
                    </div>

                    {getStatusBadge(book.reviewStatus)}
                    
                    {book.userReview && (
                      <p className="review-preview">
                        {book.userReview.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                  
                  <div className="book-actions">
                    <button 
                      className="review-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openReviewModal(book);
                      }}
                    >
                      {book.userRating ? 'Editar opinión' : 'Calificar libro'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal de calificación */}
        {showReviewModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Calificar: {selectedBook.title}</h3>
              <p className="modal-author">por {selectedBook.author}</p>
              
              <div className="rating-section">
                <label>Calificación:</label>
                <StarRating 
                  rating={rating} 
                  onRatingChange={setRating}
                />
                <span className="rating-text">
                  {rating === 0 ? 'Sin calificar' : `${rating} estrellas`}
                </span>
              </div>

              <div className="review-section">
                <label>Tu opinión:</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Comparte tu experiencia con este libro..."
                  rows="5"
                  className="review-textarea"
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleSubmitReview}
                >
                  Enviar opinión
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para agregar libro */}
        {showAddBookModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Agregar Nuevo Libro</h3>
              
              <div className="form-group">
                <label>Título del libro:</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  placeholder="Ej: Cien años de soledad"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Autor:</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  placeholder="Ej: Gabriel García Márquez"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Género:</label>
                <input
                  type="text"
                  value={newBook.genre}
                  onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                  placeholder="Ej: Realismo mágico"
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowAddBookModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleAddBook}
                >
                  Agregar Libro
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}