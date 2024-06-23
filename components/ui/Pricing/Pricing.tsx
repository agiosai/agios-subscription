'use client';
import LogoCloud from '../../../components/ui/LogoCloud';
import type { Tables } from '../../../types_db';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CheckoutButton from '../../../components/ui/CheckoutButton/CheckoutButton';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  getKeyValue,
  Spacer, Button
} from '@nextui-org/react';
import Image from 'next/image';
import { Container } from 'postcss';
import { Grid } from 'lucide-react';
import { Card, CardBody } from '@nextui-org/card';

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
  console.log("products",products);
  const columns = [
    {name: "", uid: "type"},
    {name: "Basic", uid: "basic"},
    {name: "Pro", uid: "pro"},
  ];
  const data = [
    {
      feature: 'Core AI Capabilities',
      description: '• Problem Solving\n• Dynamic Content Generation\n• Strategic Insights\n• Coding Assistance\n• Research',
      basic: true,
      pro: true,
    },
    {
      feature: 'Interactive Conversation Mode',
      description: 'An engaging dialogue system facilitates fluid, human-like conversations, making interactions with AGI OS as natural as speaking to a personal assistant.',
      basic: true,
      pro: true,
    },
    {
      feature: 'Camera Assistance',
      description: 'AGI OS’ visual recognition utilizes your PC’s camera for various tasks like scanning documents, recognizing objects, or even participating in video conferences with enhanced AI-driven insights.',
      basic: true,
      pro: true,
    },
    {
      feature: 'Autoweb Integration',
      description: 'Seamlessly interacts with third-party AI tools for expanded functionalities like video editing, music generation, and more.',
      basic: true,
      pro: true,
    },
    {
      feature: 'Secretarial Services',
      description: 'Automate booking, purchases, and reservations effortlessly.',
      basic: true,
      pro: true,
    },
    {
      feature: 'PC Control',
      description: 'Controls and utilizes installed applications like Notepad and Office tools directly through voice commands or typed input. A cohesive experience that blends AGI OS capabilities with your desktop environment for streamlined operations.',
      basic: true,
      pro: true,
    },
    {
      feature: 'Permanent Private Memory',
      description: 'Fractal SPR (Sparse Priming Representation) is a groundbreaking memory organization technique that empowers AGI OS to remember past interactions, learn from user preferences, and personalize the user experience continuously.',
      basic: true,
      pro: true,
    },
    {
      feature: 'On-Screen Assistance',
      description: 'Provides real-time assistance with anything displayed on your screen, from explaining software functions to helping navigate complex interfaces.',
      basic: false,
      pro: true,
    },
    {
      feature: 'Advanced Research Capabilities',
      description: 'Conducts thorough research quickly and accurately, pulling from extensive databases and using sophisticated data analysis techniques.',
      basic: false,
      pro: true,
    },
    {
      feature: 'Autopilot Work Mode',
      description: 'AGI OS can operate autonomously to perform tasks such as content creation, scheduling, posting, operations, and data analysis, optimizing productivity without constant user input.',
      basic: false,
      pro: true,
    },
  ];

  const faqs = [
    {
      question: "What is AGI OS?",
      answer: "AGI OS is an advanced Artificial General Intelligence software designed to enhance efficiency and automate a vast range of tasks. Our technology supports professionals across various sectors, helping increase efficiency and productivity. AGI OS integrates seamlessly with your existing systems to act as your personal digital assistant."
    },
    {
      question: "What operating systems is AGI OS compatible with?",
      answer: "AGI OS is currently compatible with Windows 10 and Windows 11, with plans to expand to Mac and Linux operating systems in the future."
    },
    {
      question: "Does AGI OS require a specific browser to operate?",
      answer: "Yes, AGI OS is currently compatible only with Google Chrome. To ensure full functionality, please install and use Google Chrome as your browser when working with AGI OS."
    },
    {
      question: "How does AGI OS work?",
      answer: "AGI OS utilizes state-of-the-art AI technology to perform computer-based tasks autonomously. Simply communicate your instructions with AGI OS using its conversational text or voice interface, and it executes these using the most relevant web services or applications. AGI OS learns from your preferences through memory retention and adjusts its functions to better align with your specific needs. This technology represents a significant advancement in AI, moving beyond mere information retrieval and content generation to full-scale task automation and delegation."
    },
    {
      question: "Is AGI OS currently in beta version?",
      answer: "Yes, the current version of AGI OS software is a beta release. This early version is available for users to test and provide feedback on its functionalities and performance. During this beta phase, we are actively refining features and addressing any issues to improve the software before its final release. Your feedback and insights are valuable to us and can significantly contribute to the development process."
    },
    {
      question: "Do I need to keep the black command window open while using AGI OS?",
      answer: "Yes, it's essential to keep the black command window open while AGI OS is running. This window displays real-time updates on the software’s operations, such as task processing and credit updates, which are crucial for monitoring the program’s status. It also provides important alerts that may require your attention, such as when AGI OS needs to be restarted. This is particularly important when using the beta version of AGI OS, as it ensures that you are informed of any essential actions needed to maintain smooth operation."
    },
    {
      question: "What makes AGI OS different from other AI assistants?",
      answer: "AGI OS goes beyond basic AI assistants by offering advanced research capabilities, seamless computer integration, and autopilot functionality. It’s like having a personal AI workforce at your fingertips, without the need for typing."
    }
  ];
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
              Meet Your New Hire: An Autonomous Workforce
            </h1>
            <h2 className="text-3xl font-extrabold text-white sm:text-center sm:text-4xl">Tailored Plans for Every Ambition</h2>
            <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
              Designed to integrate seamlessly with your existing systems, AGI OS serves as a dynamic personal digital assistant. Ideal for professionals across all sectors, this tool allows you to automate a broad spectrum of tasks, enhancing efficiency and accelerating business growth.
              AGI OS integrates seamlessly with your existing systems to act as your personal digital assistant. Our product is designed to enhance efficiency and productivity, supporting professionals across various sectors. Automate a vast range of tasks and accelerate your business growth with AGI OS.
              Mac Compatibility: Coming Soon

            </p>
            <div className="container mx-auto px-4 md:px-6">
              <Table
                aria-label="Feature Comparison Table"
              >
                <TableHeader>
                  <TableColumn>Feature</TableColumn>
                  <TableColumn width="33%" align={"center"} style={{textAlign:"center"}}>Basic</TableColumn>
                  <TableColumn width="33%" align={"center"} style={{textAlign:"center"}}>Pro</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>{item.feature}</div>
                        <div>{item.description.split('\n').map((line, i) => (
                          <span key={i}>{line}<br/></span>
                        ))}</div>
                      </TableCell>
                      <TableCell style={{textAlign:"center"}}>
                        {item.basic ? <Image src="/true.png" width={0} height={0} sizes="100vw" alt="Windows Logo"
                                             style={{ width: '55px', height: '100%',marginLeft:'auto',marginRight:'auto' }} /> : <Image src="/false.png" width={0} height={0} sizes="100vw" alt="Windows Logo"
                                                                                                   style={{ width: '55px', height: '100%',marginLeft:'auto',marginRight:'auto' }} />}
                      </TableCell>
                      <TableCell style={{textAlign:"center"}}>
                        {item.pro ? <Image src="/true.png" width={0} height={0} sizes="100vw" alt="Windows Logo"
                                           style={{ width: '55px', height: '100%',marginLeft:'auto',marginRight:'auto' }} /> : <Image src="/false.png" width={0} height={0} sizes="100vw" alt="Windows Logo"
                                                                                                 style={{ width: '55px', height: '100%',marginLeft:'auto',marginRight:'auto' }} />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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

            <div className="">
              <div className="container mx-auto px-4 md:px-6">
                {/*<div className="mt-8 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">*/}
                {/*{products.map((product) => {*/}
                {/*  console.log(product?.prices[0].interval);*/}
                {/*  const price = product?.prices?.find(*/}
                {/*    (price) => price.interval === billingInterval*/}
                {/*  );*/}
                {/*  if (!price) return null;*/}
                {/*  if (product.type !== billingType) {*/}
                {/*    return null;*/}
                {/*  }*/}
                {/*  const priceString = new Intl.NumberFormat('en-US', {*/}
                {/*    style: 'currency',*/}
                {/*    currency: price.currency!,*/}
                {/*    minimumFractionDigits: 0*/}
                {/*  }).format((price?.unit_amount || 0));*/}
                {/*  return (*/}
                {/*    <div*/}
                {/*      key={product.id}*/}
                {/*      className={cn(*/}
                {/*        'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',*/}
                {/*        {*/}
                {/*          'border border-pink-500': subscription*/}
                {/*            ? price.id === subscription?.price_id*/}
                {/*            : product.name === 'Freelancer'*/}
                {/*        },*/}
                {/*        'flex-1', // This makes the flex item grow to fill the space*/}
                {/*        'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width*/}
                {/*        'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large*/}
                {/*      )}*/}
                {/*    >*/}
                {/*      <div className="p-6 items-center text-center">*/}
                {/*        <h2 className="text-2xl font-semibold leading-6 text-white">*/}
                {/*          {product.name}*/}
                {/*        </h2>*/}
                {/*        <p className="mt-4 text-zinc-300">{product.description}</p>*/}
                {/*        <p className="mt-8">*/}
                {/*      <span className="text-5xl font-extrabold white">*/}
                {/*        {priceString}*/}
                {/*      </span>*/}
                {/*          <span className="text-base font-medium text-zinc-100">*/}
                {/*        /{price.interval}*/}
                {/*      </span>*/}
                {/*        </p>*/}
                {/*        /!*<Button*!/*/}
                {/*        /!*  variant="slim"*!/*/}
                {/*        /!*  type="button"*!/*/}
                {/*        /!*  loading={priceIdLoading === price.id}*!/*/}
                {/*        /!*  onClick={() => handleStripeCheckout(price)}*!/*/}
                {/*        /!*  className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"*!/*/}
                {/*        /!*>*!/*/}
                {/*        /!*  {subscription ? 'Manage' : 'Subscribe'}*!/*/}
                {/*        /!*</Button>*!/*/}
                {/*        <CheckoutButton priceId={price.id} subscription={subscription} user={user} isTopup={false} upackage={product.name} amount={priceString} cycle={price.interval}/>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  );*/}
                {/*})}*/}
                {/*</div>*/}

                <div
                  className="mt-8 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                  <Table
                    aria-label="Feature Comparison Table"
                  >
                    <TableHeader>
                      <TableColumn width="50%" align={'center'} style={{ textAlign: 'center' }}>Basic</TableColumn>
                      <TableColumn width="50%" align={'center'} style={{ textAlign: 'center' }}>Pro</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ alignContent: 'baseline' }}>
                          {products.map((product) => {
                            console.log(product?.prices[0].interval);
                            const price = product?.prices?.find(
                              (price) => price.interval === billingInterval
                            );
                            if (!price) return null;
                            if (product.type !== 'basic') {
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
                                style={{ marginTop: '10px' }}
                                className={cn(
                                  'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                                  {
                                    'border border-pink-500': subscription
                                      ? price.id === subscription?.price_id
                                      : product.name === 'Freelancer'
                                  },
                                  'flex-1', // This makes the flex item grow to fill the space
                                  'basis-1/3' // Assuming you want each card to take up roughly a third of the container's width
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
                                  <CheckoutButton priceId={price.id} subscription={subscription} user={user}
                                                  isTopup={false} upackage={product.name} amount={priceString}
                                                  cycle={price.interval} />
                                </div>
                              </div>
                            );
                          })}
                        </TableCell>
                        <TableCell style={{ alignContent: 'baseline' }}>
                          {products.map((product) => {
                            console.log(product?.prices[0].interval);
                            const price = product?.prices?.find(
                              (price) => price.interval === billingInterval
                            );
                            if (!price) return null;
                            if (product.type !== 'pro') {
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
                                style={{ marginTop: '10px' }}
                                className={cn(
                                  'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                                  {
                                    'border border-pink-500': subscription
                                      ? price.id === subscription?.price_id
                                      : product.name === 'Freelancer'
                                  },
                                  'flex-1', // This makes the flex item grow to fill the space
                                  'basis-1/3' // Assuming you want each card to take up roughly a third of the container's width
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
                                  <CheckoutButton priceId={price.id} subscription={subscription} user={user}
                                                  isTopup={false} upackage={product.name} amount={priceString}
                                                  cycle={price.interval} />
                                </div>
                              </div>
                            );
                          })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <br />
                <h2 className="text-2xl font-extrabold text-white sm:text-center sm:text-3xl">Frequently Asked
                  Questions</h2>
                <Spacer y={1} />
                {faqs.map((faq, index) => (
                  <div key={index} style={{ marginTop: '10px' }}>
                    <h4 className="text-xs font-semibold text-white sm:text-3xl">{faq.question}</h4>
                    <p style={{ marginTop: '10px', textAlign: 'justify' }}>{faq.answer}</p>
                    <hr style={{ marginTop: '10px' }} />
                    <Spacer y={1} />
                  </div>
                ))}
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <div className="grid grid-cols-2" style={{alignContent:'center', justifyContent:'center',verticalAlign:'middle'}}>
                  <div>
                    <h3 className="text-2xl font-semibold text-white sm:text-3xl">Boost Your Workflow with AGI OS</h3>
                    <br/>
                    <br/>
                    <br/>
                    <p style={{textAlign:'justify',marginRight:'20px'}}>
                      Embrace the future of productivity with AGI OS—your ultimate autonomous assistant.

                      AGI OS revolutionizes your workday, automating complex tasks from data analysis to project management with intuitive expertise. With AGI OS, boost your productivity, streamline your tasks, and unleash your business's potential.
                    </p>
                    <br/>
                    <br/>
                    <br/>
                    <button className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-6 min-w-24 h-12 text-medium gap-3 rounded-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover w-full md:h-11 md:w-auto">Get your digital companion</button>
                  </div>
                  <div className="">
                    <img src="https://via.placeholder.com/500" alt="Placeholder" style={{ width: '100%' }} /></div>
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
