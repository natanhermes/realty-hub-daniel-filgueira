import { PropertyService } from "@/app/services/propertyService"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const property = await PropertyService.getPropertyByCode(code)

  if (!property) {
    return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 })
  }

  return NextResponse.json(property)
} 