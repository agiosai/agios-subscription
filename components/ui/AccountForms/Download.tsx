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
        <div className="mt-8 space-y-4 sm:mt-12 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          <div className={cn('flex flex-col items-center p-4', 'flex-1', 'max-w-xs')}>
            <a href="https://agios-live.s3.ap-northeast-21.amazonaws.com/AgiOS+Beta_Installer_Prod.exe" target="_blank" rel="noopener noreferrer">
              <div className="w-24 h-24 flex flex-col items-center">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Windows_logo_-_2021_%28White%29.svg" width={62.4} height={62.4} alt="Windows Logo" />
              </div>
              <p className="mt-4 text-lg font-bold text-white text-center">
                Windows
              </p>
            </a>
          </div>
          <div className={cn('flex flex-col items-center p-4', 'flex-1', 'max-w-xs')}>
            <div className="w-24 h-24 flex flex-col items-center">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/archive/2/22/20170705052044%21MacOS_logo_%282017%29.svg" width={76.8} height={76.8} alt="macOS Logo" />
            </div>
            <p className="mt-4 text-lg font-bold text-white text-center">
              macOS<br />(Coming Soon)
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
