"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Award, Users, Clock } from "lucide-react"

import Image from 'next/image'
import { forwardRef } from "react"

const features = [
  {
    icon: <Shield className="h-10 w-10 text-gray-900" />,
    title: "Segurança",
    description: "Todas as transações são realizadas com total segurança jurídica e transparência.",
  },
  {
    icon: <Award className="h-10 w-10 text-gray-900" />,
    title: "Excelência",
    description: "Comprometimento com a qualidade e excelência em todos os serviços prestados.",
  },
  {
    icon: <Users className="h-10 w-10 text-gray-900" />,
    title: "Atendimento Personalizado",
    description: "Cada cliente recebe um atendimento exclusivo, adaptado às suas necessidades.",
  },
  {
    icon: <Clock className="h-10 w-10 text-gray-900" />,
    title: "Os melhores imóveis para você",
    description: "Estamos sempre disponíveis para atender nossos clientes quando precisarem.",
  },
]

export const AboutAgency = forwardRef<HTMLDivElement>((_, ref) => {
  {
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
        },
      },
    }

    const item = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    return (
      <section id="about-agency" ref={ref} className="py-20 bg-white">
        <div className="container px-4 mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-lightGold">Sobre a Filgueira Imobiliária</h2>
            <p className="text-carbonBlack max-w-2xl mx-auto">
              Modernidade, Tecnologia e Elegância no Mercado Imobiliário
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-darkBlue">Nossa Missão</h3>
              <p className="text-carbonBlack mb-6">
                Proporcionar experiências excepcionais na aquisição e venda de imóveis de alto padrão, superando as
                expectativas dos nossos clientes através de um atendimento personalizado e soluções imobiliárias
                inovadoras.
              </p>

              <h3 className="text-2xl font-bold mb-4 text-darkBlue">Nossa Visão</h3>
              <p className="text-carbonBlack mb-6">
                Ser reconhecida como a imobiliária de referência no segmento de luxo, destacando-se pela excelência,
                inovação e compromisso com a satisfação dos clientes.
              </p>

              <h3 className="text-2xl font-bold mb-4 text-darkBlue">Nossos Valores</h3>
              <ul className="list-disc list-inside text-carbonBlack space-y-2">
                <li>Excelência em todos os serviços prestados</li>
                <li>Ética e transparência nas negociações</li>
                <li>Compromisso com a satisfação do cliente</li>
                <li>Inovação constante</li>
                <li>Responsabilidade social e ambiental</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 70 }}
              whileInView={{ opacity: 1, x: 0 }}
              // animate={{ opacity: 1, scale: 1 }}
              // exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
              className="relative h-full w-full rounded-xl overflow-hidden shadow-xl z-10"
            >
              <Image
                src={'/assets/daniel-principal.jpg'}
                alt={'Filgueira Imobiliária - CRECI 8421-F'}
                fill
                className="object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50  to-transparent"></div>
            </motion.div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-gray-100">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    )
  }
})

AboutAgency.displayName = "AboutAgency"
