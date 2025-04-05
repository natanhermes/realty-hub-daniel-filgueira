import { PropertyService } from "@/app/services/propertyService";
import db from "@/lib/db";

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
    return Response.json({ success: true, data: response.data });
  } catch (error) {
    return Response.json(
      { error: "Erro ao deletar a mídia." },
      { status: 500 }
    );
  }
}