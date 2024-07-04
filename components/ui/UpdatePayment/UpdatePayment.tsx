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
  const openCheckout = (link: string) => {
    return router.push(link);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-2 text-lg font-bold text-gray-800">
                Update Payment Information
              </ModalHeader>
              <ModalBody className="text-center text-gray-600">
                Please choose an option below to update your payment information or contact support for further assistance.
                <button
                  className="w-full py-2 mt-4 text-sm font-semibold text-center text-white bg-gray-700 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75"
                  onClick={() => openCheckout(UpdateLink)}
                >
                  Update Payment Method
                </button>
                <button
                  className="w-full py-2 mt-4 text-sm font-semibold text-center text-white bg-gray-700 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75"
                  onClick={() => openCheckout("https://form.typeform.com/to/vnkH7IsK?typeform-source=subscription.agios.live")}
                >
                  Contact Support
                </button>
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <button 
                  onClick={onClose} 
                  className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75"
                >
                  Close
                </button>
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
      {/*      <button*/}
      {/*        className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 mt-4"*/}
      {/*        onClick={() => openCheckout(UpdateLink)}*/}
      {/*      >*/}
      {/*        Update Payment Method*/}
      {/*      </button>*/}
      {/*      <button*/}
      {/*        className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 mt-4"*/}
      {/*        onClick={() => openCheckout("https://form.typeform.com/to/vnkH7IsK?typeform-source=subscription.agios.live")}*/}
      {/*      >*/}
      {/*        Contact Support*/}
      {/*      </button>*/}
      {/*      <br/>*/}
      {/*      <button type="button" className="bg-red-500 text-white p-2 " onClick={handleModalClose}>Close</button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</dialog>*/}
    </>
  );
}

export default UpdatePayment;
