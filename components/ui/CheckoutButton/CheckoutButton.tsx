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
    console.log("SHOULD");
    console.log("SHOULD",shouldDisable);
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
          <div style="color: #ffffff; background-color: #333333; padding: 20px; border-radius: 10px;">
            <h2 class="text-1xl font-semibold leading-6 text-white">You have selected the ${upackage} plan. This plan will cost ${amount} per ${cycle}.</h2>
            <p class="mt-4 text-sm">If you subscribe to this plan, your current recorded credit card will be used to pay.</p>
          </div>
        `,
        confirmButtonText: 'Proceed',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        background: '#333333',
        color: '#ffffff',
        confirmButtonColor: '#433d81',
        cancelButtonColor: '#555555',
        customClass: {
          popup: 'custom-modal-border',
          confirmButton: 'order-1',
          cancelButton: 'order-2'
        }
      }).then(function(isConfirm) {
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
              if (response.data.success){
                router.push(getURL("switchsuccess"));
              } else {
                alert('Something went wrong');
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setPriceIdLoading('0');
        }
      });
    } else {
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
    <>
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
      <style jsx global>{`
        .custom-modal-border {
          border: 1px solid #444444;
        }
        .swal2-actions {
          display: flex;
          flex-direction: column;
        }
        .swal2-confirm, .swal2-cancel {
          width: 100%;
          margin: 5px 0;
          padding: 10px 0;
        }
        .swal2-confirm {
          order: 1;
        }
        .swal2-cancel {
          order: 2;
        }
      `}</style>
    </>
  );
}
