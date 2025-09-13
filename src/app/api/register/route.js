import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db("libreria");
    const usersCollection = db.collection("user");
    
    if (password.length < 8) {
        return NextResponse.json({ message: 'La contraseña debe tener al menos 8 caracteres.' }, { status: 400 });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Este correo ya está registrado' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Creacion del documento para insertar en la coleccion de la DB
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: 'usuario',
      createdAt: new Date()
    };

    // INsercion en la base de datos
    await usersCollection.insertOne(newUser);

    return NextResponse.json({ message: 'Usuario registrado con éxito' }, { status: 201 });
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}