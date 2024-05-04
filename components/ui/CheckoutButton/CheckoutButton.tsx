"use client"
// import usePaddle from "../hooks/usePaddle";
import usePaddle from '@/hooks/usePaddle';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getURL } from '@/utils/helpers';
import { router } from 'next/client';

// @ts-ignore
export default function CheckoutButton({priceId,subscription,user,isTopup}){
  const paddle = usePaddle();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const router = useRouter();

  const openCheckout = () => {
      if (!user) {
        setPriceIdLoading(undefined);
        return router.push('/signin/signup');
      }
    setPriceIdLoading(priceId);
    paddle?.Checkout.open({
      items: [
        {
          priceId: priceId, // you can find it in the product catalog
          quantity: 1,
        },
      ],
      customer: {
        email: user.email // email of your current logged in user
      },
      customData: {
        // other custom metadata you want to pass
        uuid:user?.id
      },
      settings: {
        successUrl: getURL("account")
        // settings like successUrl and theme
      }
    });
  };

  return (
    // <button
    //   onClick={openCheckout}
    // >
    //   Checkout
    // </button>
  <Button
    variant="slim"
    type="button"
    loading={priceIdLoading === priceId}
    onClick={openCheckout}
    className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
  >
    {
      isTopup ? "Topup" : <>{subscription?.price_id === priceId ? 'Manage' : 'Subscribe'}</>
    }

  </Button>
  );
}