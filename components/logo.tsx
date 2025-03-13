import logo from '@/app/assets/logo-black.png';
import Image from 'next/image';

export default function Logo() {
  return <Image src={logo} alt="Logotipo" width={140} height={100} />;
}
