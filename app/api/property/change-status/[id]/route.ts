import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { id } = await request.json();

  const property = await db.property.findUnique({
    where: { id }
  })

  if (!property) {
    return NextResponse.json({
      success: false,
      message: "Imóvel não encontrado!"
    })
  }

  await db.property.update({
    where: { id },
    data: { active: !property.active }
  })


  return NextResponse.json({
    success: true,
    message: "Imóvel inativado com sucesso!"
  })
}
