import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { address } = body;

  if (!address) {
    return new Response(JSON.stringify({ error: 'Endereço é obrigatório' }), {
      status: 400,
    });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const { lat, lng } = data.results[0].geometry.location

    return NextResponse.json({ lat, lng })
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 },
    );
  }
}
