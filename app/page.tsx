import Pricing from '../components/ui/Pricing/Pricing';
import { createClient } from '../utils/supabase/server';

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

  const { data: products,error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    // .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });
  if (error) {
    console.log(error);
  }
  console.log(products);
  // @ts-ignore
  return (
    <Pricing
      user={user}
      // @ts-ignore
      products={products ?? []}
      subscription={subscription}
    />
  );
}
