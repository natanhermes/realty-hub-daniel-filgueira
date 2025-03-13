import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { image } from "@prisma/client";

const ICONS_SIZE = 16

interface CarouselImagesProps {
  imageUrls: image[] | string[]
  handleRemoveSelectedImage?: (index: number) => void
  autoplay?: boolean
  interval?: number
}

export function CarouselImages({ imageUrls, handleRemoveSelectedImage, autoplay = false, interval = 1000 }: CarouselImagesProps) {
  return (
    <Carousel autoplay={autoplay} autoplayInterval={interval} className="w-full">
      <CarouselContent>
        {imageUrls.map((image, index) => (
          <CarouselItem key={typeof image === 'string' ? index : image.id}>
            <div className="relative  h-[280px] rounded-lg bg-white flex items-center justify-center">
              <div className="relative bg-gray-100 w-full h-[280px]">
                <Image
                  src={typeof image === 'string' ? image : image.url}
                  alt="Imagem da propriedade"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {handleRemoveSelectedImage && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  onClick={() => handleRemoveSelectedImage(index)}
                >
                  <Trash size={ICONS_SIZE} />
                </Button>
              )
              }
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {!autoplay && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  )
}
