import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { useState, useEffect } from "react";
import { ConfirmAction } from "./confirm-action";

const ICONS_SIZE = 16

type MediaItem = {
  id?: string;
  url: string;
  type: 'image' | 'video';
}

interface CarouselMediaProps {
  mediaItems: (MediaItem | string)[]
  showVideoControls?: boolean
  handleRemoveSelectedMedia?: (index: number, id?: string) => void
  autoplay?: boolean
  interval?: number
  onNavigate?: () => void
}

export function CarouselMedia({ mediaItems, handleRemoveSelectedMedia, showVideoControls = true, autoplay = false, interval = 1000, onNavigate }: CarouselMediaProps) {
  const [api, setApi] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap())
    })
  }, [api])

  const getMediaType = (item: MediaItem | string): 'image' | 'video' => {
    if (typeof item === 'string') {
      return item.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image'
    }
    return item.type
  }

  const getMediaUrl = (item: MediaItem | string): string => {
    return typeof item === 'string' ? item : item.url
  }

  return (
    <Carousel
      setApi={setApi}
      autoplay={autoplay}
      autoplayInterval={interval}
      className="w-full"
    >
      <CarouselContent onClick={onNavigate}>
        {mediaItems.map((media, index) => (
          <CarouselItem key={typeof media === 'string' ? `${media}-${index}` : `${media.url}-${index}`}>
            <div className="relative h-[280px] rounded-lg bg-white flex items-center justify-center">
              <div className="relative bg-gray-100 w-full h-[280px]">
                {getMediaType(media) === 'video' ? (
                  <>
                    <video
                      src={getMediaUrl(media)}
                      className="w-full h-full object-contain"
                      controls={showVideoControls}
                      controlsList="nodownload"
                    >
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex flex-col text-whiteIce/70 text-6xl">
                        <span className="font-bombalurina">Daniel Filgueira</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Image
                      src={getMediaUrl(media)}
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
                  </>
                )}
              </div>
              {handleRemoveSelectedMedia && (
                <div className="absolute bottom-0 sm:bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <ConfirmAction
                    title="Apagar imagem"
                    description={
                      <span className="flex flex-col gap-6">
                        <span>
                          <span className="text-sm text-muted-foreground">Não será possível recuperar a imagem apagada.</span>
                          <span className="text-sm text-muted-foreground">Tem certeza que deseja apagar?</span>
                        </span>

                        <span className="text-xs italic text-muted-foreground">Está ação não tem relação com a confirmação do formulário. Caso não tenha editado nenhuma informação, não há necessidade em salvar.</span>
                      </span>
                    }
                    onConfirm={() => {
                      if (typeof media === 'string') {
                        handleRemoveSelectedMedia(index)
                      } else {
                        handleRemoveSelectedMedia(index, media.id)
                      }
                    }}
                    onCancel={() => { }}
                  />
                </div>
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
          {mediaItems.length <= 5 ? (
            mediaItems.map((_, index) => (
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

              {mediaItems.map((_, index) => {
                if (
                  index !== 0 &&
                  index !== mediaItems.length - 1 &&
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

              {currentSlide < mediaItems.length - 2 && (
                <span className="text-gray-500 text-xs px-1">...</span>
              )}

              <button
                type="button"
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === mediaItems.length - 1
                  ? 'bg-gray-500'
                  : 'bg-gray-300'
                  }`}
                onClick={() => api?.scrollTo(mediaItems.length - 1)}
              />
            </>
          )}
        </div>

        <div className="mt-1 text-center text-xs text-gray-500">
          {currentSlide + 1}/{mediaItems.length}
        </div>
      </div>
    </Carousel>
  )
}
