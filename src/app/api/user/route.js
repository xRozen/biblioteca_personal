import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decoded.userId);

    const client = await clientPromise;
    const db = client.db("libreria");
    const usersCollection = db.collection("user");
    const booksCollection = db.collection("book");

    const user = await usersCollection.findOne({ _id: userId }, { projection: { password: 0 } });
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const userBooks = await booksCollection.find({ addedBy: decoded.userId }).toArray();
    
    return NextResponse.json({ user, books: userBooks }, { status: 200 });

  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}