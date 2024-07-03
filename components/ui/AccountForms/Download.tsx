'use client';

import Card from '../../../components/ui/Card';
import { updateName } from '../../../utils/auth-helpers/server';
import { handleRequest } from '../../../utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import { detectOS } from '@/utils/helpers';
import Button from '@/components/ui/Button';

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
          {/*<p className="pb-4 sm:pb-0">{os} Detected</p>*/}
          {/*<Button*/}
          {/*  variant="slim"*/}
          {/*  type="submit"*/}
          {/*  form="nameForm"*/}
          {/*  loading={isSubmitting}*/}
          {/*>*/}
          {/*  Download Here*/}
          {/*</Button>*/}
        </div>
      }
    >
      <div className="mt-6 mb-4 text-xl font-semibold">
        <div
          className="mt-8 space-y-4 sm:mt-12 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          <div className={cn(
            'flex flex-col items-center rounded-lg shadow-lg bg-white p-4',
            'flex-1',
            'max-w-xs'
          )}>
            <a href="https://download.agios.live" target="_blank" rel="noopener noreferrer">
              <div className="w-24 h-24">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/c/c4/Windows_logo_-_2021_%28Black%29.svg" width={96} height={96} alt="Windows Logo" />
              </div>
            </a>
            <p className="mt-2 text-lg font-bold text-gray-800">
              Windows
            </p>
          </div>
          <div className={cn(
            'flex flex-col items-center rounded-lg shadow-lg bg-white p-4',
            'flex-1',
            'max-w-xs'
          )}>
            <div className="w-24 h-24">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/3/30/MacOS_logo.svg" width={96} height={96} alt="macOS Logo" />
            </div>
            <p className="mt-2 text-lg font-bold text-gray-800">
              macOS (Coming Soon)
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
