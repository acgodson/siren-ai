import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Center,
  Image,
  ListItem,
  OrderedList,
  UnorderedList,
  Checkbox,
} from "@chakra-ui/react";

export default function HowToMeasureDialog({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any;
}) {
  const items = [
    "Do not talk directly over your device Set your destination",
    "Use public transportation Hit 'Start Measuring' It would turn of automatically at your destination Claim your rewards",
    "Remeber to submit your results",
    "Claim your rewards",
  ];
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"} isCentered>
        <ModalOverlay
          bg="whiteAlpha.700"
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
              How to Measure
            </Text>
          </ModalHeader>

          {/* <ModalCloseButton className="text-[#333]" /> */}

          <ModalBody mx={1} bg="white">
            <Flex direction="column" color="#333" gap="4">
              <Box p="4" bg="whiteAlpha" rounded="md">
                <OrderedList variant={"alpha"} alignItems="center">
                  {items.map((item, i) => (
                    <ListItem
                      pb={3}
                      borderBottom={
                        i !== item.length - 1
                          ? "0.5px solid whitesmoke"
                          : "none"
                      }
                      display="flex"
                      key={i}
                    >
                      {item}
                    </ListItem>
                  ))}{" "}
                </OrderedList>
              </Box>
            </Flex>
            <Center>
              <Checkbox
                rounded={"full"}
                colorScheme="black"
                isDisabled
                defaultChecked
              >
                Do not show me again
              </Checkbox>
            </Center>
          </ModalBody>

          <ModalFooter
            bg="white"
            // w="full"
            // display={"flex"}
            justifyContent="center"
            mb={1}
            mx={1}
            borderBottomRadius={"50px"}
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
              onClick={onSubmit}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
