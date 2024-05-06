import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import Topup from '@/components/ui/AccountForms/Topup';
import NameForm from '@/components/ui/AccountForms/NameForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import Link from 'next/link';

export default async function Success() {
  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Success
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Your Payment is succeeded. Thank you. <Link href="account">My Account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}