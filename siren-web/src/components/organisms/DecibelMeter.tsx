import React, { useCallback, useEffect, useState } from "react";
import { Box, Text, Button, VStack, HStack } from "@chakra-ui/react";
import DecibelDisplay from "../molecules/DecibelDisplay";
import { useDecibelMeter } from "@/hooks/useDecibelMeter";
import { useGPSTracking } from "@/hooks/useGPSTracking";
import { useNoirCircuit } from "@/hooks/useNoirCircuit";
import { useWallets } from "@privy-io/react-auth";
import { useGreenfield } from "@/hooks/useGreenfield";
import { readContract } from "@/evm/config";

interface DecibelMeterProps {
  showTip: () => void;
  actionRef: React.MutableRefObject<any>;
}

interface Stats {
  max: number;
  min: number;
  avg: number;
  time: string;
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

  const {
    isPaused,
    locationData,
    addNoiseSample,
    startTracking,
    stopTracking,
  } = useGPSTracking();

  const { generateProof, verifyProof } = useNoirCircuit();

  const {
    loading,
    address,
    uploadJsonObject,
    downloadJsonObject,
    BUCKET_NAME,
  } = useGreenfield();

  const [finalStats, setFinalStats] = useState<Stats | null>(null);

  const { wallets } = useWallets();

  const getFinalData = useCallback(() => {
    console.log("getFinalData called");
    console.log("Returning location data:", locationData);
    return locationData;
  }, [locationData]);

  const handleProof = async () => {
    // alert("Disabled in your location");
    let objectName: string | null = null;

    // Get final location data
    const finalLocationData = getFinalData();
    console.log("data ready for upload", finalLocationData);

    try {
      const res: any = await readContract("getUniqueObjectName", []);
      console.log("selected new name", res);
      objectName = res;
    } catch (e) {
      console.log(e);
    }
    if (!objectName) {
      console.log("object name unassigned");
      return;
    }
    // upload object
    const res = await uploadJsonObject(objectName, [...finalLocationData]);
    console.log(res);
  };

  const handleSubmit = useCallback(async () => {
    if (isPaused) {
      await handleProof();
      return;
    }

    if (isRecording) {
      await stopRecording();
      await stopTracking();

      // Store final statistics
      setFinalStats({ max, min, avg, time });

      // console.log("paused location data:", locationData);
      console.log("paused statistics:", { max, min, avg, time });
      const finalLocationData = getFinalData();
      console.log("data ready for upload", finalLocationData);
      return;
    }

    const disableTip = localStorage.getItem("disableTip");
    if (!disableTip) {
      localStorage.setItem("disableTip", "true");
      actionRef.current = handleMeasure;
      showTip();
    } else {
      handleMeasure();
    }
  }, [
    isRecording,
    stopRecording,
    stopTracking,
    max,
    min,
    avg,
    time,
    getFinalData,
    actionRef,
    showTip,
  ]);

  const handleMeasure = useCallback(async () => {
    setFinalStats(null);

    try {
      // Start GPS tracking and decibel measurement
      await startTracking();
      await captureAudio();
    } catch (error) {
      console.error("Error starting measurement:", error);
    }
  }, [startTracking, captureAudio]);

  useEffect(() => {
    if (isRecording) {
      addNoiseSample(currentReading); // Link decibel reading to the current GPS sample
    }
  }, [isRecording, currentReading, addNoiseSample]);

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
          max={finalStats ? finalStats.max : max}
          min={finalStats ? finalStats.min : min}
          avg={finalStats ? finalStats.avg : avg}
          time={finalStats ? finalStats.time : time}
          paused={isPaused}
        />
      </Box>

      {isPaused && finalStats && (
        <Box w="100%" px={[4, 2, 0]}>
          <HStack
            textAlign={"left"}
            mt={8}
            spacing={4}
            bg="white"
            p={6}
            w="100%"
            borderRadius="lg"
            shadow="md"
            maxW="md"
            mx="auto"
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"center"}
          >
            <Text fontWeight={"semibold"} textAlign={"left"}>
              Distance Covered:
            </Text>
            <Text textAlign={"left"}> 0km</Text>
          </HStack>
        </Box>
      )}

      <Box
        w="100%"
        mt={8}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        px={[4, 2, 0]}
        mb={12}
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
          {isPaused && finalStats
            ? "Claim Points"
            : isRecording
            ? "Stop Measuring"
            : "Start Measuring"}
        </Button>
      </Box>

      {/* {finalStats && (
        <Box w="100%" mt={4} textAlign="center">
          <Text>Recording Finished</Text>
          <Text>Max: {finalStats.max} dB</Text>
          <Text>Min: {finalStats.min} dB</Text>
          <Text>Avg: {finalStats.avg} dB</Text>
          <Text>Duration: {finalStats.time}</Text>
          <Button>Claim Rewards</Button>
        </Box>
      )} */}
    </>
  );
};

export default DecibelMeter;
