"use client"
// import usePaddle from "../hooks/usePaddle";
import usePaddle from '@/hooks/usePaddle';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getURL } from '@/utils/helpers';
import { router } from 'next/client';
import axios from 'axios';

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
      if (subscription?.price_id === priceId){
        return router.push('/account');
      }
    setPriceIdLoading(priceId);
      if (subscription?.id){
        let data = JSON.stringify({
          price_id: priceId,
          uuid: user?.id,
          subscription_id: subscription?.id
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: '/api/upgrade',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            if (response.data.success){
              router.push(getURL("success"));
            }else {
              alert('Something went wrong');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }else {

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
            successUrl: getURL("success")
            // settings like successUrl and theme
          }
        });
      }
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