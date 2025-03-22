'use client'
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";

export function Header() {
  return (
    <nav className="flex justify-between items-center py-4 px-2 xl:px-20 bg-leadGray fixed top-0 left-0 right-0 z-50">
      <Link href={'/'}>
        <p className="text-whiteIce font-bombalurina text-7xl font-medium">Daniel Filgueira</p>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CiMenuFries size={32} className="lg:hidden cursor-pointer text-whiteIce" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={'#sobre-imobiliaria'}>
              <Button variant={'link'} className="text-lg ">Sobre a imobiliária</Button>
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
      <div className="items-center gap-1 hidden lg:flex text-whiteIce ">
        <Link href={'/#sobre-imobiliaria'}>
          <Button variant={'link'} className="text-base px-1 text-whiteIce">Sobre a imobiliária</Button>
        </Link>
        <Link href={'/#sobre-daniel-filgueira'}>
          <Button variant={'link'} className="text-base px-1 text-whiteIce">Sobre Daniel Filgueira</Button>
        </Link>
        <Button variant={'link'} className="text-base px-1 text-whiteIce" onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou corretor e gostaria de mais informações.`, '_blank')}>Sou corretor</Button>
        <Button variant="link" className='text-base px-1 text-whiteIce' onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site e gostaria de cadastrar meu imóvel.`, '_blank')}>
          Quero cadastrar meu imóvel
        </Button>
      </div>
    </nav>
  );
}
