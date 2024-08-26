import { Box, CircularProgress } from "@chakra-ui/react";

const DualSoundBarProgress = ({
  currentReading,
}: {
  currentReading: number;
}) => {
  const halfReading = currentReading / 2;

  return (
    <>
      <Box
        opacity={1}
        zIndex={1}
        position={"absolute"}
        mt={"-8.5px"}
        right={"-8.2px"}
        top={0}
        style={{ transform: "scaleY(-1)" }}
        transform="rotate(180deg)"
      >
        <CircularProgress
          value={halfReading}
          size="220.5px"
          thickness="5.3px"
          color="green.400"
          trackColor="transparent"
          capIsRound
        />
      </Box>

      <Box
        opacity={1}
        zIndex={1}
        position={"absolute"}
        mt={"-8.5px"}
        right={"-8.2px"}
        top={0}
        transform="rotate(180deg)"
      >
        <CircularProgress
          value={halfReading}
          size="220.5px"
          thickness="5.3px"
          color="green.400"
          trackColor="transparent"
          capIsRound
        />
      </Box>
    </>
  );
};

export default DualSoundBarProgress;
