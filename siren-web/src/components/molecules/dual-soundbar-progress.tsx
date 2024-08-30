import { Box, CircularProgress } from "@chakra-ui/react";

const noiseCategories = [
  { max: 25, color: "#90EE90", label: "Quiet" }, // e.g., Residential area at night
  { max: 30, color: "#FFFF00", label: "Moderate" }, // e.g., Normal traffic, conversation near road
  { max: 45, color: "#FFA500", label: "Moderately Loud" }, // e.g., Heavy traffic, Honks, truck passing
  { max: 79, color: "#FF0000", label: "Loud" }, // e.g., Construction site, busy intersection
  { max: Infinity, color: "#990000", label: "Very Loud" }, // e.g., Highway traffic, heavy machinery
];

const getNoiseColor = (reading: number) => {
  for (let category of noiseCategories) {
    if (reading <= category.max) {
      return category.color;
    }
  }
  return noiseCategories[noiseCategories.length - 1].color;
};

const DualSoundBarProgress = ({
  currentReading,
}: {
  currentReading: number;
}) => {
  const halfReading = currentReading / 2;
  const color = getNoiseColor(currentReading);

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
          color={color}
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
          color={color}
          trackColor="transparent"
          capIsRound
        />
      </Box>
    </>
  );
};

export default DualSoundBarProgress;
