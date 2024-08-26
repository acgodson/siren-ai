"use client";
import { useEffect, useRef, useState } from "react";
import { Box, VStack, Text, useDisclosure } from "@chakra-ui/react";
import AppWrapper from "@/components/template/app-wrapper";

import DecibelMeter from "@/components/organisms/NoiseDetector";
import HowToMeasureDialog from "@/components/molecules/how-to-measure";
import check_age from "../../../../zk-proof/circuits/check_age/target/check_age.json";

// circuits/check_age/target/check_age.json";

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const submitCallbackRef = useRef<(() => void) | null>(null);

  const handleDialogSubmit = async () => {
    if (submitCallbackRef.current) {
      //@ts-ignore
      submitCallbackRef.current();
    }
    onClose();
  };

  useEffect(() => {
    console.log(check_age);
  }, []);

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
