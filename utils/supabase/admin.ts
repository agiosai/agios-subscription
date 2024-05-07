import { toDateTime } from '@/utils/helpers';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Database, Tables, TablesInsert } from 'types_db';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import process from 'process';

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

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const upsertProductRecord = async (product: any) => {
  const productData: Product = {
    id: product.id,
    active: product.status == 'active',
    name: product.name,
    description: product.description ?? null,
    image: product.image_url ?? null,
    metadata: product.custom_data,
    type:product.custom_data.type
  };

  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert([productData]);
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (
  price: any,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product_id === 'string' ? price.product_id : '',
    active: price.status === 'active',
    currency: price.unit_price.currency_code,
    type: price.billing_cycle ? 'recurring':'one_time',
    unit_amount: price.unit_price.amount/100 ?? null,
    interval: price.billing_cycle?.interval ?? null,
    interval_count: price.billing_cycle?.frequency ?? null,
    trial_period_days: price.trial_period?.frequency ?? TRIAL_PERIOD_DAYS,
    points:price.custom_data.points
  };

  const { error: upsertError } = await supabaseAdmin
    .from('prices')
    .upsert([priceData]);

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  } else {
    console.log(`Price inserted/updated: ${price.id}`);
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  const { error: deletionError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', product.id);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);
  console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', price.id);
  if (deletionError) throw new Error(`Price deletion failed: ${deletionError.message}`);
  console.log(`Price deleted: ${price.id}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from('customers')
    .upsert([{ id: uuid, paddle_customer_id: customerId }]);

  if (upsertError)
    throw new Error(`Supabase customer record creation failed: ${upsertError.message}`);

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.paddle_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.paddle_customer_id
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.paddle_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ paddle_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`
        );
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  // const { error: updateError } = await supabaseAdmin
  //   .from('users')
  //   .update({
  //     billing_address: { ...address },
  //     // payment_method: { ...payment_method[payment_method.type] }
  //   })
  //   .eq('id', uuid);
  // if (updateError) throw new Error(`Customer update failed: ${updateError.message}`);
};

const topupCustomer = async (uid: string,price:string) => {
  const {data: userData, error: noUserError} = await supabaseAdmin
    .from('users')
    .select("*")
    .eq('id',uid)
    .single();

  const {data: priceData, error:noPriceDataError} = await supabaseAdmin
    .from('prices')
    .select('*')
    // @ts-ignore
    .eq('id',price)
    .single();
  let points = 0;
  // @ts-ignore
  if (priceData.points == 0){
    points = -1;
  }else if (priceData?.points == -1){
    points = priceData.points;
  }else {
    // @ts-ignore
    points = userData.points + priceData.points;
  }
  console.log("Niro points",points)
  const { error } = await supabaseAdmin
    .from('users')
    //@ts-ignore
    .update({ points:  points})
    .eq('id', uid);
}

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  uid: string,
  createAction = false
) => {
  const upsertedStripeCustomer = await upsertCustomerToSupabase(
    uid,
    subscriptionId
  );
  // Get customer's UUID from mapping table.
  // const { data: customerData, error: noCustomerError } = await supabaseAdmin
  //   .from('customers')
  //   .select('id')
  //   .eq('paddle_customer_id', customerId)
  //   .single();
  // console.log(uid);

  const {data: userData, error: noUserError} = await supabaseAdmin
    .from('users')
    .select("*")
    .eq('id',uid)
    .single();

  // if (noCustomerError)
  //   throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

  const uuid = uid;

  // const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
  //   expand: ['default_payment_method']
  // });
  const subscription = await paddle.subscriptions.get(subscriptionId);


  const {data: priceData, error:noPriceDataError} = await supabaseAdmin
    .from('prices')
    .select('*')
    // @ts-ignore
    .eq('id',subscription.items[0]?.price.id)
    .single();

  const { error:subUpdateErr} = await supabaseAdmin
    .from('subscriptions')
    //@ts-ignore
    .update({ status:  'canceled'})
    .eq('user_id', uid)
  if (subUpdateErr)
    throw new Error(`Subscription insert/update failed: ${subUpdateErr.message}`);

  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    // metadata: subscription.importMeta,
    status: subscription.status,
    // @ts-ignore
    price_id: subscription.items[0]?.price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    // cancel_at_period_end: subscription.canceledAt,
    // cancel_at: subscription.canceledAt
    //   ? toDateTime(subscription.canceledAt).toISOString()
    //   : null,
    // canceled_at: subscription.canceledAt
    //   ? toDateTime(subscription.canceledAt).toISOString()
    //   : null,
    current_period_start: subscription.startedAt??undefined,
    current_period_end: subscription.nextBilledAt??undefined,
    created: subscription.startedAt??undefined,
    ended_at: subscription.canceledAt
      ? subscription.canceledAt
      : null
    // trial_start: subscription.trial_start
    //   ? toDateTime(subscription.trial_start).toISOString()
    //   : null,
    // trial_end: subscription.trial_end
    //   ? toDateTime(subscription.trial_end).toISOString()
    //   : null
  };

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (upsertError)
    throw new Error(`Subscription insert/update failed: ${upsertError.message}`);
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );
  let points = 0;
  // @ts-ignore
  if (priceData.points == 0){
    points = -1;
  }else if (priceData?.points == -1){
    points = priceData.points;
  }else {
    // @ts-ignore
    points = userData.points + priceData.points;
  }
  console.log("Niro points",points)
  const { error } = await supabaseAdmin
    .from('users')
    //@ts-ignore
    .update({ points:  points})
    .eq('id', uid)
  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  // if (createAction && subscription.default_payment_method && uuid)
  //   //@ts-ignore
  //   await copyBillingDetailsToCustomer(
  //     uuid,
  //     subscription.default_payment_method as Stripe.PaymentMethod
  //   );
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  topupCustomer
};
