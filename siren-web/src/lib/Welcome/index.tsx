"use client";

import { Box } from "@chakra-ui/react";
import { usePrivy } from "@privy-io/react-auth";

import { useEthContext } from "../../evm/EthContext";
import Header from "@/components/organisms/header";
import HeroCarousel from "@/components/molecules/hero-carousel";
import WelcomeContent from "@/components/molecules/welcome-section";
import Footer from "@/components/molecules/footer";

function Welcome() {
  const { handleLogin, toggleAccountModal, isAccountModalOpen } =
    useEthContext();
  const { authenticated, user } = usePrivy();

  return (
    <>
      <main className="w-screen" style={{ minHeight: "100vh" }}>
        <Box w="100%" position={"relative"}>
          <div className="flex flex-col w-full">
            <Header />
            <HeroCarousel />
          </div>
        </Box>

        <WelcomeContent />
        <Footer />
      </main>
    </>
  );
}

export default Welcome;
