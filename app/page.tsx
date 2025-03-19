'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/types/Property';
import { PropertyCard } from '@/components/property-card';
import { PropertyCardSkeleton } from '@/components/propery-card-skeleton';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/apartament-por-do-sol.jpg`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/apartamento-sala-escada.jpg  `,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/apartamento-sala.jpg`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => fetch(`/api/properties`).then(res => res.json()),
  })

  // const s3Client = new S3Client({
  //   region: process.env.AWS_REGION as string,
  //   credentials: {
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  //   },
  // })

  // let imageList: string[] = []

  // try {
  //   const objectListParams = new ListObjectsV2Command({
  //     Bucket: process.env.AWS_BUCKET_NAME as string,
  //     Prefix: 'static-images',
  //   })

  //   const objectList = await s3Client.send(objectListParams)

  //   imageList = objectList.Contents?.filter(content => !content.Key?.endsWith('/'))
  //     .map((content) => `${process.env.AWS_CLOUDFRONT_URL}/${content.Key}`) || []

  // } catch (error) {
  //   console.error('Erro ao buscar imagens do S3:', error)
  //   imageList = [
  //     `${process.env.AWS_CLOUDFRONT_URL}/static-images/apartamento-sala.jpg`
  //   ]
  // }

  return (
    <main className="min-h-screen ">
      <div className="relative h-[80vh]">
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Background ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-1000 ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              priority={index === 0}
            />
          ))}
        </div>

        <div className="relative z-20">
          <div className="container mx-auto px-4 md:px-16">

            <div className="flex flex-col items-start justify-center h-[60vh]">
              <div className="font-bold mb-8 max-w-3xl text-gray-300">
                <div className="flex flex-col text-left text-xl sm:text-4xl lg:text-5xl">
                  <p>Seu novo lar está</p>
                  <p>a um clique de distância.</p>
                </div>
                <p className='text-left font-semibold text-xs sm:text-sm md:text-xl lg:text-2xl mt-4 '>Temos o imóvel perfeito para você, sem complicação!</p>
              </div>
              <Link className="" href={`/search`}>
                <div className="max-w-3xl flex gap-2 bg-[#000066] text-gray-300 items-center p-4 rounded-full hover:scale-125 hover:shadow-lg transition-all duration-300">
                  <p className='font-bold text-sm'>PESQUISAR IMÓVEIS</p>
                  <Search className="h-4 w-4 font-bold" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className='container py-10 px-4 md:px-2 w-full lg:mx-auto'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-xl sm:text-2xl text-[#000066] font-bold'>Imóveis em destaque</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:justify-items-center'>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
              ))
            ) : (
              properties?.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* <section className='container mx-auto py-10 px-2 md:px-0 w-3/4'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl text-[#000066] font-bold'>Imóveis por localidade</h2>

          <div className="h-[600px] w-full flex gap-6">
            <div className='cursor-pointer rounded-lg h-full w-2/4 flex items-center justify-center relative hover:scale-105 hover:shadow-lg transition-all duration-300'>
              <Image
                src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/lagoa-nova.jpg`}
                alt='Imagem do bairro Lagoa Nova'
                fill
                className='object-cover rounded-lg'
              />
              <div className='rounded-lg h-full w-full bg-black/40 flex items-center justify-center z-10'>
                <h3 className='text-2xl text-white font-bold z-20'>Lagoa Nova</h3>
              </div>
            </div>

            <div className='flex flex-col gap-4 w-3/4'>
              <div className='cursor-pointer rounded-lg w-full h-full flex items-center justify-center relative hover:scale-105 hover:shadow-lg transition-all duration-300'>
                <Image
                  src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/zona-norte.jpg`}
                  alt='Imagem do bairro Zona Norte'
                  fill
                  className='object-cover rounded-lg'
                />
                <div className='rounded-lg h-full w-full bg-black/40 flex items-center justify-center z-10'>
                  <h3 className='text-2xl text-white font-bold '>Zona Norte</h3>
                </div>
              </div>
              <div className='flex gap-4 w-full h-full'>
                <div className='cursor-pointer rounded-lg w-full h-full flex items-center justify-center relative hover:scale-105 hover:shadow-lg transition-all duration-300'>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/ponta-negra.jpg`}
                    alt='Imagem do bairro Ponta Negra'
                    fill
                    className='object-cover rounded-lg'
                  />
                  <div className='rounded-lg h-full w-full bg-black/40 flex items-center justify-center z-10'>
                    <h3 className='text-2xl text-white font-bold z-20'>Ponta Negra</h3>
                  </div>
                </div>
                <div className='cursor-pointer rounded-lg w-full h-full flex items-center justify-center relative hover:scale-105 hover:shadow-lg transition-all duration-300'>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/nova-parnamirim.jpg`}
                    alt='Imagem do bairro Nova Parnamirim'
                    fill
                    className='object-cover rounded-lg'
                  />
                  <div className='rounded-lg h-full w-full bg-black/40 flex items-center justify-center z-10'>
                    <h3 className='text-2xl text-white font-bold z-20'>Nova Parnamirim</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className='container mx-auto py-10 px-2 md:px-0 w-3/4'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl text-[#000066] font-bold'>Sobre a imobiliária</h2>

          <div className='text-xl text-gray-600 w-2/4 flex flex-col gap-6'>
            <p>
              Com mais de XX anos de experiência no mercado imobiliário, Daniel Filgueira é um corretor de imóveis que se destaca pelo profissionalismo e dedicação aos seus clientes. Especializado em imóveis residenciais e comerciais na região de Natal, Daniel construiu sua reputação através de um atendimento personalizado e resultados consistentes.
            </p>

            <p>
              Sua abordagem única combina um profundo conhecimento do mercado local com uma verdadeira paixão por ajudar pessoas a encontrarem o imóvel ideal. Daniel entende que a compra ou venda de um imóvel é uma das decisões mais importantes na vida de seus clientes, e por isso oferece suporte completo em todas as etapas da negociação.
            </p>

            <p>
              Com uma carteira diversificada de imóveis e uma rede sólida de contatos no setor, Daniel Filgueira está preparado para atender às mais variadas demandas, sempre priorizando a transparência e a excelência no atendimento.
            </p>
          </div>
        </div>
      </section> */}

      <section id='sobre-daniel-filgueira' className='container px-4 md:px-2 w-full lg:mx-auto'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl text-[#000066] font-bold w-full text-center lg:text-left'>Nosso corretor</h2>
          {/* <div className='w-full h-[1px] bg-[#000066]'></div> */}

          <div className='flex flex-col lg:flex-row lg:gap-10 justify-between'>
            <div className='flex flex-col gap-2'>
              <div className='h-[700px] md:w-[500px] relative md:self-center flex flex-col'>
                <Image
                  src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/daniel-principal.jpg`}
                  alt='Imagem do corretor'
                  fill
                  className='object-cover rounded-lg'
                />
              </div>
              <span className='text-xs font-bold text-gray-600 w-full text-center'>Daniel Filgueira - CRECI: 8421-F</span>
            </div>

            <div className='text-lg lg:text-2xl 2xl:text-xl text-gray-600 w-full md:w-[80%] mx-auto flex flex-col gap-6 mt-4'>
              <p>
                Com mais de XX anos de experiência no mercado imobiliário, Daniel Filgueira é um corretor de imóveis que se destaca pelo profissionalismo e dedicação aos seus clientes. Especializado em imóveis residenciais e comerciais na região de Natal, Daniel construiu sua reputação através de um atendimento personalizado e resultados consistentes.
              </p>

              <p>
                Sua abordagem única combina um profundo conhecimento do mercado local com uma verdadeira paixão por ajudar pessoas a encontrarem o imóvel ideal. Daniel entende que a compra ou venda de um imóvel é uma das decisões mais importantes na vida de seus clientes, e por isso oferece suporte completo em todas as etapas da negociação.
              </p>

              <p>
                Com uma carteira diversificada de imóveis e uma rede sólida de contatos no setor, Daniel Filgueira está preparado para atender às mais variadas demandas, sempre priorizando a transparência e a excelência no atendimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="container mx-auto py-16 px-2 md:px-0">
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
      </section> */}
    </main>
  );
}
