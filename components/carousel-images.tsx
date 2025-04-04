import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { image } from "@prisma/client";
import { useState, useEffect } from "react";

const ICONS_SIZE = 16

interface CarouselImagesProps {
  imageUrls: image[] | string[]
  handleRemoveSelectedImage?: (index: number) => void
  autoplay?: boolean
  interval?: number
  onNavigate?: () => void
}

export function CarouselImages({ imageUrls, handleRemoveSelectedImage, autoplay = false, interval = 1000, onNavigate }: CarouselImagesProps) {
  const [api, setApi] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <Carousel
      setApi={setApi}
      autoplay={autoplay}
      autoplayInterval={interval}
      className="w-full"
    >
      <CarouselContent onClick={onNavigate}>
        {imageUrls.map((image, index) => (
          <CarouselItem key={typeof image === 'string' ? index : image.id}>
            <div className="relative  h-[280px] rounded-lg bg-white flex items-center justify-center">
              <div className="relative bg-gray-100 w-full  h-[280px]">
                <Image
                  src={typeof image === 'string' ? image : image.url}
                  alt="Imagem da propriedade"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col text-whiteIce/70 text-6xl">
                    <span className="font-bombalurina">Daniel Filgueira</span>
                  </div>
                </div>
              </div>
              {handleRemoveSelectedImage && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute bottom-0 sm:bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  onClick={() => handleRemoveSelectedImage(index)}
                >
                  <Trash size={ICONS_SIZE} />
                </Button>
              )}
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
      <div className="mt-4">
        <div className="flex items-center justify-center flex-wrap gap-2">
          {imageUrls.length <= 5 ? (
            imageUrls.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === index
                  ? 'bg-gray-500'
                  : 'bg-gray-300'
                  }`}
                onClick={() => api?.scrollTo(index)}
              />
            ))
          ) : (
            <>
              <button
                type="button"
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === 0
                  ? 'bg-gray-500'
                  : 'bg-gray-300'
                  }`}
                onClick={() => api?.scrollTo(0)}
              />

              {currentSlide > 1 && (
                <span className="text-gray-500 text-xs px-1">...</span>
              )}

              {imageUrls.map((_, index) => {
                if (
                  index !== 0 &&
                  index !== imageUrls.length - 1 &&
                  Math.abs(currentSlide - index) <= 1
                ) {
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`w-2 h-2 rounded-full transition-all ${currentSlide === index
                        ? 'bg-gray-500'
                        : 'bg-gray-300'
                        }`}
                      onClick={() => api?.scrollTo(index)}
                    />
                  );
                }
                return null;
              })}

              {currentSlide < imageUrls.length - 2 && (
                <span className="text-gray-500 text-xs px-1">...</span>
              )}

              <button
                type="button"
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === imageUrls.length - 1
                  ? 'bg-gray-500'
                  : 'bg-gray-300'
                  }`}
                onClick={() => api?.scrollTo(imageUrls.length - 1)}
              />
            </>
          )}
        </div>

        <div className="mt-1 text-center text-xs text-gray-500">
          {currentSlide + 1}/{imageUrls.length}
        </div>
      </div>
    </Carousel>
  )
}
