"use client"

import { useState, useEffect, forwardRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Mail, Instagram, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

const brokerPhotos = [
  {
    id: 1,
    src: "/assets/daniel-1.jfif?height=800&width=600",
    alt: "Daniel Filgueira Imobiliária",
  },
  {
    id: 2,
    src: "/assets/daniel-2.jfif?height=800&width=600",
    alt: "Daniel Filgueira Imobiliária",
  },
  {
    id: 3,
    src: "/assets/daniel-3.jfif?height=800&width=600",
    alt: "Daniel Filgueira Imobiliária",
  },
]

export const AboutAgent = forwardRef<HTMLDivElement>((_, ref) => {
  {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const [isAutoplay, setIsAutoplay] = useState(true)
    const isMobile = useMobile()

    useEffect(() => {
      if (!isAutoplay) return

      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % brokerPhotos.length)
      }, 3000)

      return () => clearInterval(interval)
    }, [isAutoplay])

    const handleMouseEnter = () => setIsAutoplay(false)
    const handleMouseLeave = () => setIsAutoplay(true)

    const nextPhoto = () => {
      setCurrentPhotoIndex((prev) => (prev + 1) % brokerPhotos.length)
      setIsAutoplay(false)
    }

    const prevPhoto = () => {
      setCurrentPhotoIndex((prev) => (prev - 1 + brokerPhotos.length) % brokerPhotos.length)
      setIsAutoplay(false)
    }

    const prevIndex = (currentPhotoIndex - 1 + brokerPhotos.length) % brokerPhotos.length
    const nextIndex = (currentPhotoIndex + 1) % brokerPhotos.length

    return (
      <section className="py-16 bg-muted/50" ref={ref} id="about-agent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="md:w-1/3">
              <div
                className="relative h-[500px] w-full md:w-[350px] mx-auto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {!isMobile && (
                  <div className="absolute left-[-70px] top-1/2 -translate-y-1/2 z-0 hidden md:block">
                    <div className="relative h-[350px] w-[180px] rounded-xl overflow-hidden opacity-50 blur-[1px]">
                      <Image
                        src={brokerPhotos[prevIndex].src || "/placeholder.svg"}
                        alt={brokerPhotos[prevIndex].alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhotoIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="relative h-full w-full rounded-xl overflow-hidden shadow-xl z-10"
                  >
                    <Image
                      src={brokerPhotos[currentPhotoIndex].src || "/placeholder.svg"}
                      alt={brokerPhotos[currentPhotoIndex].alt}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </motion.div>
                </AnimatePresence>

                {!isMobile && (
                  <div className="absolute right-[-70px] top-1/2 -translate-y-1/2 z-0 hidden md:block">
                    <div className="relative h-[350px] w-[180px] rounded-xl overflow-hidden opacity-50 blur-[1px]">
                      <Image
                        src={brokerPhotos[nextIndex].src || "/placeholder.svg"}
                        alt={brokerPhotos[nextIndex].alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevPhoto}
                    className="rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextPhoto}
                    className="rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                  {brokerPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentPhotoIndex(index)
                        setIsAutoplay(false)
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${currentPhotoIndex === index ? "bg-white w-4" : "bg-white/50"
                        }`}
                      aria-label={`Ver foto ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="md:w-2/3">

              <motion.div
                initial={{ opacity: 0, x: 70, }}
                whileInView={{ opacity: 1, x: 0 }}
                // animate={{ opacity: 1, scale: 1 }}
                // exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 1 }}
                viewport={{ once: false }}
              >


                <h2 className="text-3xl font-bold mb-6 text-lightGold">Sobre Daniel Filgueira</h2>
                <p className="text-lg text-carbonBlack mb-6">
                  Com apenas 23 anos, Daniel Filgueira já é um nome reconhecido no mercado imobiliário de Natal, RN,
                  destacando-se por sua visão arrojada e sua capacidade de conectar tradição e inovação. Como corretor
                  de imóveis e CEO da Meu IA, uma desenvolvedora de softwares especializada em soluções para o mercado imobiliário,
                  Daniel tem uma abordagem única e moderna para transformar a experiência de seus clientes.
                </p>
                <p className="text-lg text-carbonBlack mb-8">
                  Sua trajetória é marcada pela busca incessante por tecnologia de ponta e inteligência artificial, criando ferramentas
                  que não apenas otimizaram processos, mas também redefiniram a forma de interagir com o mercado imobiliário.
                  Como líder à frente da Daniel Filgueira Imobiliária, Daniel oferece mais do que transações comerciais – ele proporciona
                  experiências personalizadas e diferenciadas, sempre com um alto nível de requinte e sofisticação.
                </p>
                <p className="text-lg text-carbonBlack mb-8">
                  Cada detalhe de sua imobiliária é pensado para oferecer aos clientes a melhor solução possível, com um atendimento impecável
                  e que antecipa as necessidades do mercado. A combinação da modernidade tecnológica com o compromisso com a qualidade e o
                  atendimento personalizado coloca Daniel Filgueira como um verdadeiro pioneiro no cenário imobiliário de Natal.
                </p>
                <p className="text-lg text-carbonBlack mb-8">
                  Para quem busca mais do que apenas um imóvel, mas uma experiência única e bem-sucedida, a Daniel Filgueira Imobiliária é
                  sinônimo de confiança, inovação e excelência.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou cliente e gostaria de mais informações.`, '_blank')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    (84) 99670-3029
                  </Button>
                  <a href="mailto:danielfilgueiracorretor@gmail.com">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      danielfilgueiracorretor@gmail.com
                    </Button>
                  </a>
                  <a href="https://www.instagram.com/danielfilgueiraa/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      @danielfilgueiraa
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </section>
    )
  }
})

AboutAgent.displayName = "AboutAgent"
