'use client'
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";

import googleSecurity from "@/app/assets/google-security.png";
import logoSSL from "@/app/assets/logo-ssl.png";

export function Footer() {
  return (
    <footer className="p-10 bg-darkBlue flex flex-col gap-6 md:flex-row justify-between items-center">
      <div className="flex flex-col items-center gap-6">
        <p className="text-whiteIce font-bombalurina text-7xl font-medium">Daniel Filgueira</p>
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
        <Link href="/privacy-policy">
          <Button variant="link" className='text-white'>
            Política de privacidade
          </Button>
        </Link>
        <Link href="/para-corretor">
          <Button variant="link" className='text-white'>
            Para corretor
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Link href="https://transparencyreport.google.com/safe-browsing/search?url=danielfilgueira.com.br&hl=pt_BR" target="_blank">
          <Image src={googleSecurity} alt="Logotipo" className="w-[6rem]" />
        </Link>
        <Link href="https://www.sslshopper.com/ssl-checker.html#hostname=danielfilgueira.com.br" target="_blank">
          <Image src={logoSSL} alt="Logotipo" className="w-[6rem]" />
        </Link>
      </div>
    </footer>
  );
}
