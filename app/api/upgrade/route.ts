import axios from 'axios';
import { manageSubscriptionStatusChange } from '@/utils/supabase/admin';
import process from 'process';

export async function POST(req: Request) {
  const body = await req.json();
  let base_url = "https://api.paddle.com";
  if (process.env.PADDLE_ENV){
    base_url = "https://sandbox-api.paddle.com";
  }
  let data = JSON.stringify({
    "items": [
      {
        "price_id": body.price_id,
        "quantity": 1
      }
    ],
    "proration_billing_mode": "full_next_billing_period"
    // "proration_billing_mode": "prorated_immediately"
  });
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: base_url+'/subscriptions/'+body.subscription_id,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+process.env.PADDLE_API_KEY
    },
    data : data
  };
  try {
    const response = await axios.request(config);
    if (response.data.data.status === 'active'){
      await manageSubscriptionStatusChange(
        response.data.data.id,
        response.data.data.customer_id as string,
        body.uuid,
        true
      );
      return new Response(JSON.stringify({ success: true }));
    }

  }catch (e) {
    console.log(e);
  }
  return new Response(JSON.stringify({ success: false }));
}