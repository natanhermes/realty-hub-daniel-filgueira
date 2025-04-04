import { PropertyService } from "@/app/services/propertyService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    if (!formData) {
      return NextResponse.json(
        { error: "Dados do formulário são obrigatórios" },
        { status: 400 }
      );
    }

    const response = await PropertyService.createOrUpdateProperty(formData);

    if (!response.success) {
      return NextResponse.json(
        { error: "Erro ao criar imóvel." },
        { status: 500 }
      );
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Erro na rota POST /api/property:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
