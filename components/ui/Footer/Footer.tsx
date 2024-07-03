import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
import SingleLogo from '@/components/icons/SingleLogo';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6" style={{ fontSize: '14px', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '8px' }}>
      <div className="max-w-6xl px-6 mx-auto flex flex-col md:flex-row justify-between items-center md:items-start text-white transition-colors">
        
        {/* Left Area - Logo */}
        <div className="flex items-center mt-10">
          <Link href="https://www.agios.live" className="flex items-center font-bold">
            <span className="mr-2 border rounded-full border-zinc-700">
              <SingleLogo />
            </span>
          </Link>
        </div>

        {/* Right Area */}
        <div className="flex flex-col items-center md:items-end space-y-4 mt-10 md:mt-0">

          {/* Row 1 - Social Media Links */}
          <div className="flex space-x-6">
            <Link href="https://twitter.com/AGIOS_live" aria-label="Twitter" className="text-white hover:text-zinc-200">
              <FontAwesomeIcon icon={faX} />
            </Link>
            <Link href="https://www.facebook.com/agios.live" aria-label="Facebook" className="text-white hover:text-zinc-200">
              <FontAwesomeIcon icon={faFacebookF} />
            </Link>
            <Link href="https://www.instagram.com/agios.live" aria-label="Instagram" className="text-white hover:text-zinc-200">
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link href="https://www.youtube.com/@AGIOS_live" aria-label="YouTube" className="text-white hover:text-zinc-200">
              <FontAwesomeIcon icon={faYoutube} />
            </Link>
            <Link href="https://www.tiktok.com/@agios.live" aria-label="TikTok" className="text-white hover:text-zinc-200">
              <FontAwesomeIcon icon={faTiktok} />
            </Link>
          </div>

          {/* Row 2 - Policy Links */}
          <div className="flex space-x-6">
            <Link href="https://blog.agios.live/privacy-policy/" className="text-white transition duration-150 ease-in-out hover:text-zinc-200">
              Privacy Policy
            </Link>
            <Link href="https://blog.agios.live/terms-of-service/" className="text-white transition duration-150 ease-in-out hover:text-zinc-200">
              Terms of Service
            </Link>
            <Link href="https://form.typeform.com/to/vnkH7IsK" className="text-white transition duration-150 ease-in-out hover:text-zinc-200">
              Support
            </Link>
            <Link href="https://form.typeform.com/to/cYhFHVPa" className="text-white transition duration-150 ease-in-out hover:text-zinc-200">
              Feedback
            </Link>
          </div>

          {/* Row 3 - Copyright Text */}
          <div className="text-white text-center md:text-right">
            &copy; {new Date().getFullYear()} CHINGU AI PTE. LTD. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
