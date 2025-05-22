"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface MediaItem {
  type: "image" | "video"
  url: string
}

interface PropertyGalleryProps {
  media: MediaItem[]
  title: string
}

export function PropertyGallery({ media, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const isMobile = useMobile()
  const isSmallMobile = useMobile(480)
  const videoRef = useRef<HTMLVideoElement>(null)

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length)
  }

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
  }

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen)
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [currentIndex])

  const visibleThumbnails = isSmallMobile ? 3 : isMobile ? 4 : media.length

  const currentItem = media[currentIndex]
  const isVideo = currentItem?.type === "video"

  return (
    <>
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden mb-16 sm:mb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {isVideo ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src={currentItem?.url}
                  className="h-full w-full object-contain"
                  controls
                  playsInline
                />
              </div>
            ) : (
              <div className="absolute inset-0 cursor-pointer" onClick={toggleFullscreen} aria-label="Expandir imagem">
                <Image
                  src={currentItem?.url || "/placeholder.svg"}
                  alt={`${title} - Item ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div
              className={`absolute inset-0 ${isVideo ? "bg-gradient-to-b from-black/10 to-black/40" : "bg-gradient-to-b from-black/30 to-black/60"}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Controles de navegação */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50 h-9 w-9 sm:h-10 sm:w-10"
            onClick={(e) => {
              e.stopPropagation()
              prevItem()
            }}
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50 h-9 w-9 sm:h-10 sm:w-10"
            onClick={(e) => {
              e.stopPropagation()
              nextItem()
            }}
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>

        {!isVideo && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation()
              toggleFullscreen()
            }}
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        )}

        {media.length > 0 && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {media.length}
          </div>
        )}

        <div className="absolute -bottom-16 sm:-bottom-20 left-0 right-0 h-16 sm:h-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-center space-x-2 overflow-x-auto py-2 h-full scrollbar-hide">
              {media.slice(0, visibleThumbnails).map((item, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                  className={`relative h-12 sm:h-16 w-16 sm:w-24 rounded-md overflow-hidden transition-all ${currentIndex === index
                    ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                    : "opacity-70 hover:opacity-100"
                    }`}
                  aria-label={`Ver item ${index + 1}`}
                >
                  {item.type === "video" ? (
                    <>
                      <Image
                        src={item?.url}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white h-6 w-6"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={item?.url || "/placeholder.svg"}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
              {media.length > visibleThumbnails && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFullscreen()
                  }}
                  className="relative h-12 sm:h-16 min-w-16 sm:min-w-24 flex items-center justify-center bg-muted/50 rounded-md text-sm font-medium px-2"
                >
                  +{media.length - visibleThumbnails}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={toggleFullscreen}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-7xl mx-auto p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                {media[currentIndex].type === "video" ? (
                  <video
                    src={media[currentIndex]?.url}
                    className="h-full w-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <Image
                    src={media[currentIndex]?.url || "/placeholder.svg"}
                    alt={`${title} - Item ${currentIndex + 1} (tela cheia)`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                )}

                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {media.length}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70 z-10"
                  onClick={toggleFullscreen}
                >
                  <X className="h-5 w-5" />
                </Button>

                {isMobile && (
                  <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-4 z-10">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70 h-12 w-12"
                      onClick={(e) => {
                        e.stopPropagation()
                        prevItem()
                      }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70 h-12 w-12"
                      onClick={(e) => {
                        e.stopPropagation()
                        nextItem()
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                )}

                {!isMobile && (
                  <>
                    <div className="absolute inset-y-0 left-4 flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation()
                          prevItem()
                        }}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    </div>

                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation()
                          nextItem()
                        }}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  </>
                )}

                <div className="absolute bottom-4 left-0 right-0">
                  <div className="flex justify-center space-x-2 overflow-x-auto py-2 px-4 max-w-full mx-auto scrollbar-hide">
                    {media.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative w-12 h-9 sm:w-16 sm:h-12 rounded-md overflow-hidden transition-all ${currentIndex === index
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-black"
                          : "opacity-70 hover:opacity-100"
                          }`}
                      >
                        {item.type === "video" ? (
                          <>
                            <Image
                              src={item?.url}
                              alt={`Miniatura ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                            </div>
                          </>
                        ) : (
                          <Image
                            src={item?.url || "/placeholder.svg"}
                            alt={`Miniatura ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
