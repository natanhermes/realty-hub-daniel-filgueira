'use client';

import Logo from '@/components/logo';
import Link from 'next/link';

import { User } from 'lucide-react';
import Form from 'next/form';
import { logoutAction } from '../actions/logoutAction';

export default function Navbar({ userName }: { userName: string }) {

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            <Logo />
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-gray-900 flex items-end gap-2">
            <User size={24} />

            <span className="">
              Olá, {userName}
            </span>
          </button>

          <div className='w-[1px] h-10 bg-gray-600'></div>

          <Form action={logoutAction}>
            <button className='text-gray-700 hover:text-gray-900'>Sair</button>
          </Form>
        </nav>
      </div>
    </header>
  );
}
