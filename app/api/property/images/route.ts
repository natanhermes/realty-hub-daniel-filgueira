import { PropertyService } from "@/app/services/propertyService";
import db from "@/lib/db";
import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

import { del } from "@vercel/blob"

export async function POST(request: Request) {
  const { propertyId, mediaItems } = await request.json();

  try {
    await db.image.createMany({
      data: mediaItems.map((item: { url: string, type: 'image' | 'video' }) => ({
        url: item.url,
        type: item.type,
        propertyId
      }))
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Erro ao salvar mídia no banco" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { propertyId, mediaItems } = await request.json();

  try {
    await db.image.createMany({
      data: mediaItems.map((item: { url: string, type: 'image' | 'video' }) => ({
        url: item.url,
        type: item.type,
        propertyId
      }))
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Erro ao salvar a nova mídia no banco." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const response = await PropertyService.deletePropertyMedia(id);

    if (!response.success) {
      return Response.json(
        { error: response.error },
        { status: response.statusCode || 500 }
      );
    }

    await del(response.data!.url)

    return Response.json({ success: true, data: response.data });
  } catch (error) {
    return Response.json(
      { error: "Erro ao deletar a mídia." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: "Código não fornecido" },
        { status: 400 }
      );
    }

    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      prefix: `projects/${code}/`
    });

    return NextResponse.json({ images: blobs });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Erro ao listar blobs" },
      { status: 500 }
    );
  }
}