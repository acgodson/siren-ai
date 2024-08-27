import React, { useCallback, useEffect } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import DecibelDisplay from "../molecules/DecibelDisplay";
import { useDecibelMeter } from "@/hooks/useDecibelMeter";
import { useGPSTracking } from "@/hooks/useGPSTracking";
import { useNoirCircuit } from "@/hooks/useNoirCircuit";

interface DecibelMeterProps {
  showTip: () => void;
  actionRef: React.MutableRefObject<any>;
}

const DecibelMeter: React.FC<DecibelMeterProps> = ({ showTip, actionRef }) => {
  const {
    currentReading,
    max,
    min,
    avg,
    time,
    isRecording,
    captureAudio,
    stopRecording,
  } = useDecibelMeter();
  const { updateLocationData, startTracking, stopTracking } = useGPSTracking();
  const { generateProof, verifyProof } = useNoirCircuit();

  const mockProver = async () => {
    const value = "52520,13405,48857,2352";
    const [lat1, lon1, lat2, lon2] = value.split(",").map(Number);
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      throw new Error("Invalid input; please enter valid coordinates.");
    }
    console.log("this values", lat1, lon1, lat2, lon2);
    const input = { lat1, lon1, lat2, lon2 };
    console.log(input);

    const proof = await generateProof(input);
    if (proof) {
      await verifyProof(JSON.stringify(proof));
    }
    return;
  };

  const handleSubmit = async () => {
    // await mockProver();
    // return;
    if (isRecording) {
      stopRecording();
      stopTracking();
      return;
    }
    const disableTip = localStorage.getItem("disableTip");
    if (!disableTip) {
      actionRef.current = handleMeasure;
      showTip();
    } else {
      handleMeasure();
    }
  };

  const handleMeasure = async () => {
    startTracking();
    captureAudio();
  };

  const updateLocation = useCallback(() => {
    if (currentReading > 0) {
      updateLocationData(currentReading);
    }
  }, [currentReading, updateLocationData]);

  useEffect(() => {
    if (isRecording) {
      updateLocation();
    }
  }, [isRecording, updateLocation]);

  return (
    <>
      <Box w="100%">
        <Text
          textAlign={"center"}
          fontSize={["xl", "2xl", "3xl"]}
          fontWeight="bold"
        >
          {isRecording ? "Measuring Decibels" : "Noise Measurement"}
        </Text>
      </Box>

      <Box w="100%" px={[4, 2, 0]}>
        <DecibelDisplay
          currentReading={currentReading}
          max={max}
          min={min}
          avg={avg}
          time={time}
        />
      </Box>

      <Box
        w="100%"
        mt={8}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        px={[4, 2, 0]}
      >
        <Button
          onClick={handleSubmit}
          mt={4}
          w="full"
          h="51px"
          maxW="md"
          bgGradient="linear(to-r, #D82B3C, #17101C)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, #17101C, #D82B3C)",
          }}
          borderRadius="full"
          py={2}
          rightIcon={<img src="/measuring.png" alt="measure" />}
        >
          {isRecording ? "Stop Measuring" : "Start Measuring"}
        </Button>
      </Box>
    </>
  );
};

export default DecibelMeter;
