import { House, BedDouble, ShowerHead, Bath, Car } from "lucide-react";

import { Card, CardContent } from "./ui/card";

import Image from "next/image";
import { Property } from "@/types/Property";
import { CarouselImages } from "./carousel-images";
import Link from "next/link";

import wppSvg from "@/app/assets/wpp.svg";
import { cn, formatPrice } from "@/lib/utils";

const ICONS_SIZE = 14;

export function PropertyCard({ property, isAdmin = false }: { property: Property, isAdmin?: boolean }) {
  return (

    <Card className={cn("max-w-[24rem] md:max-w-[20rem] lg:max-w-[20rem] w-full flex flex-col cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300", {
      "opacity-50": !property.active
    })}>
      <CarouselImages imageUrls={property.image} />

      <CardContent className="w-full relative py-4">
        {!isAdmin && (
          <Image
            onClick={() => window.open(`https://wa.me/5584998128418?text=Olá! Estou interessado no imóvel "${property.title}". Código: ${property.code}.`, '_blank')}
            src={wppSvg}
            alt="Whatsapp"
            width={40}
            height={40}
            className='absolute rounded-full -top-5 right-1 hover:scale-105 hover:shadow-lg transition-all duration-300'
          />
        )}
        <Link href={`${isAdmin ? `/dashboard/my-properties/${property.code}` : `/property/${property.code}`}`}>
          <div className="space-y-2 text-gray-600">
            <span className="text-lg font-bold line-clamp-1 max-w-[20rem]">{property.title}</span>

            <div className=' text-sm'>
              {property.purpose === 'sale' && <h3><b>Venda: </b> {formatPrice(property.salePrice || 0)}</h3>}
              {property.purpose === 'rent' && <h3><b>Aluguel: </b> {formatPrice(property.rentalPrice || 0)}</h3>}
              {property.purpose === 'daily' && <h3><b>Diária: </b> {formatPrice(property.dailyPrice || 0)}</h3>}
              {property.purpose === 'sale-rent' && (
                <div className="flex justify-between">
                  <h3><b>Venda: </b>{formatPrice(property.salePrice || 0)}</h3>
                  <h3><b>Aluguel: </b>{formatPrice(property.rentalPrice || 0)}</h3>
                </div>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <span className='text-xs'><b>Bairro:</b> {property.neighborhood}</span>
              <span className='text-xs'><b>Código:</b> {property.code}</span>
            </div>

            <p className='text-sm line-clamp-1 max-w-[20rem]'>{property.description}</p>

            <div className='flex flex-wrap gap-1 w-full '>
              <span className='flex items-center gap-1 text-gray-600 text-xs'><House size={ICONS_SIZE} className='text-black' />{property.totalArea} m²</span>
              <span className='flex items-center gap-1 text-gray-600 text-xs'><BedDouble size={ICONS_SIZE} className='text-black' />{property.numberOfBedrooms} {property.numberOfBedrooms === 1 ? 'quarto' : 'quartos'}</span>
              <span className='flex items-center gap-1 text-gray-600 text-xs'><ShowerHead size={ICONS_SIZE} className='text-black' /> {property.numberOfBathrooms} {property.numberOfBathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
              <span className='flex items-center gap-1 text-gray-600 text-xs'><Bath size={ICONS_SIZE} className='text-black' /> {property.numberOfSuites} {property.numberOfSuites === 1 ? 'suíte' : 'suítes'}</span>
              <span className='flex items-center gap-1 text-gray-600 text-xs'><Car size={ICONS_SIZE} className='text-black' /> {property.numberOfParkingSpots} {property.numberOfParkingSpots === 1 ? 'vaga' : 'vagas'}</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}