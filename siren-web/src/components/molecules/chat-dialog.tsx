import { useState } from "react";
import { useEthContext } from "@/evm/EthContext";
import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Center,
  Image,
} from "@chakra-ui/react";
import QueryInterface from "@/lib/Chat";

export default function ChatDialog() {
  const { isAccountModalOpen, handleLogin, toggleAccountModal, handleLogout } =
    useEthContext();
  const [id, setId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 10000);

    setPageIndex(true);
  };

  return (
    <>
      <Modal
        isOpen={isAccountModalOpen}
        onClose={toggleAccountModal}
        isCentered
        size={pageIndex ? "2xl" : "md"}
      >
        <ModalOverlay
          bg="blackAlpha.800"
          backdropFilter="blur(7px)"
          zIndex="40"
        />

        <ModalContent
          boxShadow={"none"}
          borderRadius={"50px"}
          bgGradient="linear(to-t, #D82B3C, #17101C)"
          mx={2.5}
        >
          <ModalHeader
            mt={1}
            mx={1}
            borderTopRadius={"50px"}
            bg="white"
            pt={2}
            pr={2}
          >
            {!pageIndex && (
              <Center>
                <Image
                  h="60px"
                  w="auto"
                  scale={0.5}
                  src="/tip-icon.png"
                  alt="siren-icon"
                />
              </Center>
            )}
            <Text
              mt={4}
              fontSize={["2xl", "2xl", "4xl"]}
              textAlign={!pageIndex ? "center" : "left"}
              color="#333"
              bgGradient="linear(to-r, #D82B3C, #17101C)"
              bgClip={"text"}
              fontWeight="bold"
            >
              {pageIndex ? "How can I assist you" : " Meet Siren`s AI"}
            </Text>
          </ModalHeader>

          <ModalBody mx={1} bg="white">
            <Flex direction="column" color="#333" gap="4">
              {!pageIndex ? (
                <Box p="4" bg="whiteAlpha" rounded="md">
                  <Text fontWeight="bold">
                    Here to answer any questions and give insights on noise maps
                    on Siren...
                  </Text>
                </Box>
              ) : (
                <>
                  {/* <Text>Let's chat</Text> */}

                  <QueryInterface />
                </>
              )}
            </Flex>
          </ModalBody>

          <ModalFooter
            bg="white"
            justifyContent="center"
            mb={1}
            mx={1}
            borderBottomRadius={"50px"}
            flexDir={"column"}
          >
            {!pageIndex && (
              <>
                <Button
                  h="45px"
                  px={12}
                  mb={4}
                  fontSize={"xl"}
                  borderRadius={"30px"}
                  bgGradient="linear(to-r, #D82B3C, #17101C)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, #17101C, #D82B3C)",
                  }}
                  className="py-5 cursor-pointer"
                  isLoading={loading}
                  onClick={handleSubmit}
                >
                  Continue
                </Button>
                <br />
                <Box textAlign={"center"} fontSize={["sm", "sm", "md"]}>
                  <Text fontSize={["md", "md", "lg"]} color="orange">
                    Warning!!!
                  </Text>
                  <Text>
                    Responses based on testnet data from limited samples are not
                    an absolute reflection of noise pollution in the recorded
                    locations.
                  </Text>
                </Box>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
