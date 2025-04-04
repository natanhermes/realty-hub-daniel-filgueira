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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const formData = await request.formData();
    const { code } = await params;

    const response = await PropertyService.createOrUpdateProperty(formData, code, true);

    if (!response.success) {
      return NextResponse.json({ error: "Erro ao atualizar imóvel." }, { status: 500 });
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Erro na rota PUT /api/property:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}