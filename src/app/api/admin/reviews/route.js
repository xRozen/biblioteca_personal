import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("libreria");
    const { action, reviewId } = await request.json();

    let result;
    const objectId = new ObjectId(reviewId);

    if (action === 'approve') {
      result = await db.collection("review").updateOne(
        { _id: objectId },
        { $set: { status: 'aprobado' } }
      );
    } else if (action === 'reject') {
      result = await db.collection("review").updateOne(
        { _id: objectId },
        { $set: { status: 'rechazado' } }
      );
    } else if (action === 'delete') {
      result = await db.collection("review").deleteOne({ _id: objectId });
    }

    if (result.modifiedCount > 0 || result.deletedCount > 0) {
      return NextResponse.json({ message: 'Reseña actualizada con éxito' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No se encontró la reseña o no se modificó' }, { status: 404 });
    }

  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}