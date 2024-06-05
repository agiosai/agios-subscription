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
  paddlesubscription:any
}

export default function CustomerPortalForm({ subscription,points,paddlesubscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const {isOpen, onOpen, onOpenChange} = useDisclosure();
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


  function formatBillingPeriod(start: string, end: string) {
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    const startMonth = format(startDate, 'MMMM');
    const startDay = format(startDate, 'd');
    const endMonth = format(endDate, 'MMMM');
    const endDay = format(endDate, 'd');
    const year = format(startDate, 'yyyy');

    const nextBillingDate = addDays(endDate, 1);
    const nextBillingDateFormatted = format(nextBillingDate, 'MMMM d, yyyy');

    return {
      billingPeriod: `Billing Period: ${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`,
      nextBillingDate: `Next Billing Date: ${nextBillingDateFormatted}`
    };
  }
  const { billingPeriod, nextBillingDate } = subscription ? formatBillingPeriod(subscription?subscription.current_period_start:"", subscription?subscription.current_period_end:""):{billingPeriod:"",nextBillingDate:""};

  return (
    <Card
      title={subscription?"Your Plan: "+capitalizeFirstLetter(subscription?.prices?.products?.type):""}
      description={
        subscription
          ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
          : 'You are not currently subscribed to any plan.'
      }
      footer={
        <>
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <p className="pb-4 sm:pb-0">{billingPeriod}</p>
            <div>Available  Points: {points == -1 ? 'Unlimited' : points}</div>
          </div>
          {
            subscription &&
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">{nextBillingDate} </p>
              <div><a href="javascript:void(0)" onClick={onOpen}>Update Your Payment Method</a></div>
            </div>
          }
            <UpdatePayment handleModalClose={handleModalClose} cancelLink={paddlesubscription?.managementUrls?.cancel}
                           UpdateLink={paddlesubscription?.managementUrls?.updatePaymentMethod} onOpen={onOpen} isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
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
