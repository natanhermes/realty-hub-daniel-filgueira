'use client'
import Link from "next/link";
import { Button } from "./ui/button";
import logo from "@/app/assets/logo-white.png";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
export function Footer() {
  return (
    <footer className="mt-12 p-10 bg-[#000066] flex justify-between items-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <Image src={logo} alt="Logotipo" className="w-[12rem]" />
          <p className="text-white font-bombalurina font-medium text-4xl leading-[0.5]">Imobiliaria</p>
        </div>
        <p className="text-white text-center text-xs">
          © 2025 Daniel Filgueira. Todos os direitos reservados.
        </p>
      </div>

      <div className="hidden md:flex md:flex-col md:items-start gap-6">
        <h3 className="text-white text-xs md:text-lg">Siga nossas redes sociais</h3>
        <div className="flex gap-2">
          <Link href="https://www.instagram.com/daniel.filgueira__/" target="_blank">
            <FaInstagram size={32} className="text-white" />
          </Link>
        </div>
      </div>

      <div className='hidden lg:flex lg:flex-col text-white lg:items-start'>
        <Link href="#sobre-daniel-filgueira">
          <Button variant="link" className='text-white'>
            Sobre Daniel Filgueira
          </Button>
        </Link>
        <Button variant="link" className='text-white' onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou corretor e gostaria de mais informações.`, '_blank')}>
          Sou corretor
        </Button>
        <Button variant="link" className='text-white' onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site e gostaria de cadastrar meu imóvel.`, '_blank')}>
          Quero cadastrar meu imóvel
        </Button>
      </div>
    </footer>
  );
}
