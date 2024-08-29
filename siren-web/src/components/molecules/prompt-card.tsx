import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";

interface PromptCardProps {
  context: string;
  bgColor: string;
  action: () => void;
}

const PromptCard = ({ context, bgColor, action }: PromptCardProps) => (
  <Box
    bg={bgColor}
    borderRadius="md"
    p={4}
    width="130px"
    height="130px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    cursor={"pointer"}
    onClick={action}
  >
    <Text color="white" fontWeight="bold" textAlign="center">
      {context}
    </Text>
  </Box>
);

export default PromptCard;
