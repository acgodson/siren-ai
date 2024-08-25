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
} from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";

export default function HowToMeasureDialog({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay
          bg="whiteAlpha.200"
          backdropFilter="blur(8px)"
          zIndex="40"
        />
        <ModalContent>
          <ModalHeader>
            <Text textAlign={"center"} color="#333">
              How to Measure
            </Text>
          </ModalHeader>
          <ModalCloseButton className="text-[#333]" />

          <ModalBody>
            <Flex direction="column" color="#333" gap="4">
              <Box p="4" bg="gray.200" rounded="md">
                <Text>
                  Do not talk directly over your device Set your destination Use
                  public transportation Hit “Start Measuring” It would turn off
                  automatically at your destination Claim your rewards
                </Text>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter w="full" display={"flex"} justifyContent="center">
            <Button colorScheme="red" onClick={onSubmit}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
