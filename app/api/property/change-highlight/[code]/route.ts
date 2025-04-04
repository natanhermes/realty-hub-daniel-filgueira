import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  const property = await db.property.findUnique({
    where: { code }
  });

  if (!property) {
    return NextResponse.json({ message: 'Imóvel não encontrado!' }, { status: 404 });
  }

  await db.property.update({
    where: { id: property.id },
    data: { highlight: !property.highlight }
  });

  return NextResponse.json({ message: 'Imóvel destacado!' });
}
