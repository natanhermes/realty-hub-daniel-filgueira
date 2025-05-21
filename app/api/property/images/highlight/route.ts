import db from "@/lib/db";

export async function POST(request: Request) {
  const { id, propertyId } = await request.json();

  try {
    const image = await db.image.findUnique({
      where: { id, propertyId }
    });

    if (!image) {
      return Response.json(
        { error: 'Imagem não encontrada.' },
        { status: 404 }
      );
    }

    await db.$transaction([
      db.image.updateMany({
        where: { highlight: true, propertyId, id },
        data: { highlight: false }
      }),
      db.image.update({
        where: { id, propertyId },
        data: { highlight: true }
      })
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Erro ao atualizar destaque da imagem." },
      { status: 500 }
    );
  }
}
