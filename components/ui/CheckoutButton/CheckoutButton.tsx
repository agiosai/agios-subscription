"use client"
// import usePaddle from "../hooks/usePaddle";
import usePaddle from '../../../hooks/usePaddle';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getURL } from '../../../utils/helpers';
import { router } from 'next/client';
import axios from 'axios';
import Swal from 'sweetalert2'
import Button from '@/components/ui/Button';
// @ts-ignore
export default function CheckoutButton({priceId,subscription,user,isTopup,upackage,amount,cycle,priceObj,product,paddlesubscriptionLink}){
  const paddle = usePaddle();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const [selectedPackage, setSelectedPackage] = useState<string>();
  const [selectedAmount, setSelectedAmount] = useState<string>();
  const [selectedCycle, setSelectedCycle] = useState<string>();
  const [shouldDisable,setShouldDisable] = useState<boolean>(false);
  const currentPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (subscription?.price_id === priceId) {
      setShouldDisable(true);
    } else {
      setShouldDisable(false);
    }
    console.log("PRICE");
    console.log(priceObj);
    console.log("PRODUCT");
    console.log(product);
    // check for pro
    if (subscription?.prices?.products?.type === 'pro' && product?.type === 'basic'){
      setShouldDisable(true);
    }


    // check points
    if (subscription?.prices?.interval === 'year' && subscription?.prices?.points >= priceObj?.points){
      setShouldDisable(true);
    }
    // check points
    if (subscription?.prices?.points > priceObj?.points){
      setShouldDisable(true);
    }
    if (product?.type === 'pro' && subscription?.price_id !== priceId && subscription?.prices?.points == priceObj?.points){
      setShouldDisable(false);
    }

    if (priceObj?.points == 0 && priceObj?.points != subscription?.prices?.points){
      setShouldDisable(false);
    }
    // check for pro
    // if (subscription?.prices?.products?.type === 'basic' && product?.type === 'pro'){
    //   setShouldDisable(false);
    // }
    //check yearly
    if (subscription?.prices?.interval === 'year' && cycle === 'month'){
      setShouldDisable(true);
    }
  }, [subscription?.price_id, priceId]);

  const handleOpenCheckout = () => {
    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }
    if (subscription?.price_id === priceId){
      return router.push('/account');
    }
    setPriceIdLoading(priceId);
    console.log(upackage);
    setSelectedPackage(upackage);
    setSelectedAmount(amount);
    setSelectedCycle(cycle);
    if (subscription?.id && subscription?.status === 'active' && cycle === 'year' && subscription?.prices?.interval === 'year'){
      Swal.fire({
        html: `
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-lg font-bold text-gray-800">You have selected the ${upackage} plan. This plan will cost ${amount} per ${cycle}.</h2>
            <p class="mt-4 text-sm text-gray-600">If you subscribe to this plan, your current recorded credit card will be used to pay.</p>
            <button
              class="w-full py-2 mt-4 text-sm font-semibold text-center text-white bg-blue-600 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              onClick="Swal.close(); window.location.href = '${paddlesubscriptionLink}'"
            >
              Proceed
            </button>
            <button
              class="w-full py-2 mt-4 text-sm font-semibold text-center text-white bg-red-500 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              onClick="Swal.close()"
            >
              Close
            </button>
          </div>
        `,
        background: 'transparent',
        showConfirmButton: false
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
        // @ts-ignore
        allowLogout:false,
        settings: {
          successUrl: getURL("success")
          // settings like successUrl and theme
        }
      });
    }
  };

  return (
    <Button
      variant="slim"
      type="button"
      loading={false}
      onClick={handleOpenCheckout}
      style={{
        paddingLeft: '0',
        paddingRight: '0',
        backgroundColor: shouldDisable ? '#1a1a1a' : '#e0e0e0',
        color: shouldDisable ? '#fff' : '#333',
        cursor: shouldDisable ? 'not-allowed' : 'pointer',
        fontSize: shouldDisable ? '1.25rem' : '1rem', // 1.25rem for larger text
        fontWeight: shouldDisable ? 'bold' : 'bold' // bold text for Subscribe
      }}
      className={`block w-full py-2 text-sm font-semibold text-center rounded-md mt-4 ${subscription?.price_id !== priceId ? 'hover:bg-white hover:text-black' : ''}`}
      disabled={shouldDisable}
    >
      {!shouldDisable ? "Subscribe" : subscription?.price_id === priceId ? 'Current Plan' : 'Already Included'}
    </Button>
  );
}
