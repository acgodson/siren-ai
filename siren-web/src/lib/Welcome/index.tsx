"use client";

import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Button,
  Box,
  Heading,
  Image,
  Stack,
  Divider,
  Center,
} from "@chakra-ui/react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

import { useEthContext } from "../../evm/EthContext";
import Header from "@/components/organisms/header";
import { useRouter } from "next/navigation";

function Welcome() {
  // const { isConnected, address } = useAccount();
  const { user, authenticated } = usePrivy();
  const { handleLogin, toggleAccountModal } = useEthContext();
  const router = useRouter();

  // useEffect(() => {
  //   if (authenticated) {
  //     router.push("/home");
  //   }
  // }, [authenticated]);

  const features = [
    {
      title: "Noise Measurement",
      subtitle:
        "Unlock the ability measure noise in your environment real-time in decibels (db) ",
      img: "noise.png",
    },
    {
      title: "Map Visualization",
      subtitle:
        "Get an all-round detailed view of your street, area and city. Use map filters to find areas with low or high noise levels ",
      img: "map.png",
    },
    {
      title: "AI Chat Bot",
      subtitle:
        "Take advantage of our AI feature, chat with AI to ask any relevant questions",
      img: "chat.png",
    },
  ];

  const howItWorks = [
    {
      title: "Record Noise",
      subtitle: "Capture Your City's Sound",
      description: `Open the app and tap "Start Recording". The app will measure noise levels and track your location Continue your journey, and Sirens will capture the soundscape. Stop recording when you reach your destination`,
      img: "record.svg",
      icon: "measuring.png",
      action: "Start Measuring",
    },
    {
      title: "View Data on Map",
      subtitle: "See the Noise Pollution Around You",
      description: `Real-time noise levels displayed as a heat map with ability to zoom in and out for detailed views. 
Use Filters to explore noise by time, location, and noise level.
Benefit form user-contributed routes and noise data.`,
      img: "mapping.svg",
      icon: "mapping.png",
      action: "Discover Your Soundscape",
    },
    {
      title: "Ask Questions to AI",
      subtitle: "Get Answers About Your City's Noise",
      description: `Siren's AI provides information about noise pollution and its effects.It offers insights into specific locations and noise levels, suggests noise reduction tips and answers questions about the app and its features.`,
      img: "chat.svg",
      icon: "toggle-ai.png",
      action: "Ask AI",
    },
  ];

  return (
    <>
      <main className="w-screen" style={{ minHeight: "100vh" }}>
        <Box w="100%" position={"relative"}>
          {/* Hero */}
          <div className="flex flex-col w-full">
            <Header />

            {/* Hero Titles */}
            <Box
              mt={[12, 12, 24]}
              px={[2, 2, 10]}
              className="pb-6 flex flex-col h-full justify-start min-h-96"
            >
              <Box className=" bg-transparent py-2" maxW="611px">
                <Heading
                  textAlign={["center", "center", "left"]}
                  size={["lg", "2xl", "4xl", "3xl"]}
                  color="#020202"
                  fontWeight={"semibold"}
                >
                  Turn Your Rides Into Rewards
                </Heading>

                <Text
                  mt={[8, 8, 12]}
                  textAlign={["center", "center", "left"]}
                  fontWeight={"medium"}
                  fontSize={["sm", "xl", "2xl", "2xl"]}
                >
                  Before You Hit the Road, Switch Siren On and Make Every
                  Journey Count. Together, We can Monitor Our Streets and Build
                  Healthier Cities
                </Text>
              </Box>

              <Box
                mt={[8, 8, 12]}
                className="flex flex-col sm:flex-row justify-between gap-4 mx-0"
              >
                <Button
                  h={["40px", "40px", "55px"]}
                  fontSize={["lg", "lg", "xl"]}
                  borderRadius={"30px"}
                  fontWeight={"medium"}
                  bgGradient="linear(to-r, #D82B3C, #17101C)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, #17101C, #D82B3C)",
                  }}
                  px={[3, 3, 12]}
                  zIndex={"tooltip"}
                  onClick={handleLogin}
                  rightIcon={<img src="/measuring.png" alt="measuring" />}
                >
                  Start Measuring
                </Button>
              </Box>
            </Box>

            {/* Hero Images */}
            <Box
              mt={["70vh", "70vh", "38vh"]}
              top={0}
              w="100%"
              position={"absolute"}
              right={0}
            >
              <Image src="bus.svg" alt="hero-bus" />
            </Box>
          </div>
        </Box>

        {/* Features */}
        <Box
          mt={"300px"}
          borderTop={"1px solid #333"}
          borderBottom={"1px solid #333"}
          py={12}
          className="flex flex-col w-full"
        >
          <Heading
            textAlign={"center"}
            size={["lg", "xl", "xl", "xl"]}
            color="#020202"
            fontWeight={"semibold"}
          >
            KEY FEATURES
          </Heading>

          <Stack
            mt={12}
            justifyContent={["flex-start", "flex-start", "center"]}
            gap={15}
            w="100%"
            alignItems={["center", "center", "flex-start"]}
            direction={["column", "column", "row"]}
          >
            {features.map((x, i) => (
              <Box
                key={i}
                w="100%"
                maxW="350px"
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"flex-start"}
                p={6}
              >
                <Image src={`/${x.img}`} />
                <Text
                  mt={4}
                  bgGradient="linear(to-r, #D82B3C, #17101C)"
                  bgClip={"text"}
                  fontWeight={"medium"}
                  fontSize={["lg", "lg", "xl"]}
                >
                  {x.title}
                </Text>
                <Text textAlign={"center"}>{x.subtitle}</Text>

                <Divider orientation="vertical" mt={4} bg={"#333"} />
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Features */}
        <Box px={[2, 2, 10]} mt={24} className="flex flex-col w-full">
          <Heading
            textAlign={"center"}
            size={["lg", "xl", "xl", "xl"]}
            color="#020202"
            fontWeight={"semibold"}
          >
            HOW IT WORKS
          </Heading>

          <Box mt={12} w="100%">
            {howItWorks.map((x, i) => (
              <Flex
                key={i}
                my={12}
                w="full"
                h={["fit-content", "fit-content", "60vh"]}
                flexDir={["column", "column", i === 1 ? "row-reverse" : "row"]}
                justifyContent={"space-between"}
              >
                <Box
                  w="100%"
                  maxW={["100%", "100%", "50%"]}
                  display={"flex"}
                  flexDir={"column"}
                  alignItems={"flext-start"}
                  justifyContent={"flex-start"}
                  p={6}
                >
                  <Text
                    mt={4}
                    bgGradient="linear(to-r, #D82B3C, #17101C)"
                    bgClip={"text"}
                    fontWeight={"bold"}
                    textAlign={"left"}
                    fontSize={["2xl", "2xl", "4xl", "6xl"]}
                  >
                    {x.title}
                  </Text>
                  <Text
                    fontWeight={"semibold"}
                    fontSize={["2xl", "2xl", "2xl", "2xl"]}
                  >
                    {x.subtitle}
                  </Text>
                  <Text
                    fontSize={["xl", "xl", "xl", "xl"]}
                    textAlign={"left"}
                    mt={4}
                  >
                    {x.description}
                  </Text>

                  <Button
                    mt={8}
                    h={["40px", "40px", "55px"]}
                    fontSize={["md", "md", "lg"]}
                    borderRadius={"30px"}
                    fontWeight={"medium"}
                    bgGradient="linear(to-r, #D82B3C, #17101C)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(to-r, #17101C, #D82B3C)",
                    }}
                    w="fit-content"
                    onClick={handleLogin}
                    rightIcon={<img src={`/${x.icon}`} alt="measuring" />}
                  >
                    {x.action}
                  </Button>
                </Box>

                <Box maxW={["100%", "100%", "50%"]} p={6}>
                  <Image src={`/${x.img}`} />
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>

        {/* footer */}
        <Box mt={24} borderTop={"1px solid #333"} w="full">
          <Center py={24}>
            <Text
              mt={4}
              bgGradient="linear(to-r, #D82B3C, #17101C)"
              bgClip={"text"}
              fontWeight={"medium"}
              fontSize={["xl", "xl", "2xl"]}
            >
              Follow our Progress
            </Text>
          </Center>
        </Box>
      </main>
    </>
  );
}

export default Welcome;
