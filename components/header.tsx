'use client'
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const onNavigate = (sectionId: string) => {
    if (sectionId) {
      router.push(`/#${sectionId}`)
    }
    setIsOpen(false)
  };

  return (
    <nav className="flex justify-between items-center py-4 px-2 xl:px-20 bg-darkBlue fixed top-0 left-0 right-0 z-50">
      <Link href={'/'}>
        <p className="text-whiteIce font-bombalurina text-7xl font-medium">Daniel Filgueira</p>
      </Link>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger>
          <CiMenuFries size={32} className="lg:hidden cursor-pointer text-whiteIce" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onNavigate('sobre-imobiliaria')}>
            <Button variant={'link'} className="text-lg">Sobre a imobiliária</Button>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate('sobre-daniel-filgueira')}>
            <Button variant={'link'} className="text-lg">Sobre Daniel Filgueira</Button>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou corretor e gostaria de mais informações.`)}>
            <Button
              variant={'link'}
              className="text-lg"
            >
              Sou corretor
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site e gostaria de cadastrar meu imóvel.`)}>
            <Button
              variant={'link'}
              className="text-lg"
            >
              Quero cadastrar meu imóvel
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate('privacy-policy')}>
            <Button variant={'link'} className="text-lg">Política de privacidade</Button>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate('para-corretor')}>
            <Button variant={'link'} className="text-lg">Para corretor</Button>
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
        <Button variant={'link'} className="text-base px-1 text-whiteIce" onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site. Sou corretor e gostaria de mais informações.`)}>Sou corretor</Button>
        <Button variant="link" className='text-base px-1 text-whiteIce' onClick={() => window.open(`https://wa.me/558496703029?text=Olá! Estou vindo do site e gostaria de cadastrar meu imóvel.`)}>
          Quero cadastrar meu imóvel
        </Button>
        <Link href={'/para-corretor'}>
          <Button variant={'link'} className="text-base px-1 text-whiteIce">Para corretor</Button>
        </Link>
      </div>
    </nav>
  );
}
