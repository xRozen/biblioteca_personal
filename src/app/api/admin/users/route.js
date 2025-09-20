import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
    }
    
    const body = await request.json();
    const { action, email, password, role, name, targetUserId, newRole } = body;

    const client = await clientPromise;
    const db = client.db("libreria");
    const usersCollection = db.collection("user");

    if (action === 'assign_role') {
      if (!targetUserId || !newRole) {
        return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
      }

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(targetUserId) },
        { $set: { role: newRole } }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json({ message: 'Usuario no encontrado o rol sin cambios' }, { status: 404 });
      }

      return NextResponse.json({ message: `Rol de usuario actualizado a '${newRole}'` }, { status: 200 });

    } else if (action === 'create_user') {
      if (!email || !password || !name || !role) {
        return NextResponse.json({ message: 'Datos de usuario incompletos' }, { status: 400 });
      }

      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: 'El usuario ya existe' }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        name,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
      };

      await usersCollection.insertOne(newUser);
      return NextResponse.json({ message: 'Usuario creado exitosamente' }, { status: 201 });
    }

    return NextResponse.json({ message: 'Acción no válida' }, { status: 400 });

  } catch (error) {
    console.error("Error al gestionar usuarios:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}