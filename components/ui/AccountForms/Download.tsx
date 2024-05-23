'use client';

import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { updateName } from '../../../utils/auth-helpers/server';
import { handleRequest } from '../../../utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import { detectOS } from '@/utils/helpers';

export default function Download() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [os, setOS] = useState('');

  useEffect(() => {
    const userOS = detectOS(navigator.userAgent);
    setOS(userOS);
  }, []);


  return (
    <Card
      title="Download AGI OS"
      description=""
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">{os} Detected</p>
          <Button
            variant="slim"
            type="submit"
            form="nameForm"
            loading={isSubmitting}
          >
            Download Here
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <div
          className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          <div className={cn(
            'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
            'flex-1', // This makes the flex item grow to fill the space
            'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
          )}>
            <div className="p-3">
              <p className="mt-4 text-zinc-300"><Image src="/microsoft-svgrepo-com.png" width={0} height={0} sizes="100vw" alt="Windows Logo"
                                                       style={{ width: '100%', height: '100%' }} /></p>
              <p className="mt-4">
                      <span className=" font-bold white">
                        Windows
                      </span>
              </p>
            </div>
          </div>
          <div className={cn(
            'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
            'flex-1', // This makes the flex item grow to fill the space
            'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
          )}>
            <div className="p-3">
              <p className="mt-4 text-zinc-300"><Image src="/apple-svgrepo-com.png" width={0} height={0} sizes="100vw" alt="Windows Logo"
                                                       style={{ width: '100%', height: '100%' }} /></p>
              <p className="mt-4">
                      <span className="font-bold white">
                        Apple (Coming Soon)
                      </span>
              </p>
            </div>
          </div>
          <div className={cn(
            'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
            'flex-1', // This makes the flex item grow to fill the space
            'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
          )}>
            <div className="p-3">
              <p className="mt-4 text-zinc-300"><Image src="/linux-svgrepo-com.png" width={0} height={0} sizes="100vw" alt="Windows Logo"
                                                       style={{ width: '100%', height: '100%' }} /></p>
              <p className="mt-4">
                      <span className="font-bold white">
                        Linux (Coming Soon)
                      </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
