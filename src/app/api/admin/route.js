import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
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
    const usersCollection = db.collection("user");
    const booksCollection = db.collection("book");

    const users = await usersCollection.find({}).project({ password: 0 }).toArray();
    const books = await booksCollection.find({}).toArray();

    return NextResponse.json({ 
      user: { name: decoded.name, role: decoded.role },
      users,
      books,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching admin data:", error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}