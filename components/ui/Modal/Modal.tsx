"use client"
import Button from '@/components/ui/Button';
import usePaddle from '@/hooks/usePaddle';
import { useRouter } from 'next/navigation';

// @ts-ignore
function Modal({handleModalClose,cancelLink,UpdateLink}) {
  const paddle = usePaddle();

  const router = useRouter();
  const openCheckout = (link:string) => {
    return router.push(link);
  };
  return (
    <>
      <dialog
        className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
        <div className="bg-white m-auto p-8">
          <div className="flex flex-col items-center">
            <br/>
            <Button
              variant="slim"
              type="button"
              className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 mt-4"
              onClick={()=>openCheckout(UpdateLink)}
            >
              Update Payment Method

            </Button>
            <Button
              variant="slim"
              type="button"
              className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 mt-4"
              onClick={()=>openCheckout(cancelLink)}
            >
              Cancel Subscription

            </Button>
            <br/>
            <button type="button" className="bg-red-500 text-white p-2 " onClick={handleModalClose}>Close</button>
          </div>

        </div>
      </dialog>
    </>
  );
}

export default Modal;