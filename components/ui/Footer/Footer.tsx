import Link from 'next/link';

import Logo from '@/components/icons/Logo';
import GitHub from '@/components/icons/GitHub';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FacebookIcon } from 'lucide-react';
import { faFacebookF, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
import SingleLogo from '@/components/icons/SingleLogo';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-zinc-900 " style={{fontSize:'14px'}}>
      <div className="max-w-6xl px-6 mx-auto">
        <div
          className="pt-10 flex flex-row items-center justify-between text-white transition-colors">
          <div className="flex items-center mt-10">
            <Link href="/" className="flex items-center font-bold">
        <span className="mr-2 border rounded-full border-zinc-700">
          <SingleLogo/>
        </span>
            </Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6 mt-10">
            <Link href="https://twitter.com/AGIOS_live" aria-label="Twitter" className="text-white hover:text-zinc-200">
              {/*<i className="fab fa-twitter"></i>*/}
              {/*<Fontawe icon={faAdobe} />*/}
              <FontAwesomeIcon icon={faX} />
            </Link>
            <Link href="https://www.facebook.com/agios.live" aria-label="Facebook"
                  className="text-white hover:text-zinc-200">
              {/*<i className="fab fa-facebook-f"></i>*/}
              <FontAwesomeIcon icon={faFacebookF} />
            </Link>
            <Link href="https://www.instagram.com/agios.live" aria-label="Instagram"
                  className="text-white hover:text-zinc-200">
              {/*<i className="fab fa-instagram"></i>*/}
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link href="https://www.youtube.com/@AGIOS_live" aria-label="YouTube"
                  className="text-white hover:text-zinc-200">
              {/*<i className="fab fa-youtube"></i>*/}
              <FontAwesomeIcon icon={faYoutube} />
            </Link>
            <Link href="https://www.tiktok.com/@agios.live" aria-label="TikTok"
                  className="text-white hover:text-zinc-200">
              {/*<i className="fab fa-tiktok"></i>*/}
              <FontAwesomeIcon icon={faTiktok} />
            </Link>
          </div>
          <div className="flex items-center justify-end space-x-6">
            <Link href="https://blog.agios.live/privacy-policy/" className="text-white transition duration-150 ease-in-out hover:text-zinc-200">
              Privacy Policy
            </Link>
            <Link href="https://blog.agios.live/terms-of-service/" className="text-white transition duration-150 ease-in-out hover:text-zinc-200">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="pb-10 flex flex-col items-end justify-end mt-1 space-y-4 md:flex-row bg-zinc-900">
          <div className="text-white">
            &copy; {new Date().getFullYear()} CHINGU AI PTE. LTD. All rights reserved.
          </div>
        </div>
      </div>
    </footer>

  );
}
