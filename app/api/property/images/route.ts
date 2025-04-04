import db from "@/lib/db";

export async function POST(request: Request) {
  const { propertyId, imageUrls } = await request.json();

  try {
    await db.image.createMany({
      data: imageUrls.map((url: string) => ({
        url,
        propertyId
      }))
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Erro ao salvar imagens no banco" },
      { status: 500 }
    );
  }
}