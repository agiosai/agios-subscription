'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '../../../utils/stripe/server';
import Link from 'next/link';
import Card from '../../ui/Card';
import { Tables } from '../../../types_db';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
  points: number | null;
}

export default function CustomerPortalForm({ subscription,points }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0));

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };
  function capitalizeFirstLetter(str: any) {
    return str[0].toUpperCase() + str.slice(1);
  }

  return (
    <Card
      title={subscription?"Your Plan: "+capitalizeFirstLetter(subscription?.prices?.products?.type):""}
      description={
        subscription
          ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
          : 'You are not currently subscribed to any plan.'
      }
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Available Points: </p>
          <div>{points == -1 ? 'Unlimited':points}</div>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        {subscription ? (
          `${subscriptionPrice}/${subscription?.prices?.interval}`
        ) : (
          <Link href="/">Click here to choose your plan</Link>
        )}
      </div>
    </Card>
  );
}
