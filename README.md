# Lexora: Tu Biblioteca Personal

Lexora es una aplicación web full-stack diseñada para que los amantes de la lectura gestionen su colección personal de libros, califiquen sus lecturas y compartan sus opiniones con una comunidad de lectores.

## Características

* **Gestión de Libros:** Agrega y organiza tu colección personal de libros.
* **Opiniones y Calificaciones:** Envía reseñas y califica tus lecturas con un sistema de estrellas.
* **Dashboard Personal:** Cada usuario tiene un panel de control con estadísticas sobre sus libros y reseñas.
* **Panel de Administración:** Un panel para administradores que permite gestionar usuarios y moderar reseñas (aprobar o rechazar).
* **Autenticación Segura:** Sistema de registro e inicio de sesión con JWT (JSON Web Tokens) para proteger las rutas.

## Tecnologías Utilizadas

* **Frontend:**
    * **Next.js:** Framework de React para el desarrollo de la interfaz de usuario.
    * **React:** Biblioteca para la creación de componentes interactivos.
* **Backend:**
    * **Next.js API Routes:** Para construir las APIs que manejan la lógica del servidor.
    * **Node.js:** Entorno de ejecución del servidor.
    * **JWT (JSON Web Tokens):** Para la autenticación y la gestión de sesiones.
    * **Bcryptjs:** Para encriptar las contraseñas de los usuarios.
* **Base de datos:**
    * **MongoDB:** Base de datos NoSQL para almacenar la información de usuarios, libros y reseñas.
* **Despliegue:**
    * **Vercel:** Plataforma de despliegue.

## Requisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:
* Node.js (versión 18 o superior)
* MongoDB (local o una instancia en la nube como MongoDB Atlas)

## Configuración del Proyecto

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_REPOSITORIO>
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Crear el archivo de entorno (`.env.local`):**
    En la raíz del proyecto, crea un archivo llamado `.env.local` y añade las siguientes variables. Sustituye los valores de ejemplo por tus propios datos.

    ```
    MONGODB_URI=<TU_CADENA_DE_CONEXION_A_MONGODB>
    JWT_SECRET=<UNA_CLAVE_SECRETA_ALEATORIA>
    ```

    * `MONGODB_URI`: La cadena de conexión a tu base de datos MongoDB.
    * `JWT_SECRET`: Una cadena de texto aleatoria y segura que se usará para firmar tus tokens JWT. Puedes generar una en línea o escribir una frase larga.

4.  **Ejecutar la aplicación:**
    ```bash
    npm run dev
    ```

    La aplicación se iniciará en `http://localhost:3000`.

## Estructura del Proyecto

* `src/app/`: Contiene todas las páginas y rutas de la aplicación.
* `src/app/api/`: Las rutas del backend para la autenticación, los dashboards y la gestión de libros/reseñas.
* `src/lib/`: Utilidades del proyecto, como la conexión a la base de datos.
* `public/`: Archivos estáticos como imágenes.

---

## Contribuciones

Si deseas contribuir a este proyecto, por favor crea un *fork* del repositorio, haz tus cambios y envía un *pull request*.

---

## Licencia

Este proyecto está bajo la licencia MIT.
