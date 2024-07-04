'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '../../../utils/stripe/server';
import Link from 'next/link';
import Card from '../../ui/Card';
import { Tables } from '../../../types_db';
import { addDays, format, parseISO } from 'date-fns';
import UpdatePayment from '@/components/ui/UpdatePayment/UpdatePayment';
import { useDisclosure } from '@nextui-org/modal';

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
  paddlesubscription: any
}

export default function CustomerPortalForm({ subscription, points, paddlesubscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  function formatNextBillingDate(end: string) {
    const endDate = parseISO(end);
    const nextBillingDate = addDays(endDate, 1);
    return format(nextBillingDate, 'MMMM d, yyyy');
  }

  const nextBillingDate = subscription ? formatNextBillingDate(subscription?.current_period_end || '') : '';

  return (
    <Card
      title={subscription && paddlesubscription?.status === 'active' ? "Your Plan: " + capitalizeFirstLetter(subscription?.prices?.products?.type) : ""}
      description={
        subscription && paddlesubscription?.status === 'active'
          ? `You are currently on ${subscription?.prices?.products?.name} plan.`
          : 'You are not subscribed to any plan.'
      }
      footer={
        <>
          {subscription && paddlesubscription?.status === 'active' && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
              <div className="flex flex-col sm:w-1/2">
                <p className="pb-4 sm:pb-0">{`Available Points: ${points == null ? 'N/A' : points == -1 ? 'Unlimited' : points.toLocaleString()}`}</p>
                <p className="pb-4 sm:pb-0">{`Next Billing Date: ${nextBillingDate}`}</p>
              </div>
              <div className="flex sm:w-1/2 sm:justify-end">
                <a href="javascript:void(0)" onClick={onOpen} style={{ color: 'white' }}>
                  Update Your Payment Method
                </a>
              </div>
            </div>
          )}
          <UpdatePayment
            handleModalClose={handleModalClose}
            cancelLink={paddlesubscription?.managementUrls?.cancel}
            UpdateLink={paddlesubscription?.managementUrls?.updatePaymentMethod}
            onOpen={onOpen}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        </>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        {subscription && paddlesubscription?.status === 'active' ? (
          `${subscriptionPrice}/${subscription?.prices?.interval}`
        ) : (
          <Link href="/">Click here to choose your plan.</Link>
        )}
      </div>
    </Card>
  );
}
