'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  return (
    <div
      className="flex flex-col md:flex-row justify-between items-center py-4 md:py-6 max-w-6xl mx-auto px-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '20px', borderRadius: '8px' }}
    >
      <div className="flex justify-center md:justify-start items-center w-full md:w-auto">
        <Link href="https://www.agios.live/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
      </div>
      <nav className="flex space-x-6 mt-4 md:mt-0 w-full md:w-auto">
        <div className="flex-grow"></div> {/* Spacer */}
        <Link href="https://www.agios.live/" className={s.link}>
          Home
        </Link>
        <Link href="/" className={s.link}>
          Pricing
        </Link>
        <Link href="https://blog.agios.live/" className={s.link}>
          Blog
        </Link>
        {user && (
          <Link href="/account" className={s.link}>
            Account
          </Link>
        )}
        <div className="flex-grow"></div> {/* Spacer */}
      </nav>
      <div className="flex items-center justify-center md:justify-end w-full md:w-auto space-x-8 mt-4 md:mt-0">
        {user ? (
          <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
            <input type="hidden" name="pathName" value={usePathname()} />
            <button type="submit" className={s.link}>
              Sign Out
            </button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
