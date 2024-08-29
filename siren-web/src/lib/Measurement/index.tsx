"use client";
import { useRef } from "react";
import { VStack, useDisclosure } from "@chakra-ui/react";
import AppWrapper from "@/components/template/app-wrapper";
import HowToMeasureDialog from "@/components/molecules/how-to-measure";
import DecibelMeter from "@/components/organisms/DecibelMeter";

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const submitCallbackRef = useRef<(() => void) | null>(null);

  const handleDialogSubmit = async () => {
    if (submitCallbackRef.current) {
      submitCallbackRef.current();
    }
    onClose();
  };

  return (
    <>
      <AppWrapper>
        
        <VStack
          mt={12}
          w="100%"
          justifyContent={"center"}
          alignItems={"center"}
        >
          <DecibelMeter showTip={onOpen} actionRef={submitCallbackRef} />
        </VStack>
      </AppWrapper>
      <HowToMeasureDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
}

export default Dashboard;
