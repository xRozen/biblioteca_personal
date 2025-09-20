import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("libreria");
    const booksCollection = db.collection("book");

    const allBooks = await booksCollection.find({}).toArray();

    return NextResponse.json({ books: allBooks }, { status: 200 });

  } catch (error) {
    console.error("Error al obtener todos los libros:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
    }

    const { bookId } = await request.json();
    
    const client = await clientPromise;
    const db = client.db("libreria");
    const booksCollection = db.collection("book");

    await booksCollection.deleteOne({ _id: new ObjectId(bookId) });

    return NextResponse.json({ message: 'Libro eliminado exitosamente' }, { status: 200 });

  } catch (error) {
    console.error("Error al eliminar libro:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}