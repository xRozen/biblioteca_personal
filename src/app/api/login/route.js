import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db("libreria");
    const usersCollection = db.collection("user");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Correo incorrecto.\n Intente de nuevo.' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Contraseña incorrecta.\n Intente de nuevo.' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ 
      message: 'Inicio de sesión exitoso', 
      token, 
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}