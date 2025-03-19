'use client'
import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import logo from '@/app/assets/logo-black.png';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";

export default function Header() {
  return (
    <nav className="flex justify-between items-center py-4 mx-2 md:mx-10">
      <div className="flex flex-col items-center">
        <Image src={logo} alt="Logotipo" className="w-[12rem]" />
        <p className="text-black font-bombalurina font-medium text-4xl leading-[0.5]">Imobiliaria</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CiMenuFries size={32} className="lg:hidden cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={'#sobre-imobiliaria'}>
              <Button variant={'link'} className="text-lg">Sobre a imobiliária</Button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={'#sobre-daniel-filgueira'}>
              <Button variant={'link'} className="text-lg">Sobre Daniel Filgueira</Button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant={'link'}
              className="text-lg"
              onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou corretor e gostaria de mais informações.`, '_blank')}>
              Sou corretor
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant={'link'}
              className="text-lg"
              onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site e gostaria de cadastrar meu imóvel.`, '_blank')}>
              Quero cadastrar meu imóvel
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="items-center gap-1 hidden lg:flex text-black ">
        <Link href={'#sobre-imobiliaria'}>
          <Button variant={'link'} className="text-lg">Sobre a imobiliária</Button>
        </Link>
        <Link href={'#sobre-daniel-filgueira'}>
          <Button variant={'link'} className="text-lg">Sobre Daniel Filgueira</Button>
        </Link>
        <Button variant={'link'} className="text-lg" onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou corretor e gostaria de mais informações.`, '_blank')}>Sou corretor</Button>
        <Button variant="link" className='text-lg' onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site e gostaria de cadastrar meu imóvel.`, '_blank')}>
          Quero cadastrar meu imóvel
        </Button>
      </div>
    </nav>
  );
}
