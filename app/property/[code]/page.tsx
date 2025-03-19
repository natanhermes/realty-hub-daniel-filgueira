'use client'
import { useParams, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, MenuIcon } from "lucide-react";

import logo from "../../assets/logo-black.png"
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Property } from "@/types/Property";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FloatingButton } from "@/components/floating-button";

import { image } from "@prisma/client";

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
    <div className="relative z-20  h-full">
      <FloatingButton onClick={() => window.open(`https://wa.me/5584998128418?text=Olá! Estou interessado no imóvel "${property?.title}". Código: ${property?.code}.`, '_blank')} />
      <div className="container mx-auto h-full px-4 ">
        <nav className="flex justify-between items-center lg:pl-12 py-4">
          <Image src={logo} alt="Logotipo" className='w-[14rem] ' />

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MenuIcon size={24} className="cursor-pointer text-black" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4">
                <DropdownMenuLabel>Serviços</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Anúncie seu imóvel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        <section className="w-full">
          <Button onClick={goBack} variant="ghost" className="mb-4 text-gray-500 font-bold">
            <ArrowLeft size={16} />
            Voltar
          </Button>

          <Carousel className="w-full">
            <CarouselContent>
              {property?.image.map((image: image) => (
                <CarouselItem key={image.id}>
                  <div className="relative rounded-lg bg-gray-100 flex items-center justify-center">
                    <div className="w-full h-[20rem] md:h-[30rem]">
                      <Image
                        src={image.url}
                        alt="Imagem da propriedade"
                        fill
                        className="object-contain"
                      />
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
                  <div className="flex justify-between">
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
              <span className="font-bold text-lg">Infraestrutura</span>

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
    </div>
  )
}
