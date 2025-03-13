import { ButtonHTMLAttributes } from 'react';
import Image from 'next/image';

import wppIcon from '../app/assets/wpp.svg'

interface FloatingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}

export function FloatingButton({ ...props }: FloatingButtonProps) {
  return (
    <button
      {...props}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:bg-black/90 hover:scale-105"
    >
      <Image src={wppIcon} alt="Icone do botão para o whatsapp" fill className='object-contain' />
    </button>
  );
}