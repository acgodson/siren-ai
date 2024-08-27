import { Box, Flex, Text } from "@chakra-ui/react";

const NoiseLevelKey: React.FC = () => {
  const levels = [
    { color: "green.300", label: "Quiet", description: "" },
    {
      color: "yellow.300",
      label: "Moderate",
      description: "(Conversation, Household Noise)",
    },
    {
      color: "orange.400",
      label: "Moderately Loud",
      description: "(Traffic Noise)",
    },
    {
      color: "red.400",
      label: "Loud",
      description: "(City Street Noise, Construction)",
    },
    {
      color: "red.700",
      label: "Very Loud",
      description: "(Industrial Noise, Loud Music)",
    },
  ];

  return (
    <Box textAlign="center" pb={8} w="100%" maxWidth="818px" mx="auto">
      <Text fontWeight="bold" mb={4}>
        KEY
      </Text>
      <Flex w="100%" justifyContent="" alignItems="center">
        {levels.map((level, index) => (
          <Flex w="100%" key={index} direction="column" alignItems="center">
            <Box
              height="20px"
              width={"100%"}
              bg={level.color}
              borderTopLeftRadius={index === 0 ? "20px" : "0"}
              borderBottomLeftRadius={index === 0 ? "20px" : "0"}
              borderTopRightRadius={index === levels.length - 1 ? "20px" : "0"}
              borderBottomRightRadius={
                index === levels.length - 1 ? "20px" : "0"
              }
            />

            <Box h="20px">
              <Text fontSize="10px" mt={2} fontWeight="bold">
                {level.label}
              </Text>
              {level.description && (
                <Text fontSize="10px" maxW={"165px"} mt={1} textAlign="center">
                  {level.description}
                </Text>
              )}
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default NoiseLevelKey;
