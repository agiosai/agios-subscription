'use client';


import LogoCloud from '../../../components/ui/LogoCloud';
import type { Tables } from '../../../types_db';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import CheckoutButton from '../../../components/ui/CheckoutButton/CheckoutButton';
import Button from '../Button';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
type Feature = Tables<'features'>;
type FeatureHeader = Tables<'featureheaders'>

// @ts-ignore
interface ProductWithPrices extends Product {
  prices: Price[];
  type:String;
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
  features: Feature[];
  feature_headers: FeatureHeader[];
}

type BillingInterval = 'lifetime' | 'year' | 'month';
type BillingTypes = 'basic' | 'pro';

export default function Pricing({ user, products, subscription, features,feature_headers }: Props) {

  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const types = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.type
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [billingType, setBillingType] =
    useState<BillingTypes>('basic');
  const [basicPackCount, setBasicPackCount] = useState<number>(0);
  const [proPackCount, setProPackCount] = useState<number>(0);
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();
  console.log("features",features);
  console.log("feature_headers",feature_headers);
  const countPackages = (interval:string)=>{
    let pro = 0;
    let basic = 0;
    products.map((product) => {
      console.log(product?.prices[0].interval);
      const price = product?.prices?.find(
        (price) => price.interval === interval
      );
      if (price){
        if (product.type === "basic") {
          pro++;
          setBasicPackCount(pro);
        }else {
          basic++;
          setProPackCount(basic);
        }
      }
    });

  };
  // countPackages(billingInterval);
  useEffect(() => {
    // call api or anything
    console.log("loaded");
    countPackages(billingInterval);
  });

  // const handleStripeCheckout = async (price: Price) => {
  //   console.log(price);
  //   setPriceIdLoading(price.id);
  //
  //   if (!user) {
  //     setPriceIdLoading(undefined);
  //     return router.push('/signin/signup');
  //   }
  //
  //   const { errorRedirect, sessionId } = await checkoutWithStripe(
  //     price,
  //     currentPath
  //   );
  //
  //   if (errorRedirect) {
  //     setPriceIdLoading(undefined);
  //     return router.push(errorRedirect);
  //   }
  //
  //   if (!sessionId) {
  //     setPriceIdLoading(undefined);
  //     return router.push(
  //       getErrorRedirect(
  //         currentPath,
  //         'An unknown error occurred.',
  //         'Please try again later or contact a system administrator.'
  //       )
  //     );
  //   }
  //
  //   const stripe = await getStripe();
  //   stripe?.redirectToCheckout({ sessionId });
  //
  //   setPriceIdLoading(undefined);
  // };


  if (!products.length) {
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
        <LogoCloud />
      </section>
    );
  } else {
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
              Let's get you started with AGI OS
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
              Simple, all-inclusive dynamic pricing.
            </p>
            <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
              {intervals.includes('month') && (
                <button
                  onClick={() => {
                    setBillingInterval('month');
                    countPackages(billingInterval);
                  }}
                  type="button"
                  className={`${
                    billingInterval === 'month'
                      ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Monthly Billing
                </button>
              )}
              {intervals.includes('year') && (
                <button
                  onClick={() => {
                    setBillingInterval('year')
                    countPackages(billingInterval);
                  }}
                  type="button"
                  className={`${
                    billingInterval === 'year'
                      ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Yearly Billing
                </button>
              )}
            </div>
            <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
              {intervals.includes('month') && (
                <button
                  onClick={() => {
                    setBillingType('basic')
                  }}
                  type="button"
                  className={`${
                    billingType === 'basic'
                      ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Basic
                </button>
              )}
              {intervals.includes('year') && (
                <button
                  onClick={() => {
                    setBillingType('pro')
                  }}
                  type="button"
                  className={`${
                    billingType === 'pro'
                      ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Pro
                </button>
              )}
            </div>
          </div>
          <div>

            <div className="bg-gray-950 text-gray-50 py-12 md:py-24">
              <div className="container mx-auto px-4 md:px-6">
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                {products.map((product) => {
                  console.log(product?.prices[0].interval);
                  const price = product?.prices?.find(
                    (price) => price.interval === billingInterval
                  );
                  if (!price) return null;
                  if (product.type !== billingType) {
                    return null;
                  }
                  const priceString = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency!,
                    minimumFractionDigits: 0
                  }).format((price?.unit_amount || 0));
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                        {
                          'border border-pink-500': subscription
                            ? price.id === subscription?.price_id
                            : product.name === 'Freelancer'
                        },
                        'flex-1', // This makes the flex item grow to fill the space
                        'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width
                        'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
                      )}
                    >
                      <div className="p-6 items-center text-center">
                        <h2 className="text-2xl font-semibold leading-6 text-white">
                          {product.name}
                        </h2>
                        <p className="mt-4 text-zinc-300">{product.description}</p>
                        <p className="mt-8">
                      <span className="text-5xl font-extrabold white">
                        {priceString}
                      </span>
                          <span className="text-base font-medium text-zinc-100">
                        /{price.interval}
                      </span>
                        </p>
                        {/*<Button*/}
                        {/*  variant="slim"*/}
                        {/*  type="button"*/}
                        {/*  loading={priceIdLoading === price.id}*/}
                        {/*  onClick={() => handleStripeCheckout(price)}*/}
                        {/*  className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"*/}
                        {/*>*/}
                        {/*  {subscription ? 'Manage' : 'Subscribe'}*/}
                        {/*</Button>*/}
                        <CheckoutButton priceId={price.id} subscription={subscription} user={user} isTopup={false} />
                      </div>
                    </div>
                  );
                })}
                </div>
                {/*<div className="overflow-x-auto">*/}
                {/*  <table className="w-full table-auto border-collapse">*/}
                {/*    <thead>*/}
                {/*    <tr className="bg-gray-900">*/}
                {/*      <th className="px-6 py-4 text-left">Plan</th>*/}

                {/*      <th colSpan={basicPackCount} className="px-6 py-4 text-center">*/}
                {/*        <h2>Basic</h2>*/}
                {/*      </th>*/}
                {/*      <th colSpan={proPackCount} className="px-6 py-4 text-center"><h2>Pro</h2>*/}
                {/*      </th>*/}
                {/*      /!*<th className="px-6 py-4 text-center">Starter</th>*!/*/}
                {/*      /!*<th className="px-6 py-4 text-center">Pro</th>*!/*/}
                {/*      /!*<th className="px-6 py-4 text-center">Enterprise</th>*!/*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    <tr className="border-b border-gray-800">*/}
                {/*      <td className="px-6 py-4 font-bold">Pricing</td>*/}
                {/*      {products.map((product) => {*/}
                {/*          console.log(product?.prices[0].interval);*/}
                {/*          const price = product?.prices?.find(*/}
                {/*            (price) => price.interval === billingInterval*/}
                {/*          );*/}
                {/*          if (!price) return null;*/}
                {/*          if (product.type !== 'basic') {*/}
                {/*            return null;*/}
                {/*          }*/}
                {/*          const priceString = new Intl.NumberFormat('en-US', {*/}
                {/*            style: 'currency',*/}
                {/*            currency: price.currency!,*/}
                {/*            minimumFractionDigits: 0*/}
                {/*          }).format((price?.unit_amount || 0));*/}
                {/*          return (*/}
                {/*            <td className="px-6 py-4 text-center">*/}
                {/*              <div className="text-2xl font-bold">*/}
                {/*                /!*<span className="text-2xl font-normal mr-1">$</span>*!/*/}
                {/*                {priceString}{'\n                                '}*/}
                {/*                <span*/}
                {/*                  className="text-2xl font-normal">/{price.interval === 'month' ? 'mo' : 'yr'}</span>*/}
                {/*              </div>*/}
                {/*            </td>*/}
                {/*          );*/}
                {/*        }*/}
                {/*      )*/}
                {/*      }*/}
                {/*      {products.map((product) => {*/}
                {/*          console.log(product?.prices[0].interval);*/}
                {/*          const price = product?.prices?.find(*/}
                {/*            (price) => price.interval === billingInterval*/}
                {/*          );*/}
                {/*          if (!price) return null;*/}
                {/*          if (product.type !== 'pro') {*/}
                {/*            return null;*/}
                {/*          }*/}
                {/*          const priceString = new Intl.NumberFormat('en-US', {*/}
                {/*            style: 'currency',*/}
                {/*            currency: price.currency!,*/}
                {/*            minimumFractionDigits: 0*/}
                {/*          }).format((price?.unit_amount || 0));*/}
                {/*          return (*/}

                {/*            <td className="px-6 py-4 text-center">*/}
                {/*              <div className="text-2xl font-bold">*/}
                {/*                /!*<span className="text-2xl font-normal mr-1">$</span>*!/*/}
                {/*                {priceString}{'\n                                '}*/}
                {/*                <span className="text-2xl font-normal">/{price.interval === 'month' ? 'mo' : 'yr'}</span>*/}
                {/*              </div>*/}
                {/*            </td>*/}
                {/*          );*/}
                {/*        }*/}
                {/*      )*/}
                {/*      }*/}
                {/*      /!*<td className="px-6 py-4 text-center">*!/*/}
                {/*      /!*  <div className="text-4xl font-bold">*!/*/}
                {/*      /!*    <span className="text-2xl font-normal mr-1">$</span>*!/*/}
                {/*      /!*    29{'\n                                '}*!/*/}
                {/*      /!*    <span className="text-2xl font-normal">/mo</span>*!/*/}
                {/*      /!*  </div>*!/*/}
                {/*      /!*</td>*!/*/}
                {/*      /!*<td className="px-6 py-4 text-center">*!/*/}
                {/*      /!*  <div className="text-4xl font-bold">*!/*/}
                {/*      /!*    <span className="text-2xl font-normal mr-1">$</span>*!/*/}
                {/*      /!*    99{"\n                                "}*!/*/}
                {/*      /!*    <span className="text-2xl font-normal">/mo</span>*!/*/}
                {/*      /!*  </div>*!/*/}
                {/*      /!*</td>*!/*/}
                {/*    </tr>*/}
                {/*    <tr className="border-b border-gray-800">*/}
                {/*      <td className="px-6 py-4 font-bold">Credits</td>*/}
                {/*      {products.map((product) => {*/}
                {/*          console.log(product?.prices[0].interval);*/}
                {/*          const price = product?.prices?.find(*/}
                {/*            (price) => price.interval === billingInterval*/}
                {/*          );*/}
                {/*          if (!price) return null;*/}
                {/*          if (product.type !== 'basic') {*/}
                {/*            return null;*/}
                {/*          }*/}
                {/*          const priceString = new Intl.NumberFormat('en-US', {*/}
                {/*            style: 'currency',*/}
                {/*            currency: price.currency!,*/}
                {/*            minimumFractionDigits: 0*/}
                {/*          }).format((price?.unit_amount || 0));*/}
                {/*          return (*/}
                {/*            <td className="px-6 py-4 text-center">{(price.points == 0) ? 'Unlimited' : price.points}</td>*/}
                {/*          );*/}
                {/*        }*/}
                {/*      )*/}
                {/*      }*/}
                {/*      {products.map((product) => {*/}
                {/*          console.log(product?.prices[0].interval);*/}
                {/*          const price = product?.prices?.find(*/}
                {/*            (price) => price.interval === billingInterval*/}
                {/*          );*/}
                {/*          if (!price) return null;*/}
                {/*          if (product.type !== 'pro') {*/}
                {/*            return null;*/}
                {/*          }*/}
                {/*          const priceString = new Intl.NumberFormat('en-US', {*/}
                {/*            style: 'currency',*/}
                {/*            currency: price.currency!,*/}
                {/*            minimumFractionDigits: 0*/}
                {/*          }).format((price?.unit_amount || 0));*/}
                {/*          return (*/}
                {/*            <td className="px-6 py-4 text-center">{(price.points == 0) ? 'Unlimited' : price.points}</td>*/}
                {/*          );*/}
                {/*        }*/}
                {/*      )*/}
                {/*      }*/}
                {/*      /!*<td className="px-6 py-4 text-center">1</td>*!/*/}
                {/*      /!*<td className="px-6 py-4 text-center">5</td>*!/*/}
                {/*      /!*<td className="px-6 py-4 text-center">Unlimited</td>*!/*/}
                {/*    </tr>*/}
                {/*    /!*<tr className="border-b border-gray-800">*!/*/}
                {/*    /!*  <td className="px-6 py-4 font-bold">Storage</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">5 GB</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">50 GB</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">1 TB</td>*!/*/}
                {/*    /!*</tr>*!/*/}
                {/*    {*/}
                {/*      feature_headers.map((feature_header) => {*/}
                {/*        return (*/}
                {/*          <>*/}
                {/*            <tr className="bg-gray-900">*/}
                {/*              <td className="px-6 py-4 font-bold"*/}
                {/*                  colSpan={basicPackCount + proPackCount + 1}>{feature_header?.title}</td>*/}
                {/*            </tr>*/}
                {/*            {*/}
                {/*              features.map((feature) => {*/}
                {/*                return (*/}
                {/*                  <>*/}
                {/*                    {*/}
                {/*                      feature_header.id === feature.header && (*/}
                {/*                        <tr>*/}
                {/*                          <td className="px-6 py-4">{feature?.title}</td>*/}
                {/*                          {products.map((product) => {*/}
                {/*                              console.log(product?.prices[0].interval);*/}
                {/*                              const price = product?.prices?.find(*/}
                {/*                                (price) => price.interval === billingInterval*/}
                {/*                              );*/}
                {/*                              if (!price) return null;*/}
                {/*                              if (product.type !== 'basic') {*/}
                {/*                                return null;*/}
                {/*                              }*/}
                {/*                              const priceString = new Intl.NumberFormat('en-US', {*/}
                {/*                                style: 'currency',*/}
                {/*                                currency: price.currency!,*/}
                {/*                                minimumFractionDigits: 0*/}
                {/*                              }).format((price?.unit_amount || 0));*/}
                {/*                              return (*/}
                {/*                                // <td className="px-6 py-4 text-center">*/}
                {/*                                //   <CheckIcon className="w-5 h-5 text-green-500" />*/}
                {/*                                // </td>*/}
                {/*                                <td className="px-6 py-4 text-center">*/}
                {/*                                  {*/}
                {/*                                    // @ts-ignore*/}
                {/*                                    product?.features?.includes(feature.id) ?*/}
                {/*                                      <><CheckIcon className="w-5 h-5 text-green-500" /></>*/}
                {/*                                      : <><XIcon className="w-5 h-5 text-red-500" /></>*/}
                {/*                                  }*/}
                {/*                                </td>*/}
                {/*                              );*/}
                {/*                            }*/}
                {/*                          )*/}
                {/*                          }*/}
                {/*                          {products.map((product) => {*/}
                {/*                              console.log(product?.prices[0].interval);*/}
                {/*                              const price = product?.prices?.find(*/}
                {/*                                (price) => price.interval === billingInterval*/}
                {/*                              );*/}
                {/*                              if (!price) return null;*/}
                {/*                              if (product.type !== 'pro') {*/}
                {/*                                return null;*/}
                {/*                              }*/}
                {/*                              const priceString = new Intl.NumberFormat('en-US', {*/}
                {/*                                style: 'currency',*/}
                {/*                                currency: price.currency!,*/}
                {/*                                minimumFractionDigits: 0*/}
                {/*                              }).format((price?.unit_amount || 0));*/}
                {/*                              return (*/}
                {/*                                <td className="px-6 py-4 text-center">*/}
                {/*                                  {*/}
                {/*                                    // @ts-ignore*/}
                {/*                                    product?.features?.includes(feature.id) ?*/}
                {/*                                      <><CheckIcon className="w-5 h-5 text-green-500" /></>*/}
                {/*                                      : <><XIcon className="w-5 h-5 text-red-500" /></>*/}
                {/*                                  }*/}
                {/*                                </td>*/}
                {/*                              );*/}
                {/*                            }*/}
                {/*                          )*/}
                {/*                          }*/}
                {/*                          /!*<td style={{ border: '1px solid white', textAlign: 'center' }}>●</td>*!/*/}
                {/*                          /!*<td style={{ border: '1px solid white', textAlign: 'center' }}>●</td>*!/*/}
                {/*                          /!*<td style={{ border: '1px solid white', textAlign: 'center' }}>○</td>*!/*/}
                {/*                          /!*<td style={{ border: '1px solid white', textAlign: 'center' }}>●</td>*!/*/}
                {/*                        </tr>*/}
                {/*                      )*/}
                {/*                    }*/}
                {/*                  </>*/}
                {/*                );*/}
                {/*              })*/}
                {/*            }*/}
                {/*          </>*/}
                {/*        );*/}
                {/*      })*/}
                {/*    }*/}
                {/*    /!*<tr className="bg-gray-900">*!/*/}
                {/*    /!*  <td className="px-6 py-4 font-bold">Features</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4" />*!/*/}
                {/*    /!*  <td className="px-6 py-4" />*!/*/}
                {/*    /!*  <td className="px-6 py-4" />*!/*/}
                {/*    /!*</tr>*!/*/}
                {/*    /!*<tr className="border-b border-gray-800">*!/*/}
                {/*    /!*  <td className="px-6 py-4">Basic analytics</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*</tr>*!/*/}
                {/*    /!*<tr className="border-b border-gray-800">*!/*/}
                {/*    /!*  <td className="px-6 py-4">Advanced analytics</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <XIcon className="w-5 h-5 text-red-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*</tr>*!/*/}
                {/*    /!*<tr className="border-b border-gray-800">*!/*/}
                {/*    /!*  <td className="px-6 py-4">Custom analytics</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <XIcon className="w-5 h-5 text-red-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <XIcon className="w-5 h-5 text-red-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*</tr>*!/*/}
                {/*    /!*<tr className="border-b border-gray-800">*!/*/}
                {/*    /!*  <td className="px-6 py-4">Email support</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*</tr>*!/*/}
                {/*    /!*<tr className="border-b border-gray-800">*!/*/}
                {/*    /!*  <td className="px-6 py-4">Priority email support</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <XIcon className="w-5 h-5 text-red-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*</tr>*!/*/}
                {/*    /!*<tr className="border-b border-gray-800">*!/*/}
                {/*    /!*  <td className="px-6 py-4">Dedicated account manager</td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <XIcon className="w-5 h-5 text-red-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <XIcon className="w-5 h-5 text-red-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*  <td className="px-6 py-4 text-center">*!/*/}
                {/*    /!*    <CheckIcon className="w-5 h-5 text-green-500" />*!/*/}
                {/*    /!*  </td>*!/*/}
                {/*    /!*</tr>*!/*/}

                {/*    <tr>*/}
                {/*      <td></td>*/}
                {/*      {products.map((product) => {*/}
                {/*          console.log(product?.prices[0].interval);*/}
                {/*          const price = product?.prices?.find(*/}
                {/*            (price) => price.interval === billingInterval*/}
                {/*          );*/}
                {/*          if (!price) return null;*/}
                {/*          if (product.type !== 'basic') {*/}
                {/*            return null;*/}
                {/*          }*/}
                {/*          const priceString = new Intl.NumberFormat('en-US', {*/}
                {/*            style: 'currency',*/}
                {/*            currency: price.currency!,*/}
                {/*            minimumFractionDigits: 0*/}
                {/*          }).format((price?.unit_amount || 0));*/}
                {/*          return (*/}
                {/*            <td>*/}
                {/*              <h3 className="text-base font-medium white ml-4 mr-4 text-center items-center mt-4">*/}
                {/*                {product.name}*/}
                {/*              </h3>*/}
                {/*              <p className="mt-8 mb-8 ml-4 mr-4">*/}
                {/*                <CheckoutButton priceId={price.id} subscription={subscription} user={user}*/}
                {/*                                isTopup={false} />*/}
                {/*              </p>*/}
                {/*            </td>*/}
                {/*          );*/}
                {/*        }*/}
                {/*      )*/}
                {/*      }*/}
                {/*      {products.map((product) => {*/}
                {/*        console.log(product?.prices[0].interval);*/}
                {/*        const price = product?.prices?.find(*/}
                {/*          (price) => price.interval === billingInterval*/}
                {/*        );*/}
                {/*        if (!price) return null;*/}
                {/*        if (product.type !== 'pro') {*/}
                {/*          return null;*/}
                {/*        }*/}
                {/*        const priceString = new Intl.NumberFormat('en-US', {*/}
                {/*          style: 'currency',*/}
                {/*          currency: price.currency!,*/}
                {/*          minimumFractionDigits: 0*/}
                {/*        }).format((price?.unit_amount || 0));*/}
                {/*        return (*/}
                {/*          <td>*/}
                {/*            <h3 className="text-base font-medium white ml-4 mr-4 text-center items-center mt-4">*/}
                {/*              {product.name}*/}
                {/*            </h3>*/}
                {/*            <p className="mt-8 mb-8 ml-4 mr-4">*/}
                {/*              <CheckoutButton priceId={price.id} subscription={subscription} user={user}*/}
                {/*                              isTopup={false} />*/}
                {/*            </p>*/}
                {/*          </td>*/}
                {/*        );*/}
                {/*      })*/}
                {/*      }*/}
                {/*    </tr>*/}
                {/*    </tbody>*/}
                {/*  </table>*/}
                {/*</div>*/}
                {/*<div className="mt-8 flex justify-center space-x-4">*/}
                {/*  <Button className="w-full md:w-auto">Get Started with Starter</Button>*/}
                {/*  <Button className="w-full md:w-auto">Get Started with Pro</Button>*/}
                {/*  <Button className="w-full md:w-auto">Get Started with Enterprise</Button>*/}
                {/*  <Button className="w-full md:w-auto">Get Started with Enterprise</Button>*/}
                {/*</div>*/}
              </div>
            </div>

          </div>
          <LogoCloud />
        </div>
      </section>
    );
  }
}

// @ts-ignore
function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


// @ts-ignore
function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
