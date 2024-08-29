"use client";
import { useRef } from "react";
import {
  Box,
  Card,
  Heading,
  Stack,
  VStack,
  useDisclosure,
  Text,
  HStack,
  Image,
  Flex,
  Button,
} from "@chakra-ui/react";
import AppWrapper from "@/components/template/app-wrapper";

import BearAvatar from "@/components/atoms/bear-avatar";
import { usePrivy } from "@privy-io/react-auth";
import { useEthContext } from "@/evm/EthContext";

function UserProfile() {
  const { user } = usePrivy();
  const { handleLogin } = useEthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submitCallbackRef = useRef<(() => void) | null>(null);

  const statsItems = [
    {
      title: "Total Rides",
      img: "/ph_bus-bold.png",
      value: 0,
    },
    {
      title: "Accumulated Rewards",
      img: "/rewards.png",
      value: 0,
    },
  ];
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
          <Box pt={1} w="full">
            <Heading
              textAlign={"center"}
              size={["lg", "lg", "lg", "lg"]}
              color="#020202"
              fontWeight={"semibold"}
            >
              Profile
            </Heading>
          </Box>

          <Stack
            w="100%"
            gap={15}
            direction={["column", "column", "row"]}
            px={[2, 2, 12]}
          >
            <Card
              mt={8}
              align="center"
              bg="white"
              p={6}
              w="100%"
              borderRadius="lg"
              shadow="md"
              mx="auto"
            >
              <Box mt={4} scaleX={1.5} scaleY={1.5}>
                <BearAvatar did={"default"} />
              </Box>
              <Box mt={5}>
                {user &&
                  user?.linkedAccounts
                    .filter((x) => x.type === "google_oauth")
                    .map((account, i) => (
                      <VStack gap={5} key={i}>
                        <Text
                          fontSize={["lg", "lg", "xl"]}
                          fontWeight="bold"
                          textAlign="center"
                        >
                          {account.name}
                        </Text>
                        <Text textAlign="center" fontWeight="bold">
                          {account.email}
                        </Text>
                      </VStack>
                    ))}

                {!user && (
                  <>
                    <Button
                      h="40px"
                      px={12}
                      fontSize={"lg"}
                      borderRadius={"30px"}
                      bgGradient="linear(to-r, #D82B3C, #17101C)"
                      color="white"
                      _hover={{
                        bgGradient: "linear(to-r, #17101C, #D82B3C)",
                      }}
                      className="py-5 cursor-pointer"
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  </>
                )}
              </Box>
            </Card>

            <Card
              mt={8}
              align="left"
              bg="white"
              p={6}
              w="100%"
              borderRadius="lg"
              shadow="md"
              mx="auto"
            >
              <Heading
                textAlign={"left"}
                size={["md", "md", "md", "md"]}
                color="#020202"
                fontWeight={"bold"}
              >
                Journey Statistics
              </Heading>

              <Box w="100%" mt={4}>
                {statsItems.map((item, i) => (
                  <HStack
                    w="100%"
                    key={i}
                    justifyContent={"space-between"}
                    alignItems="center"
                    my={3}
                  >
                    <Text fontWeight={"semibold"} w="130px">
                      {item.title}
                    </Text>
                    <Image
                      src={item.img}
                      // h="30px"
                      alt={`${item.title}-icon`}
                    />
                    <Text w="60px">
                      {item.value}
                      {i === 0 ? " Rides" : " SRN"}
                    </Text>
                  </HStack>
                ))}
              </Box>
            </Card>
          </Stack>

          <Stack
            w="100%"
            gap={[2, 2, 5, 20]}
            direction={["column", "column", "column", "row"]}
            px={[2, 2, 12]}
          >
            <Box
              mt={8}
              bg="white"
              p={6}
              w="100%"
              borderRadius="lg"
              shadow="md"
              boxShadow={"md"}
              mx="auto"
            >
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize={["lg", "lg", "xl"]}>
                    Balance
                  </Text>

                  <Image src="/solar_wallet-outline.png" />
                </Flex>
                <Text fontWeight={"semibold"} fontSize={["lg", "lg", "xl"]}>
                  0.00 SRN
                </Text>
              </Flex>
            </Box>

            <Box
              mt={8}
              bg="white"
              p={6}
              w="100%"
              borderRadius="lg"
              shadow="md"
              boxShadow={"md"}
              mx="auto"
            >
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize={["normal", "md", "md"]}>
                    Withdrawal
                  </Text>

                  <Image src="/solar_wallet-outline.png" h="30px" />
                </Flex>
                <Button
                  h="51px"
                  maxW="md"
                  bgGradient="linear(to-r, #D82B3C, #17101C)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, #17101C, #D82B3C)",
                  }}
                  borderRadius="full"
                  py={2}
                  rightIcon={
                    <Image src="/button-suffix.png" alt="withdrawal-action" />
                  }
                  isDisabled={true}
                >
                  Withdraw
                </Button>
              </Flex>
            </Box>

            <Box
              mt={8}
              bg="white"
              p={6}
              w="100%"
              borderRadius="lg"
              shadow="md"
              boxShadow={"md"}
              mx="auto"
            >
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Flex gap={2}>
                  <Text fontWeight="bold" fontSize={["normal", "md", "md"]}>
                    Stake Earnings
                  </Text>

                  <Image src="/solar_wallet-outline.png" h="30px" />
                </Flex>
                <Box>
                  <Button
                    isDisabled={true}
                    h="51px"
                    maxW="md"
                    bgGradient="linear(to-r, #D82B3C, #17101C)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(to-r, #17101C, #D82B3C)",
                    }}
                    borderRadius="full"
                    py={2}
                    rightIcon={
                      <Image src="/button-suffix.png" alt="withdrawal-action" />
                    }
                  >
                    Stake
                  </Button>
                  <Text textAlign="center" fontSize={"xs"} opacity={0.6}>
                    Coming soon
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Stack>
        </VStack>
      </AppWrapper>

      {/* <HowToMeasureDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleDialogSubmit}
      /> */}
    </>
  );
}

export default UserProfile;
