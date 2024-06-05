"use client"
import Link from 'next/link';
import { router } from 'next/client';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default async function Success() {

  const router = useRouter();
  const gotoAccount = () =>{
    return router.push('/account');
  }
  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Plan Switch Successful!
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Thank you for your payment. <br />A payment receipt will be sent to your registered email.
          </p>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            <Button
              variant="slim"
              type="button"
              onClick={gotoAccount}
              className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 mt-4"
            >
              My Account

            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}