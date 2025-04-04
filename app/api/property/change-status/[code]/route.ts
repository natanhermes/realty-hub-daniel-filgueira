import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(_: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  const property = await db.property.findUnique({
    where: { code }
  })

  if (!property) {
    return NextResponse.json({
      success: false,
      message: "Imóvel não encontrado!"
    })
  }

  await db.property.update({
    where: { id: property.id },
    data: { active: !property.active }
  })


  return NextResponse.json({
    success: true,
    message: "Imóvel inativado com sucesso!"
  })
}
