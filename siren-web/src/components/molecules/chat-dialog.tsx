import { useState, useEffect } from "react";
import { useEthContext } from "@/evm/EthContext";
import {
  Box,
  Button,
  Flex,
  Divider,
  Input,
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
import { usePrivy } from "@privy-io/react-auth";
import { ExternalLink } from "lucide-react";
import { useAccount } from "wagmi";
import { useWallets } from "@privy-io/react-auth";

export default function ChatDialog() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { address } = useAccount();
  const { isAccountModalOpen, toggleAccountModal, handleLogout } =
    useEthContext();
  const [id, setId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 10000);
  };

  return (
    <>
      <Modal
        isOpen={isAccountModalOpen}
        onClose={toggleAccountModal}
        isCentered
      >
        <ModalOverlay
          bg="whiteAlpha.200"
          backdropFilter="blur(8px)"
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
            <Center>
              <Image
                h="60px"
                w="auto"
                scale={0.5}
                src="/tip-icon.png"
                alt="siren-icon"
              />
            </Center>
            <Text
              mt={4}
              fontSize={["2xl", "2xl", "4xl"]}
              textAlign={"center"}
              color="#333"
              bgGradient="linear(to-r, #D82B3C, #17101C)"
              bgClip={"text"}
              fontWeight="bold"
            >
              Meet Siren`s AI
            </Text>
          </ModalHeader>

          <ModalBody mx={1} bg="white">
            <Flex direction="column" color="#333" gap="4">
              <Box p="4" bg="whiteAlpha" rounded="md">
                <Text fontWeight="bold">
                  Here to answer any questions and give insights on noise maps
                  on Siren...
                </Text>
              </Box>
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
                Responses based on testnet data from limited samples are not an
                absolute reflection of noise pollution in the recorded
                locations.
              </Text>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
