import { PropertyService } from "@/app/services/propertyService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    if (!formData) {
      return NextResponse.json(
        { statusText: "Dados do formulário são obrigatórios" },
        { status: 400 }
      );
    }

    const response = await PropertyService.createOrUpdateProperty(formData);

    if (!response.success) {
      return NextResponse.json(
        { statusText: response.error },
        { status: response.statusCode || 500 }
      );
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Erro na rota POST /api/property:", error);
    return NextResponse.json(
      { statusText: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
