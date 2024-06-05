import CustomerPortalForm from '../../components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '../../components/ui/AccountForms/EmailForm';
import NameForm from '../../components/ui/AccountForms/NameForm';
import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';
import Topup from '../../components/ui/AccountForms/Topup';
import Download from '@/components/ui/AccountForms/Download';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import process from 'process';
import UpdatePayment from '@/components/ui/UpdatePayment/UpdatePayment';

let paddleEnv = {
  environment: Environment.production
}

if (process.env.PADDLE_ENV === 'sandbox'){
  paddleEnv = {
    environment: Environment.sandbox
  }
}
// @ts-ignore
const paddle = new Paddle(process.env.PADDLE_API_KEY,paddleEnv);

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
    // @ts-ignore
    .eq('id', user?.id)
    .single();
  console.log("USER");
  console.log(userDetails);

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();
// @ts-ignore
  const paddlesubscription = subscription? await paddle.subscriptions.get(subscription?.id):null;

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
            Personalize your AGI OS and manage your account with ease.
          </p>
        </div>
      </div>
      <div className="p-4">
        {/*{JSON.stringify(paddlesubscription)}*/}
        <CustomerPortalForm subscription={subscription} points={userDetails? userDetails.points:null} paddlesubscription={JSON.parse(JSON.stringify(paddlesubscription))}/>
        {
          subscription?
            <Download/>
          :<></>
        }

        <NameForm userName={user?.user_metadata.full_name ?? ''} />
        <EmailForm userEmail={user.email} />
      </div>
    </section>
  );
}
