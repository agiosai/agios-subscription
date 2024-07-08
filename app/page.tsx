import Pricing from '../components/ui/Pricing/Pricing';
import { createClient } from '../utils/supabase/server';

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { NextUIProvider } from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import process from 'process';
config.autoAddCss = false;

export default async function PricingPage() {
  const supabase = createClient();
  let paddleEnv = {
    environment: Environment.production
  }

  if (process.env.PADDLE_ENV === 'sandbox'){
    paddleEnv = {
      environment: Environment.sandbox
    }
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();

// @ts-ignore
  const paddle = new Paddle(process.env.PADDLE_API_KEY,paddleEnv);

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    // @ts-ignore
    .eq('user_id',user?.id)
    .maybeSingle();

  const { data: products } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    // .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  const {data: feature_headers,error} = await supabase
    .from('featureheaders')
    .select("*");
  const {data: features} = await supabase
    .from('features')
    .select("*");
  if (error) {
    console.log(error);
  }
  console.log(products);
  const paddlesubscription = subscription? await paddle.subscriptions.get(subscription?.id):null;
  console.log("Paddle Subscription");
  console.log(paddlesubscription);
  // @ts-ignore
  return (
    // <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
    <Pricing
      user={user}
      // @ts-ignore
      products={products ?? []}
      subscription={subscription}
      // @ts-ignore
      feature_headers={feature_headers}
      // @ts-ignore
      features={features}
      paddlesubscription={paddlesubscription?.managementUrls?.updatePaymentMethod}
      />
      </NextThemesProvider>
    // </NextUIProvider>
  );
}
