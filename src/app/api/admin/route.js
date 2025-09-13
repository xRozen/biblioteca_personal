import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRole = decoded.role;

    if (userRole !== 'admin') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("libreria");
    const reviewsCollection = db.collection("review");
    const usersCollection = db.collection("user");

    const reviews = await reviewsCollection.find({}).toArray();
    const users = await usersCollection.find({}).toArray();
    
    const userId = new ObjectId(decoded.userId);
    const adminUser = await usersCollection.findOne({ _id: userId });

    return NextResponse.json({ 
      reviews, 
      users, 
      user: {
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      } 
    }, { status: 200 });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }
    console.error("Error al obtener datos del dashboard de admin:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}