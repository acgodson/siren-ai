"use client";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import AppWrapper from "@/components/template/app-wrapper";

import { usePrivy } from "@privy-io/react-auth";

function Dashboard() {
  const { user } = usePrivy();
  const [principal, setPrincipal] = useState<null | string>(null);
  const [onboard, setOnboard] = useState(false);
  const [myAgent, setMyAgent] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(true);
  const [isChat, setIsChat] = useState(true);

  const toggleHome = () => setTabIndex(!tabIndex);
  const toggleChat = () => setIsChat(!isChat);

  return (
    <>
      <AppWrapper>
        <Box>Let's Measure</Box>
      </AppWrapper>
    </>
  );
}

export default Dashboard;
