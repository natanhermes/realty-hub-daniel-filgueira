export async function uploadPropertyMedia(file: File, propertyCode: string): Promise<string> {
  try {
    const fileName = `${propertyCode}-${Date.now()}-${file.name}`;
    const fileType = file.type;

    const response = await fetch('/api/upload/presigned-url-aws', {
      method: 'POST',
      body: JSON.stringify({
        fileName,
        fileType,
        code: propertyCode
      })
    });

    if (!response.ok) {
      throw new Error('Falha ao obter URL de upload');
    }

    const { url, key } = await response.json();

    const uploadResponse = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': fileType
      }
    });

    if (!uploadResponse.ok) {
      throw new Error('Falha ao fazer upload do arquivo');
    }

    return `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${key}`;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
}

export async function deletePropertyMedia(propertyCode: string) {
  try {
    const prefix = propertyCode.startsWith('properties/')
      ? propertyCode
      : `properties/${propertyCode}/`;

    const response = await fetch('/api/upload/delete-media-aws', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prefix
      })
    });

    if (!response.ok) {
      throw new Error('Falha ao deletar os arquivos');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no delete:', error);
    throw error;
  }
}
