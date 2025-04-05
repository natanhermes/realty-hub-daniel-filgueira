import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_MEDIA_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'],
  video: ['video/mp4', 'video/webm', 'video/ogg']
};

export async function POST(request: Request) {
  const { fileName, fileType, code } = await request.json();

  const isValidImage = ALLOWED_MEDIA_TYPES.image.includes(fileType);
  const isValidVideo = ALLOWED_MEDIA_TYPES.video.includes(fileType);

  if (!isValidImage && !isValidVideo) {
    return Response.json(
      { error: "Tipo de arquivo não permitido." },
      { status: 400 }
    );
  }

  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const expiresIn = isValidVideo ? 3600 * 2 : 3600;

  const key = `properties/${code}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
    Metadata: {
      mediaType: isValidVideo ? 'video' : 'image'
    }
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn,
    });

    return Response.json({
      url: signedUrl,
      key: key,
      mediaType: isValidVideo ? 'video' : 'image'
    });
  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error);
    return Response.json(
      { error: "Erro ao gerar URL assinada." },
      { status: 500 }
    );
  }
}