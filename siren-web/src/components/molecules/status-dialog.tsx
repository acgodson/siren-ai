import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";

const StatusDialog = ({
  isOpen,
  alertMessage,
  onClose,
}: {
  isOpen: boolean;
  alertMessage: string;
  onClose: () => void;
}) => {
  const cancelRef = useRef();

  const renderMessageLines = () => {
    return alertMessage.split("\n").map((line, index, array) => (
      <Box
        key={index}
        position="relative"
        pb={index === array.length - 1 ? 0 : 4}
      >
        <Text
          bgClip="text"
          fontWeight="semibold"
          bgGradient="linear(to-r, #D82B3C, #17101C)"
          fontSize="md"
          opacity={0.7}
        >
          {line}
        </Text>
        {index !== array.length - 1 && (
          <Box
            position="absolute"
            left="0"
            top="100%"
            height="16px"
            width="2px"
            bg="gray.300"
            transform="translateX(-50%)"
          />
        )}
      </Box>
    ));
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef as any}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              In Progress...
            </AlertDialogHeader>
            <AlertDialogBody whiteSpace="pre-line">
              <VStack align="stretch" spacing={4}>
                {renderMessageLines()}
              </VStack>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default StatusDialog;
