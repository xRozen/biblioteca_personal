import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <header>
        <nav>
          <h1>Lexora</h1>
          <div>
            <Link href="/login">Iniciar Sesión</Link>
            <Link href="/register">Registrarse</Link>
          </div>
        </nav>
      </header>

      <main className="container">
        <section className="principal">
          <div className="principal-content">
            <h2>Organiza tu biblioteca personal</h2>
            <p>Gestiona tus libros y lleva un control de tus lecturas de manera simple y elegante.</p>
          </div>
        </section>

        <section className="caracteristicas">
          <div className="caracteristicas-content">
            <div className="caracteristica">
              <div className="icono">📚</div>
              <div className="descripcion">
                <h3>Gestiona tus libros</h3>
                <p>Añade, edita y organiza todos los libros de tu colección personal en un solo lugar.</p>
              </div>
            </div>
            
            <div className="caracteristica">
              <div className="icono">📖</div>
              <div className="descripcion">
                <h3>Seguimiento de lecturas</h3>
                <p>Lleva un registro detallado de tus lecturas actuales, futuras y completadas.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}