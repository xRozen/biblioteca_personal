import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <header>
        <div className="container">
          <nav>
            <h1>Lexora</h1>
            <div>
              <Link href="/login">Iniciar Sesión</Link>
              <Link href="/register">Registrarse</Link>
            </div>
          </nav>
        </div>
      </header>
      <main>
        <div className="container">
          <section className="principal">
            <h2>Organiza tu biblioteca personal</h2>
            <p>Gestiona tus libros y lleva un control de tus lecturas.</p>
          </section>
          <section className="caracteristicas">
            <div className="carta-caracteristica">
              <h3>Gestiona tus libros</h3>
              <p>Añade, edita y organiza todos los libros de tu colección personal.</p>
            </div>
            <div className="carta-caracteristica">
              <h3>Seguimiento de lecturas</h3>
              <p>Lleva un registro de tus lecturas actuales y futuras.</p>
            </div>
          </section>
        </div>
      </main> 
    </div>
  );
}