// src/app/api/user/route.js

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
    const reviewsCollection = db.collection("review");
    const booksCollection = db.collection("book");

    const user = await usersCollection.findOne({ _id: userId }, { projection: { password: 0 } });
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const userReviews = await reviewsCollection.find({ userId: decoded.userId }).toArray();
    const userBooks = await booksCollection.find({ addedBy: decoded.userId }).toArray();
    
    // Calcula las estadísticas aquí
    const stats = {
      totalBooks: userBooks.length,
      totalReviews: userReviews.length,
      approvedReviews: userReviews.filter(review => review.status === 'aprobado').length,
    };
    
    // Envía los datos calculados
    return NextResponse.json({ user, books: userBooks, reviews: userReviews, stats }, { status: 200 });

  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}