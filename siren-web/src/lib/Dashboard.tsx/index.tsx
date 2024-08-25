"use client";
import { useEffect, useState } from "react";
import {
  DashboardWrapper,
  LayoutContent,
  LayoutFooter,
} from "../../components/template/dashboard-wrapper";

import Overview from "../../components/organisms/overview";

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
      <DashboardWrapper>
        <LayoutContent>
          {isChat ? (
            <></>
          ) : (
            <>{tabIndex ? <Overview toggleHome={toggleHome} /> : <></>}</>
          )}
        </LayoutContent>

        {tabIndex && (
          <LayoutFooter>
            <p>&copy; 2024 Zero</p>
          </LayoutFooter>
        )}
      </DashboardWrapper>
    </>
  );
}

export default Dashboard;
