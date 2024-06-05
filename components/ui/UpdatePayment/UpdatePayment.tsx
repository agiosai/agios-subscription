"use client"
import usePaddle from '@/hooks/usePaddle';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Input } from 'postcss';

// @ts-ignore
function UpdatePayment({handleModalClose,cancelLink,UpdateLink,onOpen,isOpen,onOpenChange}) {
  const paddle = usePaddle();

  const router = useRouter();
  const openCheckout = (link:string) => {
    return router.push(link);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Are You Sure</ModalHeader>
              <ModalBody>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
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
                  onClick={()=>openCheckout("https://form.typeform.com/to/ySp6JjYY")}
                >
                  Cancel Subscription

                </Button>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/*<dialog*/}
      {/*  className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">*/}
      {/*  <div className="bg-white m-auto p-8">*/}
      {/*    <div className="flex flex-col items-center">*/}
      {/*      <br/>*/}
      {/*      <Button*/}
      {/*        variant="slim"*/}
      {/*        type="button"*/}
      {/*        className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 mt-4"*/}
      {/*        onClick={()=>openCheckout(UpdateLink)}*/}
      {/*      >*/}
      {/*        Update Payment Method*/}

      {/*      </Button>*/}
      {/*      <Button*/}
      {/*        variant="slim"*/}
      {/*        type="button"*/}
      {/*        className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 mt-4"*/}
      {/*        onClick={()=>openCheckout("https://form.typeform.com/to/ySp6JjYY")}*/}
      {/*      >*/}
      {/*        Cancel Subscription*/}

      {/*      </Button>*/}
      {/*      <br/>*/}
      {/*      <button type="button" className="bg-red-500 text-white p-2 " onClick={handleModalClose}>Close</button>*/}
      {/*    </div>*/}

      {/*  </div>*/}
      {/*</dialog>*/}
    </>
  );
}

export default UpdatePayment;