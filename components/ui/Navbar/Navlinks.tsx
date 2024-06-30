'use client';

import Link from 'next/link';
import { SignOut } from '../../../utils/auth-helpers/server';
import { handleRequest } from '../../../utils/auth-helpers/client';
import Logo from '../../../components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '../../../utils/auth-helpers/settings';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between py-4 md:py-6 px-4 md:px-8" style={{ fontSize: "15px" }}>
      <div className="flex items-center mb-4 md:mb-0">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
      </div>
      <nav className="flex flex-col md:flex-row items-center space-x-0 md:space-x-2 mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <Link href="https://www.agios.live" className={s.link} style={{ paddingRight: '15px', paddingTop: '10px' }}>
          Home
        </Link>
        <Link href="/" className={s.link} style={{ paddingRight: '15px', paddingTop: '10px' }}>
          Pricing
        </Link>
        <Link href="https://blog.agios.live" className={s.link} style={{ paddingRight: '15px', paddingTop: '10px' }}>
          Blog
        </Link>
      </nav>
      <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-8">
        {user && (
          <Link href="/account" className={s.link}>
            My Account &nbsp;|
          </Link>
        )}
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
