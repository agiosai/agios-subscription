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
export default function CheckoutButton({priceId,subscription,user,isTopup,upackage,amount,cycle,priceObj,product}){
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

    //check yearly
    if (subscription?.prices?.interval === 'year' && cycle === 'month'){
      setShouldDisable(true);
    }

    // check points
    if (subscription?.prices?.interval === 'year' && subscription?.prices?.points >= priceObj?.points){
      setShouldDisable(true);
    }
    // check points
    if (subscription?.prices?.interval === 'month' && subscription?.prices?.points >= priceObj?.points){
      setShouldDisable(true);
    }

    if (priceObj?.points == 0 && priceObj?.points != subscription?.prices?.points){
      setShouldDisable(false);
    }
  }, [subscription?.price_id, priceId]);
  const openCheckout = () => {
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
          // title: 'Please confirm!',
          html: '<h2 class="text-1xl font-semibold leading-6 text-white">You have selected the '+upackage+' plan. This plan will cost '+amount+' per '+cycle+'. Confirm to proceed.</h2>',
          // icon: "warning",
          confirmButtonText: 'Confirm',
          showCancelButton: true,
          cancelButtonText: 'Cancel'
        }).then(function(isConfirm) {
          console.log(isConfirm);
          console.log(subscription);
          if (isConfirm.isConfirmed) {
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
                  router.push(getURL("switchsuccess"));
                }else {
                  alert('Something went wrong');
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }else {
            setPriceIdLoading('0');
          }
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
  //
  // // check for pro and basic
  // if (subscription){
  //
  // }
  return (
    <Button
      variant="slim"
      type="button"
      loading={false}
      onClick={openCheckout}
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
