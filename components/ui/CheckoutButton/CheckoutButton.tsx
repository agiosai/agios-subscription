"use client"
import usePaddle from '../../../hooks/usePaddle';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getURL } from '../../../utils/helpers';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from '@/components/ui/Button';

export default function CheckoutButton({ priceId, subscription, user, isTopup, upackage, amount, cycle, currentPlanAmount }) {
  const paddle = usePaddle();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const [selectedPackage, setSelectedPackage] = useState<string>();
  const [selectedAmount, setSelectedAmount] = useState<string>();
  const [selectedCycle, setSelectedCycle] = useState<string>();
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
  const currentPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Fetch the current plan ID (mocking this as we would need the actual call to Paddle API)
    if (subscription && subscription.id) {
      // Replace this with actual API call to get the current plan ID
      setCurrentPlanId(subscription.price_id); // assuming subscription.price_id holds the current plan ID
    }
  }, [subscription]);

  const openCheckout = () => {
    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }
    if (subscription?.price_id === priceId) {
      return router.push('/account');
    }

    if (currentPlanId !== null && priceId < currentPlanId) {
      Swal.fire({
        title: 'Downgrade not allowed',
        text: 'You cannot downgrade your subscription.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setPriceIdLoading(undefined);
      return;
    }

    setPriceIdLoading(priceId);
    console.log(upackage);
    setSelectedPackage(upackage);
    setSelectedAmount(amount);
    setSelectedCycle(cycle);

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
        uuid: user?.id
      },
      settings: {
        successUrl: getURL("success")
      }
    });
  };

  return (
    <Button
      variant="slim"
      type="button"
      loading={priceIdLoading === priceId}
      onClick={openCheckout}
      style={{ paddingLeft: '0', paddingRight: '0' }}
      className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 mt-4"
      disabled={subscription?.price_id === priceId || (parseFloat(amount) < parseFloat(currentPlanAmount))}
    >
      {isTopup ? "Topup" : <>{subscription?.price_id === priceId ? 'Current Plan' : 'Subscribe'}</>}
    </Button>
  );
}
