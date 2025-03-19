'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/types/Property';
import { PropertyCard } from '@/components/property-card';
import { PropertyCardSkeleton } from '@/components/propery-card-skeleton';
import { FloatingButton } from '@/components/floating-button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/apartament-por-do-sol.jpg`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/apartamento-sala-escada.jpg  `,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/apartamento-sala.jpg`,
  ];

  const imageList = [
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/daniel-1.JPG`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/daniel-2.JPG`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/static-images/daniel-3.JPG`,
  ]

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

  return (
    <>
      <Header />
      <main className="min-h-screen ">
        <FloatingButton onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou cliente e gostaria de mais informações.`, '_blank')} />
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

        <section className='container py-10 px-4 md:px-2 w-full sm:mx-auto '>
          <div className='flex flex-col gap-4'>
            <h2 className='text-xl sm:text-2xl text-[#000066] font-bold'>Imóveis em destaque</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:justify-items-center'>
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

        <section id='sobre-imobiliaria' className='container py-16 px-4 md:px-2 w-full lg:mx-auto'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-xl sm:text-2xl text-[#000066] font-bold w-full text-center lg:text-left'>Daniel Filgueira Imobiliária – Modernidade, Tecnologia e Elegância no Mercado Imobiliário</h2>
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

              <div className='text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 w-full md:w-[80%] mx-auto flex flex-col gap-6 mt-4 lg:mt-0'>
                <p>
                  A Daniel Filgueira Imobiliária nasceu para transformar a experiência no mercado imobiliário. Liderada por Daniel Filgueira, o corretor mais jovem do estado do Rio Grande do Norte, nossa imobiliária traz um novo conceito para quem busca imóveis com sofisticação, inovação e atendimento personalizado.
                </p>

                <p>
                  Somos uma imobiliária jovem, moderna e tecnológica, onde cada detalhe é pensado para oferecer a melhor experiência aos nossos clientes. Utilizamos as mais avançadas ferramentas do mercado para garantir eficiência na compra, venda e locação de imóveis, proporcionando agilidade e transparência em cada transação.
                </p>

                <p>
                  Nosso diferencial está na união entre requinte e elegância, conectando clientes a imóveis exclusivos, sempre com um atendimento humanizado e estratégico. Seja para adquirir o imóvel dos sonhos ou fazer um investimento seguro, a Daniel Filgueira Imobiliária é a escolha certa para quem valoriza excelência, inovação e resultados.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id='sobre-daniel-filgueira' className="container mx-auto py-16 px-2">
          <div className="flex flex-col gap-8 text-gray-600">
            <h2 className='text-xl sm:text-2xl text-[#000066] font-bold w-full text-center lg:text-left'>Daniel Filgueira – Excelência, Tecnologia e Inovação no Mercado Imobiliário de Natal</h2>
            <div className="text-center flex flex-col md:flex-row gap-6 items-center justify-around">
              <div className="relative w-full h-[600px]">
                <Image
                  src={imageList[0]}
                  alt="Imagem da propriedade"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h2 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl w-full text-center md:text-left text-gray-600 mb-4">Com apenas 23 anos, Daniel Filgueira já é um nome reconhecido no mercado imobiliário de Natal, RN, destacando-se por sua visão arrojada e sua capacidade de conectar tradição e inovação. Como corretor de imóveis e CEO da Meu IA, uma desenvolvedora de softwares especializada em soluções para o mercado imobiliário, Daniel tem uma abordagem única e moderna para transformar a experiência de seus clientes.</h2>
            </div>

            <div className="text-center flex flex-col md:flex-row-reverse gap-6 items-center justify-around">
              <div className="relative w-full h-[600px]">
                <Image
                  src={imageList[1]}
                  alt="Imagem da propriedade"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h2 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl w-full text-center md:text-left text-gray-600 mb-4">Sua trajetória é marcada pela busca incessante por tecnologia de ponta e inteligência artificial, criando ferramentas que não apenas otimizaram processos, mas também redefiniram a forma de interagir com o mercado imobiliário. Como líder à frente da Daniel Filgueira Imobiliária, Daniel oferece mais do que transações comerciais – ele proporciona experiências personalizadas e diferenciadas, sempre com um alto nível de requinte e sofisticação.</h2>
            </div>

            <div className="text-center flex flex-col md:flex-row gap-6">
              <div className="relative w-full h-[600px]">
                <Image
                  src={imageList[2]}
                  alt="Imagem da propriedade"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl w-full flex flex-col justify-around gap-1 text-center md:text-left text-gray-600">
                <p>Cada detalhe de sua imobiliária é pensado para oferecer aos clientes a melhor solução possível, com um atendimento impecável e que antecipa as necessidades do mercado. A combinação da modernidade tecnológica com o compromisso com a qualidade e o atendimento personalizado coloca Daniel Filgueira como um verdadeiro pioneiro no cenário imobiliário de Natal.</p>
                <p>Para quem busca mais do que apenas um imóvel, mas uma experiência única e bem-sucedida, a Daniel Filgueira Imobiliária é sinônimo de confiança, inovação e excelência.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
