"use client";
import { useEffect, useState } from "react";
import { Box, VStack, Text, useDisclosure } from "@chakra-ui/react";
import AppWrapper from "@/components/template/app-wrapper";

import { usePrivy } from "@privy-io/react-auth";
import DecibelMeter from "@/components/organisms/NoiseDetector";
import HowToMeasureDialog from "@/components/molecules/how-to-measure";

function Dashboard() {
  const { user } = usePrivy();
  const [isChat, setIsChat] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allowShowTip, setAllowShowTip] = useState(true);
  const [action, setaAtion] = useState<any | null>(null);

  const handleSubmit = (x: any) => {
    if (allowShowTip) {
      onOpen();
      setaAtion(x);
      return;
    } else {
      x();
    }   
  };

  useEffect(() => {
    const disableTip = localStorage.getItem("disableTip");
    if (disableTip) {
      setAllowShowTip(false);
    }
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
          <DecibelMeter showTip={handleSubmit} />
        </VStack>
      </AppWrapper>
      <HowToMeasureDialog isOpen={isOpen} onClose={onClose} onSubmit={action} />
    </>
  );
}

export default Dashboard;
