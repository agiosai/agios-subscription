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
  console.log("Pricing");
  console.log(subscription);

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
    useState<BillingInterval>('year');
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
      description: '• Advanced Research\n• Task Execution\n• Problem Solving\n• Strategic Insights',
      basic: true,
      pro: true,
    },
    {
      feature: 'Automated Web Task Handler',
      description: 'Seamlessly interacts with third-party tools for expanded functionalities.',
      basic: false,
      pro: true,
    },
    {
      feature: 'Pre-scheduled Unmanned Work Handler',
      description: "Allow AGI to perform tasks when you are not around. Delegate tomorrow's tasks today. AGIOS operates autonomously, ensuring your projects continue advancing even while you sleep, optimizing productivity 24/7.",
      basic: false,
      pro: true,
    },
    {
      feature: 'Self Secretarial Services',
      description: 'Automate booking, purchases, and reservations effortlessly.',
      basic: false,
      pro: true,
    },
    {
      feature: 'Vision Intelligence Quality',
      description: 'Interprets and solves problems within visual contexts, ensuring precise and insightful visual data analysis.',
      basic: false,
      pro: false,
    },
    {
      feature: 'Interactive Conversation Mode',
      description: 'An engaging dialogue system facilitates fluid, human-like conversations.',
      basic: true,
      pro: true,
    },
    {
      feature: 'PC Control - Experimental',
      description: 'Controls and utilizes installed applications directly through voice commands or typed input.',
      basic: false,
      pro: true,
    },
    {
      feature: 'Work Delegation',
      description: 'AGI OS can operate autonomously to perform tasks such as content creation, posting, operations, and data analysis, optimizing productivity without constant user input on autopilot.',
      basic: true,
      pro: true,
    },
    {
      feature: 'Autonomous Research Capabilities',
      description: 'Conducts thorough research quickly and accurately, pulling from extensive databases and using sophisticated data analysis techniques.',
      basic: true,
      pro: true,
    },
    {
      feature: 'On-Screen Support Advisor',
      description: 'Provides real-time on-screen guidance, offering expert assistance with any content displayed on your screen.',
      basic: false,
      pro: true,
    },
    {
      feature: 'Automated Interaction with Other AI apps',
      description: 'Interacts with other leading AI web tools like Suno, Invidio, Writesonic, and ChatGPT, creating a unified and powerful AI ecosystem on your behalf.',
      basic: false,
      pro: true,
    },
    {
      feature: 'Swarm Intelligence',
      description: 'Utilize the collective power of multiple AI agents working together to streamline task execution.',
      basic: true,
      pro: true,
    },
    {
      feature: 'Sequential Task Processing',
      description: 'Tackles complex projects by segmenting them into manageable actions, streamlining your workflow and enhancing overall task completion efficiency.',
      basic: true,
      pro: true,
    },
    {
      feature: 'Permanent Private Memory',
      description: 'Fractal SPR (Sparse Priming Representation) is a groundbreaking memory organization technique that empowers AGI OS to remember past interactions, learn from user preferences, and personalize the user experience.',
      basic: true,
      pro: true,
    },
    {
      feature: 'Data Privacy',
      description: 'Your interaction history with AGI OS remains on your local PC, ensuring complete privacy. ',
      basic: true,
      pro: true,
    },
  ];

  const faqs = [
    {
      question: "What is AGI OS?",
      answer: "AGI OS is an advanced Artificial General Intelligence Agent designed to enhance efficiency and automate a vast range of tasks. Our technology aims to support businesses of all sizes, helping increase efficiency and productivity while significantly reducing time and cost. Our mission is to empower professionals across various sectors with smart, efficient solutions that support their work, enhance their capabilities, and drive success."
    },
    {
      question: "What makes AGI OS different from other AI assistants?",
      answer: "AGI OS goes beyond basic AI assistants by offering advanced research capabilities, and autopilot functionality. It’s like having a personal AI workforce at your fingertips, without the need for typing."
    },
    {
      question: "How does using AGI OS save me time and money compared to traditional methods?",
      answer: "AGI OS automates a vast range of repetitive and complex computer tasks, allowing businesses to reduce the need for extensive manpower, thereby cutting labor costs. By deploying AGI OS, businesses can either augment their human workforce, enhancing their productivity, or in some cases, replace manual roles with automated systems, thereby accelerating project timelines and decreasing overhead expenses."
    },
    {
      question: "What are the limitations of AGI OS?",
      answer: 
      "It might occasionally produce inaccurate responses. However, the accuracy of task performance is constantly being enhanced with frequent updates."
    },
    {
      question:"",
      answer: 
      "Because automated web browsing is an experimental technology, execution of tasks may encounter failures due to existing technological constraints."
    },
    {
      question:"",
      answer: 
      "Currently, AGI OS cannot access local files on your computer. This capability is expected to be added in our next update."
    },
    {
      question: "What are the differences between AGI OS and Human Workers?",
      answer: "Speed and Efficiency: AGI OS can process information and execute tasks much faster than a human, especially for data-intensive jobs. This speed translates to quicker turnaround times for projects."
    },
    {
      question: "",
      answer: "Precision: With the ability to analyze vast amounts of data without fatigue, AGI OS reduces the likelihood of errors that are more common with human handling, particularly in data-intensive fields like analytics."
    },
    {
      question: "",
      answer: "Cost-Effectiveness: Once implemented, AGI OS can perform multiple roles that would otherwise require several employees, thus significantly reducing staffing expenses related to wages, benefits, and insurance. This allows your business to allocate resources more efficiently and increase profitability."
    },
    {
      question: "",
      answer: "Emotional Economy Advantage: AGI OS eliminates the need to navigate the common workplace challenges associated with human teams, such as motivational issues, dishonesty, slacking, complaints, and potential lawsuits. This stress-free operation allows for a more consistent and reliable workflow. Scalability: Unlike human workers, AGI OS can scale its operations up or down instantly, depending on the demand, without the need for recruitment or training." 
  
    },
      {
      question: "",
      answer: "Scalability: Unlike human workers, AGI OS can scale its operations up or down instantly, depending on the demand, without the need for recruitment or training."
    },
    {
      question: "",
      answer: "Availability: AGI OS operates 24/7 without breaks, vacations, or downtime, providing constant productivity that's unmatched by human counterparts."
    },
    {
      question: "What work can AGI OS take over?",
      answer: "Capable of taking over various roles traditionally filled by human employees such as:"
    },
    {
      question: "",
      answer: "Marketing Department Work: Continuously promotes products online, optimizing campaigns in real time to maximize reach and engagement."
    },
    {
      question: "",
      answer: "Creative Content Generation Work: Utilizes advanced AI to produce innovative and engaging content across various media, supporting creative projects with endless possibilities."
    },
    {
      question: "",
      answer: "Research and Development Work: Streamlines the collection and analysis of extensive data sets, speeding up research processes and delivering insights faster than conventional methods."
    },
    {
      question: "",
      answer: "Problem Solving Work: Provides immediate, intelligent solutions for challenges encountered during tasks, enhancing decision-making processes across all levels of operation."
    },
    {
      question: "",
      answer: "Secretarial Services Work: Simplifies tasks such as booking, purchasing, and making reservations through automation."
    },
    {
      question: "What tasks can I accomplish with AGI OS?",
      answer: "Marketing Automation: AGI OS can automate your entire digital marketing workflow, from scheduling and posting content on social media to engaging with customers through comments. It can also create diverse marketing content, including articles, blogs, and ad copy, tailored to your audience's preferences with its permanent private memory, enhancing your brand's reach and engagement."
    },
    {
      question: "",
      answer: "Bulk Data Processing: For tasks that require handling large volumes of data, AGI OS can process and analyze information quickly and efficiently. Whether it's sorting through customer data, analyzing market trends, or preparing reports, AGI OS manages these tasks with precision, saving hours of manual labor."
    },
    {
      question: "",
      answer: "Continuous Information Processing: AGI OS is ideal for jobs that require continuous data monitoring and processing. From real-time analytics to ongoing project management updates, it ensures that your business leverages the most current data without delay."
    },
    {
      question: "",
      answer: "Autonomous Research and Analysis task: AGI OS can autonomously analyze complex data displayed on your screen. For example, you could instruct it to: 'Analyze the data on the screen, research the success factors of the top three brands, and summarize the findings in Notepad.' This capability makes AGI OS particularly useful for detailed and continuous research tasks."
    },
    {
      question: "",
      answer: "The full suite of AGI OS services is continually evolving, with new features being regularly introduced. Stay updated on release dates and access information by signing up for notifications on our blog."
    },
    {
      question: "How does AGI OS work?",
      answer: "AGI OS utilizes state-of-the-art AI technology to perform computer-based tasks autonomously. Simply communicate your instructions with AGI OS using its conversational text or voice interface, and it executes these using the most relevant group intelligence. web services or applications. AGI OS learns from your preferences through permanent fractal memory retention and adjusts its functions to better align with your specific needs. This technology represents a significant advancement in AI, moving beyond mere information retrieval and content generation to full-scale task automation and delegation."
    },
    {
      question: "What operating systems is AGI OS compatible with?",
      answer: "AGI OS is currently compatible with Windows 10 and Windows 11, with plans to expand to Mac and Linux operating systems in the near future."
    },
    {
      question: "Does AGI OS require a specific browser to operate?",
      answer: "Yes, AGI OS is currently compatible only with Google Chrome. To ensure full functionality, please install and use Google Chrome as your browser when working with AGI OS."
    },
    {
      question: "Is AGI OS currently in beta version?",
      answer: "Yes, the current version of AGI OS software is a beta release. This early version is available for users to test and provide feedback on its functionalities and performance. During this beta phase, we are actively refining features and addressing any issues to improve the software before its final release. Your feedback and insights are valuable to us and can significantly contribute to the development process."
    },
    {
      question: "What languages does AGI OS support?",
      answer: "Currently, AGI OS supports only English. We are committed to broadening our language capabilities and plan to include additional languages in future updates to accommodate a global user base."
    },
    {
      question: "What should I do if my AGI OS Automated Web Task Handler isn't working?",
      answer: "If the automation features are not functioning correctly, please ensure all Google Chrome browsers are completely closed. After closing your Chrome browsers, repeat your command and try using the Autopilot Mode again. This reset often resolves temporary issues affecting the automation features."
    },
    {
      question: "How much does AGI OS cost?",
      answer: "AGI OS offers flexible pricing plans to suit the needs of both individual users and businesses. For more details on pricing and licensing options, please visit the pricing page."
    },
    {
      question: "How does AGI OS use my data?",
      answer: "AGI OS operates with a commitment to ensuring the privacy and security of your data. Unlike other AI systems that might store information on cloud servers, AGI OS keeps all user data localized on your own device. This approach means your data is never collected by our servers, providing an added layer of privacy and security. However, it's important to note that the permanent memory stored by AGI OS, powered by Fractal Permanent Memory, resides solely on your computer. This memory develops a personalized user experience by adapting to your preferences and usage patterns over time, effectively giving AGI OS a unique 'personality'. While this enhances your interaction with AGI OS, it also means that data loss could occur if your device is compromised. We strongly recommend regular backups to safeguard your data. To learn more, read our Privacy Policy."
    },
    {
      question: "How can I learn more about AGI OS?",
      answer: "To delve more into AGI OS and its functions, please visit our blog. If you have specific questions or require additional support, feel free to contact us via our Technical Support Form at any time. We’re excited to show you how AGI OS can transform your daily operations and workflow."
    },
    {
      question: "How do I get started with AGI OS?",
      answer: "To begin using AGI OS, simply visit agios.live and create an account. If you encounter configuration issues or need additional support, our team is available to assist you via email at support@agios.live."
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

  const sortedProducts = [...products].sort((a, b) => {
    const aPrice = a.prices.find((price) => price.interval === 'month')?.unit_amount || 0;
    const bPrice = b.prices.find((price) => price.interval === 'month')?.unit_amount || 0;
    return aPrice - bPrice;
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
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', textAlign: 'center' }}>
              Meet Your New Hire: An All-Purpose AI Employee
            </h1>
            <h2 style={{ fontSize: '4rem', fontWeight: '800', color: 'white', textAlign: 'center' }}>
              Making Every Day a Little Less 'Do It Yourself'
            </h2>
            <p style={{ maxWidth: '40rem', margin: '1.25rem auto', fontSize: '1.25rem', color: '#b0b0b0', textAlign: 'center', lineHeight: '1.5' }}>
            AGI OS serves as the first non-human multi-purpose digital agent that actually performs tasks on your behalf. Ideal for professionals across all sectors, start automating a broad spectrum of tasks, enhancing efficiency and accelerating business growth. 


            </p>
          </div>
          <div style={{ container: 'mx-auto', padding: '0 1.5rem', marginBottom: '4rem' }}>
            <Table aria-label="Feature Comparison Table">
              <TableHeader>
                <TableColumn width="33%" align="center" style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', color: '#fff', background: '#312D5E' }}>Feature</TableColumn>
                <TableColumn width="33%" align="center" style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', color: '#fff', background: '#312D5E' }}>Basic</TableColumn>
                <TableColumn width="33%" align="center" style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', color: '#fff', background: '#312D5E' }}>Premium</TableColumn>
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
          <div className="relative self-center mt-6 rounded-lg flex sm:mt-8" style={{ marginBottom: '4rem', background: '#433D8150' }}>
            {intervals.includes('month') && (
              <button
                onClick={() => {
                  setBillingInterval('month');
                  countPackages('month');
                }}
                type="button"
                className={`${billingInterval === 'month' ? 'text-white bg-[#433D81]' : 'text-gray-400'}`}
                style={{ width: '50%', padding: '0.5rem 1rem', margin: '0.25rem', fontSize: '1.5rem', fontWeight: '700', border: 'none', borderRadius: '0.375rem' }}
              >
                Monthly Billing
              </button>
            )}
            {intervals.includes('year') && (
              
              <button
  onClick={() => {
    setBillingInterval('year');
    countPackages('year');
  }}
  type="button"
  className={`${billingInterval === 'year' ? 'text-white bg-[#433D81]' : 'text-gray-400'}`}
  style={{
    width: '50%',
    padding: '0.5rem 1rem',
    margin: '0.25rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    border: 'none',
    borderRadius: '0.375rem',
    position: 'relative'
  }}
>
  Yearly Billing
  <span
    style={{
      position: 'absolute',
      top: '-10px',
      right: '-10px',
      backgroundColor: '#ff4785',
      color: 'white',
      borderRadius: '5%',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: '700'
    }}
  >
    Save 20% for a limited time only
  </span>
</button>

            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ container: 'mx-auto', padding: '0 1.5rem', marginBottom: '4rem' }}>
            <div style={{ verticalAlign: 'baseline' }}>
              {sortedProducts.map((product) => {
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
                    <CheckoutButton priceId={price.id} subscription={subscription} user={user} isTopup={false} upackage={product.name} amount={priceString} cycle={price.interval} />
                  </div>
                );
              })}
            </div>
            <div style={{ verticalAlign: 'baseline' }}>
              {sortedProducts.map((product) => {
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
                    <CheckoutButton priceId={price.id} subscription={subscription} user={user} isTopup={false} upackage={product.name} amount={priceString} cycle={price.interval} />
                  </div>
                );
              })}
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-lg" style={{ alignContent: 'center', justifyContent: 'center', verticalAlign: 'middle', marginBottom: '4rem', padding: '0 1rem', background: 'linear-gradient(90deg, rgba(41,38,64,1) 0%, rgba(126,113,245,1) 100%)' }}>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '600', color: 'white' }}>Boost Your Workflow with AGI OS</h1>
              <p style={{ textAlign: 'justify', margin: '1.25rem 0' }}>
                Embrace the future of productivity with AGI OS—your ultimate autonomous assistant. 
                </p>
                <p style={{ textAlign: 'justify', margin: '1.25rem 0' }}>
                AGI OS revolutionizes your workday, automating complex tasks from data analysis to project management with intuitive expertise, significantly reducing time and costs compared to traditional human labor. With AGI OS, boost your productivity, streamline your operations, and unlock your project’s full potential.
              </p>
              <button
                className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-6 min-w-24 h-12 text-medium gap-3 rounded-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover w-full md:h-11 md:w-auto"
                style={{ backgroundColor: '#ff4785', color: '#fff', transition: 'transform 0.2s' }}
                onClick={() => window.location.href = 'https://subscription.agios.live/signin/signup'}
              >
                Get your All-Purpose AI Employee
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
