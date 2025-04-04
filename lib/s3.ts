export async function uploadPropertyImage(image: File, code: string) {
  try {
    if (!image) {
      throw new Error('Arquivo não fornecido');
    }

    if (!code) {
      throw new Error('Código do imóvel não fornecido');
    }

    const presignedUrlResponse = await fetch('/api/upload/presigned-url-aws', {
      method: 'POST',
      body: JSON.stringify({
        fileName: image.name,
        fileType: image.type,
        code
      })
    })

    const { url, key } = await presignedUrlResponse.json()

    await fetch(url, {
      method: 'PUT',
      body: image,
      headers: {
        'Content-Type': image.type
      }
    })

    return `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${key}`

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao realizar upload da imagem: ${error.message}`);
    }
    throw new Error('Erro desconhecido ao realizar upload da imagem');
  }
}