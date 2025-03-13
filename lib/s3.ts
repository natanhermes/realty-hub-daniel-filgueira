import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadPropertyImage(file: File, propertyId: string) {
  try {
    if (!file) {
      throw new Error('Arquivo não fornecido');
    }

    if (!propertyId) {
      throw new Error('ID da propriedade não fornecido');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const key = `properties/${propertyId}/${fileName}`;

    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
      throw new Error('Variáveis de ambiente AWS não configuradas corretamente');
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return `${process.env.AWS_CLOUDFRONT_URL}/${key}`;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
    }
    throw new Error('Erro desconhecido ao fazer upload da imagem');
  }
}