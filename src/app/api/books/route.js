import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { title, author } = await request.json();

    if (!title || !author) {
      return NextResponse.json({ message: 'El título y el autor no pueden estar vacios' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("libreria");
    const booksCollection = db.collection("book");

    const newBook = {
      title,
      author,
      addedBy: decoded.userId,
      addedAt: new Date(),
    };

    await booksCollection.insertOne(newBook);

    return NextResponse.json({ message: 'Libro agregado exitosamente', book: newBook }, { status: 201 });

  } catch (error) {
    console.error("Error al agregar libro:", error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}