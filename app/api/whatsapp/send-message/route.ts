import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();

  const body = await request.json()

  const { name, email, phone, message, propertyLink, contactPreference } = body

  if (!session) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  }
  try {
    const apiKey = process.env.EVOLUTION_API_KEY!;
    const url = 'https://n8n-metha-evolution-api.8uvbdc.easypanel.host/message/sendText/Metha Potiguar';

    const payload = {
      number: `558496703029`,
      text: `Solicitação de contato para o imóvel: ${propertyLink}

*Nome:* ${name}
*Email:* ${email}
*Telefone:* ${phone}
*Mensagem:* ${message}
*Preferência de contato:* ${contactPreference}
    `
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apiKey': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Erro ao enviar: ${err}`)
    }

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}