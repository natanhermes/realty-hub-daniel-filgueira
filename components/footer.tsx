'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-whiteIce">
      <div className="container mx-auto px-4 py-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-6">Daniel Filgueira Imobiliária</h3>
            <p className="text-gray-300 mb-6">
              Especialistas em imóveis de alto padrão, oferecendo as melhores oportunidades para você investir ou
              encontrar o lar dos seus sonhos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-whiteIce transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-whiteIce transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#property-highlights" className="text-gray-300 hover:text-whiteIce transition-colors">
                  Imóveis em Destaque
                </Link>
              </li>
              <li>
                <Link href="/#property-location" className="text-gray-300 hover:text-whiteIce transition-colors">
                  Localidades
                </Link>
              </li>
              <li>
                <Link href="/#about-agent" className="text-gray-300 hover:text-whiteIce transition-colors">
                  Sobre o Corretor
                </Link>
              </li>
              <li>
                <Link href="/#about-agency" className="text-gray-300 hover:text-whiteIce transition-colors">
                  Sobre a Imobiliária
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-whiteIce transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Contato</h3>
            <ul>
              {/* <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Av. Hermes de Fonseca, 1000, Bela Vista
                  <br />
                  Natal - RN, 59000-000
                </span>
              </li> */}
              <li className="flex items-center">
                <Button className="text-gray-300 hover:text-white" variant="link" onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou cliente e gostaria de mais informações.`, '_blank')}>
                  <Phone size={20} className="mr-2 flex-shrink-0" />
                  <span className="">(84) 99670-3029</span>
                </Button>
              </li>
              <li className="flex items-center">
                <a href="mailto:danielfilgueiracorretor@gmail.com">
                  <Button variant="link" className="text-gray-300 hover:text-white">
                    <Mail size={20} className="mr-2 flex-shrink-0" />
                    <span className="">danielfilgueiracorretor@gmail.com</span>
                  </Button>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Inscreva-se para receber novidades sobre imóveis exclusivos e oportunidades de investimento.
            </p>
            <div className="space-y-3">
              <Input type="email" placeholder="Seu e-mail" className="bg-gray-800 border-gray-700 text-white" />
              <Button className="w-full bg-white text-gray-900 hover:bg-gray-200">Inscrever-se</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-leadGray mt-12 my-6 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Daniel Filgueira Imobiliária. Todos os direitos reservados.</p>
        </div>
        <div className="flex items-center gap-2 border-t justify-center border-leadGray pt-6">
          <p className="text-gray-400 text-sm">Desenvolvido por</p>
          <Link href="https://www.instagram.com/meu_ia/" target="_blank"><Image src="/assets/meu-ia-logo.jpg" width={30} height={30} alt="Logotipo" className="rounded-full" /></Link>
        </div>
      </div>
    </footer>
  )
}
