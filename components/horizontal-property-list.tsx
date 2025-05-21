"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { useMobile } from "@/hooks/use-mobile"

interface Property {
  id: number
  title: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  type?: string
}

interface HorizontalPropertyListProps {
  title: string
  properties: Property[]
  locationFilter?: string
}

export function HorizontalPropertyList({ title, properties, locationFilter }: HorizontalPropertyListProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const visibleCards = isMobile ? 1 : 3

  const maxIndex = Math.max(0, properties.length - visibleCards)

  const cardWidth = isMobile ? 280 : 320
  const cardGap = 24

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  useEffect(() => {
    const x = -(currentIndex * (cardWidth + cardGap))
    controls.start({ x, transition: { type: "spring", stiffness: 300, damping: 30 } })
  }, [currentIndex, controls, cardWidth])

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false)

    const threshold = cardWidth / 4
    if (info.offset.x < -threshold && currentIndex < maxIndex) {
      nextSlide()
    } else if (info.offset.x > threshold && currentIndex > 0) {
      prevSlide()
    } else {
      controls.start({ x: -(currentIndex * (cardWidth + cardGap)) })
    }
  }

  return (
    <div className="relative py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>

        <div className="hidden md:flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="h-10 w-10 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden" ref={containerRef}>
        <motion.div
          className="flex"
          style={{ gap: `${cardGap}px` }}
          animate={controls}
          initial={{ x: 0 }}
          drag="x"
          dragConstraints={{ left: -(maxIndex * (cardWidth + cardGap)), right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
        >
          {properties.map((property, index) => {
            const distance = Math.abs(index - currentIndex)
            const isVisible = distance <= 2

            const isInFocus = isMobile
              ? index === currentIndex
              : index >= currentIndex && index < currentIndex + visibleCards

            const isPartial = !isInFocus && isVisible

            if (!isVisible) return null

            return (
              <motion.div
                key={property.id}
                className="flex-shrink-0"
                style={{
                  width: cardWidth,
                  opacity: isInFocus ? 1 : 0.5,
                  scale: isInFocus ? 1 : 0.95,
                  zIndex: isInFocus ? 10 : 5,
                  pointerEvents: isDragging ? "none" : "auto",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: isInFocus ? 1 : 0.5,
                  scale: isInFocus ? 1 : 0.95,
                  transition: { duration: 0.3 },
                }}
              >
                <PropertyCard property={property} />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Gradientes para indicar continuidade */}
        <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>

      {/* Navegação mobile */}
      <div className="flex justify-center mt-6 md:hidden space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="h-10 w-10 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          className="h-10 w-10 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Indicadores de página */}
      <div className="flex justify-center mt-4 space-x-1">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-primary w-4" : "bg-muted-foreground/30"
              }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir para página ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
