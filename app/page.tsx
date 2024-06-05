import Pricing from '../components/ui/Pricing/Pricing';
import { createClient } from '../utils/supabase/server';

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { NextUIProvider } from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from "next-themes";
config.autoAddCss = false;

export default async function PricingPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

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
  // @ts-ignore
  return (
    <NextUIProvider>
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
      />
      </NextThemesProvider>
    </NextUIProvider>
  );
}
