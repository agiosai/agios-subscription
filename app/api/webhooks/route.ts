import Stripe from 'stripe';
// import { stripe } from '@/utils/stripe/config';
// import { Paddle, EventName } from '@paddle/paddle-node-sdk'
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  deleteProductRecord,
  deletePriceRecord, topupCustomer
} from '@/utils/supabase/admin';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import * as process from 'process';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'subscription.activated',
  'transaction.completed'
]);
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

export async function POST(req: Request) {
  const body = await req.text();
  const bodyObj = JSON.parse(body);
  const sig = req.headers.get('paddle-signature') as string;
  const secretKey = process.env.PADDLE_WEBHOOK_KEY;
  // let eventData = bodyObj;
  let eventData;

  try {
    if (!sig || !secretKey)
      return new Response('Webhook secret not found.', { status: 400 });
    eventData = paddle.webhooks.unmarshal(body, secretKey, sig);
    console.log(`🔔  Webhook received: ${eventData?.eventType}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
// console.log(eventData.event_type);
  // @ts-ignore
  // if (true) {
  if (relevantEvents.has(eventData.eventType)) {
    try {
      // @ts-ignore
      switch (eventData.eventType) {
        case 'product.created':
          const product = bodyObj.data;
          await upsertProductRecord(product);
          break;
        case 'product.updated':
          const upproduct = bodyObj.data;
          await upsertProductRecord(upproduct);
          break;
        case 'price.created':
          let price = bodyObj.data;
          await upsertPriceRecord(price);
          break;
        case 'price.updated':
          let upprice = bodyObj.data;
          await upsertPriceRecord(upprice);
          break;
        // case 'price.deleted':
        //   await deletePriceRecord(event.data.object as Stripe.Price);
        //   break;
        // case 'product.deleted':
        //   await deleteProductRecord(event.data.object as Stripe.Product);
        //   break;
        // case 'customer.subscription.created':
        // case 'customer.subscription.updated':
        // case 'customer.subscription.deleted':
          // const subscription = bodyObj.data;
          // await manageSubscriptionStatusChange(
          //   subscription.id,
          //   subscription.customer as string,
          //   event.type === 'customer.subscription.created'
          // );
          // break;
        case 'transaction.completed':
          const transaction = bodyObj.data;
          if (!transaction.billing_period){
            await topupCustomer(transaction.custom_data.uuid,transaction.items[0].price.id);
          }else {
            await manageSubscriptionStatusChange(
              transaction.subscription_id as string,
              transaction.customer_id as string,
              transaction.custom_data.uuid,
              true
            );
          }
          break;

        case 'subscription.activated':

          break;
        case 'subscription.updated':
          const subscription = bodyObj.data;
          if(subscription?.scheduled_change?.action == 'cancel'){
            await manageSubscriptionStatusChange(
              subscription.id as string,
              subscription.customer_id as string,
              subscription.custom_data.uuid,
              true,
              'Cancelled'
            );
          }
          if(subscription?.status == 'canceled'){
            await manageSubscriptionStatusChange(
              subscription.id as string,
              subscription.customer_id as string,
              subscription.custom_data.uuid,
              true,
              'Cancelled'
            );
          }
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.log(error);
      return new Response(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400
        }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${eventData?.eventType}`, {
      status: 200
    });
  }
  return new Response(JSON.stringify({ received: true }));
}
