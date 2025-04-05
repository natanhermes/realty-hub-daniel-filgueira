import { S3Client, DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function DELETE(request: Request) {
  const { prefix } = await request.json();

  if (!prefix) {
    return Response.json(
      { error: "Prefixo não fornecido." },
      { status: 400 }
    );
  }

  console.log('Iniciando processo de deleção para o prefixo:', prefix);

  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  try {
    // Lista os objetos primeiro
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: prefix
    });

    console.log('Buscando objetos no bucket:', process.env.AWS_BUCKET_NAME);
    const listedObjects = await s3Client.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log('Nenhum objeto encontrado com o prefixo:', prefix);
      return Response.json({
        message: "Nenhum arquivo encontrado para deletar",
        prefix
      });
    }

    console.log('Objetos encontrados:', listedObjects.Contents.map(obj => obj.Key));

    // Prepara o array de objetos para deleção
    const objectsToDelete = listedObjects.Contents.map(({ Key }) => ({ Key: Key! }));

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Delete: {
        Objects: objectsToDelete,
        Quiet: false
      }
    };

    console.log('Tentando deletar os seguintes objetos:', objectsToDelete);

    // Executa a deleção
    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    const deleteResult = await s3Client.send(deleteCommand);

    console.log('Resultado da deleção:', deleteResult);

    // Verifica se houve erros na deleção
    if (deleteResult.Errors && deleteResult.Errors.length > 0) {
      console.error('Erros durante a deleção:', deleteResult.Errors);
      return Response.json({
        error: "Alguns arquivos não puderam ser deletados",
        errors: deleteResult.Errors
      }, { status: 500 });
    }

    // Verifica se os objetos foram realmente deletados
    const verificationCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: prefix
    });

    const verificationResult = await s3Client.send(verificationCommand);

    if (verificationResult.Contents && verificationResult.Contents.length > 0) {
      console.warn('Objetos ainda presentes após tentativa de deleção:',
        verificationResult.Contents.map(obj => obj.Key));
    }

    return Response.json({
      message: `${deleteResult.Deleted?.length || 0} arquivos deletados com sucesso`,
      deletedObjects: deleteResult.Deleted,
      prefix
    });

  } catch (error) {
    console.error('Erro detalhado ao deletar arquivos:', error);
    return Response.json(
      {
        error: "Erro ao deletar arquivos.",
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
