'use client';


import Card from '../../../components/ui/Card';

import { useRouter } from 'next/navigation';
import { Tables } from '../../../types_db';
import cn from 'classnames';
import CheckoutButton from '../../../components/ui/CheckoutButton/CheckoutButton';

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
  products: any;
  subscription: SubscriptionWithPriceAndProduct | null;
  user:any
}
export default function Topup({ products,subscription,user }: Props) {
  const router = useRouter();


  // @ts-ignore
  return (
    <Card
      title="Topup"
      description="Topup Your Points Balance"
    >
      <div className="mt-8 mb-4 text-xl font-semibold">

        <div
          className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {/*{JSON.stringify(products)}*/}
          {/* @ts-ignore */}
          {products.map((product) => {
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: product.prices[0].currency!,
              minimumFractionDigits: 0
            }).format((product.prices[0]?.unit_amount || 0));
            return <>
              {
                product.type === subscription?.prices?.products?.type ? <>
                  {
                    product.prices[0].type === "one_time" ? <>
                      <div
                        key={product.id}
                        className={cn(
                          'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                          'flex-1', // This makes the flex item grow to fill the space
                          'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width
                          'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
                        )}
                      >
                        <div className="p-6">
                          <h2 className="text-2xl font-semibold leading-6 text-white">
                            {product.name}
                          </h2>
                          <p className="mt-4 text-zinc-300">{product.description}</p>
                          <p className="mt-8">
                      <span className="text-5xl font-extrabold white">
                        {priceString}
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
                          {/*<CheckoutButton priceId={product.prices[0].id} subscription={subscription} user={user}*/}
                          {/*                isTopup={true} />*/}
                        </div>
                      </div>
                    </> : <></>
                  }
                </> : <></>
              }
            </>
          })}
        </div>
        </div>
    </Card>
);
}
