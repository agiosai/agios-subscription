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
  type: String;
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

export default function Pricing({ user, products, subscription, features, feature_headers }: Props) {

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
  console.log("features", features);
  console.log("feature_headers", feature_headers);
  console.log("products", products);
  const columns = [
    { name: "Feature", uid: "type" },
    { name: "Basic", uid: "basic" },
    { name: "Pro", uid: "pro" },
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
  const countPackages = (interval: string) => {
    let pro = 0;
    let basic = 0;
    products.map((product) => {
      console.log(product?.prices[0].interval);
      const price = product?.prices?.find(
        (price) => price.interval === interval
      );
      if (price) {
        if (product.type === "basic") {
          pro++;
          setBasicPackCount(pro);
        } else {
          basic++;
          setProPackCount(basic);
        }
      }
    });

  };
  useEffect(() => {
    // call api or anything
    console.log("loaded");
    countPackages(billingInterval);
  });

  if (!products.length) {
    return (
      <section style={{ backgroundColor: 'black' }}>
        <div style={{ maxWidth: '96rem', padding: '2rem 1rem', margin: '0 auto', marginBottom: '4rem', marginTop: '4rem' }}>
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', textAlign: 'center', margin: '0 auto' }}>
            No subscription pricing plans found. Create them in your{' '}
            <a
              style={{ color: '#ff4785', textDecoration: 'underline' }}
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>.
          </p>
        </div>
        <LogoCloud />
      </section>
    );
  } else {
    return (
      <section style={{ backgroundColor: 'black' }}>
        <div style={{ maxWidth: '96rem', padding: '2rem 1rem', margin: '0 auto', marginTop: '4rem' }}>
          <div className="sm:flex sm:flex-col sm:align-center" style={{ marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', textAlign: 'center' }}>
              Meet Your New Hire: An Autonomous Workforce
            </h1>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', textAlign: 'center' }}>
              Tailored Plans for Every Ambition
            </h2>
            <p style={{ maxWidth: '40rem', margin: '1.25rem auto', fontSize: '1.25rem', color: '#b0b0b0', textAlign: 'center', lineHeight: '1.5' }}>
              Designed to integrate seamlessly with your existing systems, AGI OS serves as a dynamic personal digital assistant. Ideal for professionals across all sectors, this tool allows you to automate a broad spectrum of tasks, enhancing efficiency and accelerating business growth.
            </p>
          </div>
          <div style={{ container: 'mx-auto', padding: '0 1.5rem', marginBottom: '4rem' }}>
            <Table aria-label="Feature Comparison Table">
              <TableHeader>
                <TableColumn width="33%" align="center" style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', color: '#fff' }}>Feature</TableColumn>
                <TableColumn width="33%" align="center" style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', color: '#fff' }}>Basic</TableColumn>
                <TableColumn width="33%" align="center" style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', color: '#fff' }}>Pro</TableColumn>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ fontSize: '1.25rem', color: '#b0b0b0', textAlign: 'left', lineHeight: '1.5' }}>
                      <div style={{ color: 'white', fontWeight: '800' }}>{item.feature}</div>
                      <div>{item.description.split('\n').map((line, i) => (
                        <span key={i} style={{ color: '#b0b0b0' }}>{line}<br /></span>
                      ))}</div>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {item.basic ? <Image src="/true.png" width={55} height={55} alt="True Icon" style={{ width: 'auto', height: 'auto', marginLeft: 'auto', marginRight: 'auto' }} /> : <Image src="/false.png" width={55} height={55} alt="False Icon" style={{ width: 'auto', height: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {item.pro ? <Image src="/true.png" width={55} height={55} alt="True Icon" style={{ width: 'auto', height: 'auto', marginLeft: 'auto', marginRight: 'auto' }} /> : <Image src="/false.png" width={55} height={55} alt="False Icon" style={{ width: 'auto', height: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800" style={{ marginBottom: '4rem' }}>
            {intervals.includes('month') && (
              <button
                onClick={() => {
                  setBillingInterval('month');
                  countPackages(billingInterval);
                }}
                type="button"
                className={`${billingInterval === 'month' ? 'bg-gray-700 border-gray-800 text-white' : 'text-gray-400'}`}
                style={{ width: '50%', padding: '0.5rem 1rem', margin: '0.25rem', borderRadius: '0.375rem', fontSize: '1rem', fontWeight: '500' }}
              >
                Monthly Billing
              </button>
            )}
            {intervals.includes('year') && (
              <button
                onClick={() => {
                  setBillingInterval('year');
                  countPackages(billingInterval);
                }}
                type="button"
                className={`${billingInterval === 'year' ? 'bg-gray-700 border-gray-800 text-white' : 'text-gray-400'}`}
                style={{ width: '50%', padding: '0.5rem 1rem', margin: '0.25rem', borderRadius: '0.375rem', fontSize: '1rem', fontWeight: '500' }}
              >
                Yearly Billing
              </button>
            )}
          </div>
          <div style={{ container: 'mx-auto', padding: '0 1.5rem', marginBottom: '4rem' }}>
            <Table id="react-aria8234834984-:r2:" aria-label="Feature Comparison Table">
              <TableHeader>
                <TableColumn width="50%" align="center" style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', color: '#fff' }}>Basic</TableColumn>
                <TableColumn width="50%" align="center" style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', color: '#fff' }}>Pro</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell style={{ verticalAlign: 'baseline' }}>
                    {products.map((product) => {
                      const price = product?.prices?.find(
                        (price) => price.interval === billingInterval
                      );
                      if (!price || product.type !== 'basic') return null;
                      const priceString = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: price.currency!,
                        minimumFractionDigits: 0
                      }).format((price?.unit_amount || 0));
                      return (
                        <div
                          key={product.id}
                          style={{ marginTop: '10px', backgroundColor: '#1a1a1a', borderRadius: '0.375rem', padding: '1.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                        >
                          <h2 style={{ fontSize: '2rem', fontWeight: '600', color: 'white' }}>{product.name}</h2>
                          <p style={{ marginTop: '1rem', color: '#b0b0b0' }}>{product.description}</p>
                          <p style={{ marginTop: '2rem', fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>{priceString}<span style={{ fontSize: '1rem', fontWeight: '500', color: '#d0d0d0' }}>/{price.interval}</span></p>
                          {subscription && subscription.prices?.products?.id === product.id ? (
                            <button
                              disabled
                              style={{
                                backgroundColor: 'gray',
                                color: 'white',
                                cursor: 'not-allowed',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                fontSize: '1rem',
                                fontWeight: '500',
                              }}
                            >
                              Active
                            </button>
                          ) : (
                            <CheckoutButton
                              priceId={price.id}
                              subscription={subscription}
                              user={user}
                              isTopup={false}
                              upackage={product.name}
                              amount={priceString}
                              cycle={price.interval}
                            />
                          )}
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell style={{ verticalAlign: 'baseline' }}>
                    {products.map((product) => {
                      const price = product?.prices?.find(
                        (price) => price.interval === billingInterval
                      );
                      if (!price || product.type !== 'pro') return null;
                      const priceString = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: price.currency!,
                        minimumFractionDigits: 0
                      }).format((price?.unit_amount || 0));
                      return (
                        <div
                          key={product.id}
                          style={{ marginTop: '10px', backgroundColor: '#1a1a1a', borderRadius: '0.375rem', padding: '1.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                        >
                          <h2 style={{ fontSize: '2rem', fontWeight: '600', color: 'white' }}>{product.name}</h2>
                          <p style={{ marginTop: '1rem', color: '#b0b0b0' }}>{product.description}</p>
                          <p style={{ marginTop: '2rem', fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>{priceString}<span style={{ fontSize: '1rem', fontWeight: '500', color: '#d0d0d0' }}>/{price.interval}</span></p>
                          {subscription && subscription.prices?.products?.id === product.id ? (
                            <button
                              disabled
                              style={{
                                backgroundColor: 'gray',
                                color: 'white',
                                cursor: 'not-allowed',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                fontSize: '1rem',
                                fontWeight: '500',
                              }}
                            >
                              Active
                            </button>
                          ) : (
                            <CheckoutButton
                              priceId={price.id}
                              subscription={subscription}
                              user={user}
                              isTopup={false}
                              upackage={product.name}
                              amount={priceString}
                              cycle={price.interval}
                            />
                          )}
                        </div>
                      );
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', textAlign: 'center', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
          <div style={{ marginBottom: '4rem' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ marginTop: '40px', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '10px' }}>{faq.question}</h3>
                <p style={{ marginTop: '10px', textAlign: 'justify', color: '#d0d0d0', marginBottom: '10px' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 rounded-lg" style={{ alignContent: 'center', justifyContent: 'center', verticalAlign: 'middle', marginBottom: '4rem', padding: '0 1rem', background: 'linear-gradient(90deg, rgba(41,38,64,1) 0%, rgba(126,113,245,1) 100%)' }}>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '600', color: 'white' }}>Boost Your Workflow with AGI OS</h1>
              <p style={{ textAlign: 'justify', margin: '1.25rem 0' }}>
                Embrace the future of productivity with AGI OS—your ultimate autonomous assistant. AGI OS revolutionizes your workday, automating complex tasks from data analysis to project management with intuitive expertise. With AGI OS, boost your productivity, streamline your tasks, and unleash your business's potential.
              </p>
              <button className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-6 min-w-24 h-12 text-medium gap-3 rounded-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover w-full md:h-11 md:w-auto" style={{ backgroundColor: '#ff4785', color: '#fff', transition: 'transform 0.2s' }}>
                Get your digital companion
              </button>
            </div>
            <div style={{ padding: '1rem' }}>
              <img src="https://4kwallpapers.com/images/walls/thumbs_3t/2218.png" alt="Windows logo" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '0.375rem' }} />
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
