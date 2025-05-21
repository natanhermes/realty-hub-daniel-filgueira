import { PropertyService } from "@/app/services/propertyService";
import { del } from "@vercel/blob";
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

export async function DELETE(request: NextRequest) {
  try {
    const { code } = await request.json();

    const response = await PropertyService.deleteProperty(code);

    if (!response.success) {
      return NextResponse.json(
        { statusText: response.error },
        { status: response.statusCode || 500 }
      );
    }

    await del(`https://ywqqqbg9btxv4mxt.public.blob.vercel-storage.com/projects/${code}`)

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Erro na rota DELETE /api/property:", error);
    return NextResponse.json(
      { statusText: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
