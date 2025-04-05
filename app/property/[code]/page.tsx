'use client'
import { useParams, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Property } from "@/types/Property";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FloatingButton } from "@/components/floating-button";

import { image } from "@prisma/client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const infrastructureLabels = {
  hasBarbecue: 'Churrasqueira',
  hasPool: 'Piscina',
  hasPartyRoom: 'Salão de Festas',
  has24hPorter: 'Porteiro 24h',
  hasGourmetArea: 'Área Gourmet',
  hasPlayground: 'Playground',
  hasGym: 'Academia',
  hasGarden: 'Jardim',
  hasCourt: 'Quadra',
  hasAirConditioning: 'Ar Condicionado',
  hasCustomFurniture: 'Móveis Planejados',
  hasBalcony: 'Varanda',
  hasOffice: 'Escritório',
  hasSolarEnergy: 'Energia Solar',
  hasElevator: 'Elevador'
}

export default function PropertyPage() {
  const { code } = useParams();
  const router = useRouter()

  const { data: property } = useQuery<Property>({
    queryKey: ['property', code],
    queryFn: () => fetch(`/api/property/${code}`).then(res => res.json()),
  })

  const goBack = () => {
    router.back()
  }

  return (
    <>
      <Header />
      <div className="relative z-20 h-full">
        <FloatingButton onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou interessado no imóvel "${property?.title}". Código: ${property?.code}.`, '_blank')} />
        <section className="w-full mx-auto max-w-screen-lg bg-white rounded-lg p-4 mt-24">
          <Button onClick={goBack} variant="ghost" className="mb-4 text-gray-500 font-bold">
            <ArrowLeft size={16} />
            Voltar
          </Button>

          <Carousel className="w-full">
            <CarouselContent>
              {property?.image.map((media: image) => (
                <CarouselItem key={media.id}>
                  <div className="relative rounded-lg bg-gray-100 flex items-center justify-center">
                    <div className="w-full h-[20rem] md:h-[30rem] relative">
                      {media.type === 'video' ? (
                        <video
                          src={media.url}
                          className="w-full h-full object-contain"
                          controls
                          controlsList="nodownload"
                        >
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      ) : (
                        <>
                          <Image
                            src={media.url}
                            alt="Imagem da propriedade"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex flex-col text-whiteIce/70 text-8xl">
                              <span className="font-bombalurina">Daniel Filgueira</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="flex flex-col gap-4 text-gray-500 text-sm">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold">{property?.title}</h1>
              <span className=""><b>Bairro: </b>{property?.neighborhood}</span>
              <span className=""><b>Código: </b>{property?.code}</span>

              <div className=''>
                {property?.purpose === 'sale' && <span><b>Venda: </b> {formatPrice(property?.salePrice || 0)}</span>}
                {property?.purpose === 'rental' && <span><b>Aluguel: </b> {formatPrice(property?.rentalPrice || 0)}</span>}
                {property?.purpose === 'daily' && <span><b>Diária: </b> {formatPrice(property?.dailyPrice || 0)}</span>}
                {property?.purpose === 'sale-rent' && (
                  <div className="flex gap-2">
                    <span><b>Venda: </b>{formatPrice(property?.salePrice || 0)}</span>
                    <span><b>Aluguel: </b>{formatPrice(property?.rentalPrice || 0)}</span>
                  </div>
                )}
              </div>

              <span className=""><b>Descrição: </b>{property?.description}</span>
            </div>

            <div className="w-full h-[1px] bg-gray-500"></div>

            <div className="flex flex-col gap-2 text-gray-500">
              <span className="font-bold text-lg">Características do imóvel</span>

              <div className="flex flex-col">
                <span className="">
                  <span className="font-bold">Área total: </span>
                  {property?.totalArea} m²
                </span>

                <span className="">
                  <span className="font-bold">Área construída: </span>
                  {property?.builtArea} m²
                </span>

                <span className="">
                  <span className="font-bold">Quartos: </span>
                  {property?.numberOfBedrooms} {property?.numberOfBedrooms === 1 ? 'quarto' : 'quartos'}
                </span>

                <span className="">
                  <span className="font-bold">Banheiros: </span>
                  {property?.numberOfBathrooms} {property?.numberOfBathrooms === 1 ? 'banheiro' : 'banheiros'}
                </span>

                <span className="">
                  <span className="font-bold">Suítes: </span>
                  {property?.numberOfSuites} {property?.numberOfSuites === 1 ? 'suíte' : 'suítes'}
                </span>

                <span className="">
                  <span className="font-bold">Vagas de estacionamento: </span>
                  {property?.numberOfParkingSpots} {property?.numberOfParkingSpots === 1 ? 'vaga' : 'vagas'}
                </span>

                <span className="">
                  <span className="font-bold">Ano de construção: </span>
                  {property?.constructionYear}
                </span>

                <span className="">
                  <span className="font-bold">Condomínio: </span>
                  {formatPrice(property?.condominiumFee || 0)}
                </span>

                <span className="">
                  <span className="font-bold">IPTU: </span>
                  {formatPrice(property?.iptuValue || 0)}
                </span>

                <span className="">
                  <span className="font-bold">Aceita financiamento: </span>
                  {property?.acceptsFinancing ? 'Sim' : 'Não'}
                </span>

                <span className="">
                  <span className="font-bold">Aceita troca: </span>
                  {property?.acceptsExchange ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {property?.infrastructure && <span className="font-bold text-lg">Infraestrutura</span>}

              <div className="flex flex-wrap gap-2">
                {property?.infrastructure && Object.entries(property.infrastructure)
                  .filter(([key, value]) => key.startsWith('has') && value === true)
                  .map(([key]) => {
                    const label = infrastructureLabels[key as keyof typeof infrastructureLabels];
                    return (
                      <Badge className="bg-gray-500 text-white" key={key}>{label}</Badge>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
