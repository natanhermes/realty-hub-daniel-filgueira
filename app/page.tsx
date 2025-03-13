import Image from 'next/image';
import logo from './assets/logo-gray.png';
import backgroundImage from './assets/background.jpg';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default async function Home() {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  })

  let imageList: string[] = []

  try {
    const objectListParams = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Prefix: 'static-images',
    })

    const objectList = await s3Client.send(objectListParams)

    imageList = objectList.Contents?.filter(content => !content.Key?.endsWith('/'))
      .map((content) => `${process.env.AWS_CLOUDFRONT_URL}/${content.Key}`) || []

  } catch (error) {
    console.error('Erro ao buscar imagens do S3:', error)
    imageList = [
      `${process.env.AWS_CLOUDFRONT_URL}/static-images/apartamento-sala.jpg`
    ]
  }

  return (
    <main className="min-h-screen ">
      <div className="relative h-[80vh]">
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-20">
          <div className="container mx-auto px-4 md:px-16">
            <nav className="flex justify-between items-center lg:pl-12 py-4">
              <Image src={logo} alt="Logotipo" className='w-[14rem] ' />
            </nav>

            <div className="flex flex-col items-start justify-center h-[60vh] text-white">
              <h1 className="text-2xl md:text-5xl font-bold mb-8 max-w-3xl text-gray-300">
                <div className="flex flex-col text-left">
                  <p>Seu novo lar está</p>
                  <p>a um clique de distância.</p>
                </div>
                <p className='text-left font-semibold text-sm md:text-xl mt-4 '>Temos o imóvel perfeito para você, sem complicação!</p>
              </h1>
              <Link className="" href={`/search`}>
                <div className="max-w-3xl flex gap-2 bg-white text-gray-500 items-center p-4 rounded-full hover:scale-125 hover:shadow-lg transition-all duration-300">
                  <p className='font-bold text-sm'>PESQUISAR IMÓVEIS</p>
                  <Search className="h-4 w-4 font-bold" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto py-16 px-2 md:px-0">
        <div className="flex flex-col gap-8 text-gray-600">
          <div className="text-center flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full h-[280px]">
              <Image
                src={imageList[0]}
                alt="Imagem da propriedade"
                fill
                className="object-cover rounded-lg max-w-[500px] mx-auto"
              />
            </div>
            <h2 className="text-xl w-full md:w-3/4 font-normal italic mb-4">Quer um apartamento, casa, sala ou terreno? Fale com a nossa equipe e agende sua visita agora mesmo! Temos as melhores opções para você encontrar o imóvel perfeito com facilidade e segurança.</h2>
          </div>

          <div className="text-center flex flex-col md:flex-row-reverse gap-6 items-center">
            <div className="relative w-full h-[280px]">
              <Image
                src={imageList[1]}
                alt="Imagem da propriedade"
                fill
                className="object-cover rounded-lg max-w-[500px] mx-auto"
              />
            </div>
            <h2 className="text-xl w-full md:w-3/4 font-normal italic mb-4">Oferecemos a melhor consultoria para ajudar você a encontrar o imóvel ideal! Desde a escolha da localização até os detalhes que fazem a diferença, estamos aqui para tornar sua busca mais fácil e assertiva.</h2>
          </div>

          <div className="text-center flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full h-[280px]">
              <Image
                src={imageList[2]}
                alt="Imagem da propriedade"
                fill
                className="object-cover rounded-lg max-w-[500px] mx-auto"
              />
            </div>
            <h2 className="text-xl w-full md:w-3/4 font-normal italic mb-4">Nossa equipe vai encontrar a melhor condição para você fechar negócio, além de oferecer consultoria especializada para facilitar seu financiamento e garantir as melhores oportunidades!</h2>
          </div>
        </div>
      </section>
    </main>
  );
}
