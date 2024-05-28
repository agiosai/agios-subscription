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
    <div className="relative flex flex-row items-center justify-between py-4 md:py-6" style={{fontSize:"15px"}}>
      <div className="flex items-center">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
      </div>
      <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2">
        <Link href="https://www.agios.live" className={s.link} style={{paddingRight: '15px'}}>
          Home
        </Link>
        <Link href="/" className={s.link} style={{paddingRight: '15px'}}>
          Pricing
        </Link>
        <Link href="https://blog.agios.live" className={s.link} style={{paddingRight: '15px'}}>
          Blog
        </Link>
      </nav>
      <div className="flex justify-end space-x-8">
        {user && (
          <Link href="/account" className={s.link}>
            My Account &nbsp;|
          </Link>
        )}
        {user ? (
          <form style={{marginLeft:'auto'}} onSubmit={(e) => handleRequest(e, SignOut, router)}>
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
