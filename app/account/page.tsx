import CustomerPortalForm from '../../components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '../../components/ui/AccountForms/EmailForm';
import NameForm from '../../components/ui/AccountForms/NameForm';
import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';
import Topup from '../../components/ui/AccountForms/Topup';
import Download from '@/components/ui/AccountForms/Download';

export default async function Account() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  console.log("userNiro");
  console.log(user?.user_metadata.full_name);

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  console.log("USER");
  console.log(userDetails);

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  // @ts-ignore
  const { data: products,productError } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    // .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  if (error) {
    console.log(error);
  }

  if (!user) {
    return redirect('/signin');
  }

  // @ts-ignore
  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            We partnered with Paddle for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm subscription={subscription} points={userDetails? userDetails.points:null}/>
        {/*{*/}
        {/*  subscription?*/}
        {/*    <Topup products={products} subscription={subscription} user={user}/>*/}
        {/*  :<></>*/}
        {/*}*/}
        <Download/>
        <NameForm userName={user?.user_metadata.full_name ?? ''} />
        <EmailForm userEmail={user.email} />
      </div>
    </section>
  );
}
