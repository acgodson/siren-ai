import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  HStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DecibelDisplay from "../molecules/DecibelDisplay";
import { useDecibelMeter } from "@/hooks/useDecibelMeter";
import { useGPSTracking } from "@/hooks/useGPSTracking";
import { useNoirCircuit } from "@/hooks/useNoirCircuit";
import { useWallets } from "@privy-io/react-auth";
import { useGreenfield } from "@/hooks/useGreenfield";
import { readContract } from "@/evm/config";
import { assignPoints, mockZKProof } from "@/evm/client";
import StatusDialog from "../molecules/status-dialog";
import { useEthContext } from "@/evm/EthContext";
import { useRouter } from "next/navigation";

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

  const { uploadJsonObject, downloadJsonObject } = useGreenfield();

  const { wallets } = useWallets();
  const { handleLogin } = useEthContext();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [finalStats, setFinalStats] = useState<Stats | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const log = (message: string) => {
    console.log(message);
    setAlertMessage((prev) => prev + "\n" + message);
  };

  const getFinalData = useCallback(() => {
    console.log("getFinalData called");
    console.log("Returning location data:", locationData);
    return locationData;
  }, [locationData]);

  const handleProof = async () => {
    onOpen();
    setAlertMessage("Starting proof submission...");

    try {
      // Get final location data
      log("Retrieving final location data");
      const finalLocationData = getFinalData();

      // Verify ZK-proof distance (mock)
      const zkProofResult = await mockZKProof(finalLocationData, log, toast);
      if (!zkProofResult) {
        log("ZK-proof verification failed");
        return;
      }

      const objectName: string | null | any = await readContract(
        "getUniqueObjectName",
        []
      );

      if (!objectName) {
        console.log("object name unassigned");
        return;
      }

      // Upload object
      log("Uploading location data to Greenfield");
      await uploadJsonObject(objectName, finalLocationData);
      log("Data uploaded successfully");

      // Assign points to the user
      log("Assigning points to user");
      const finalRes = await assignPoints(wallets[0].address);
      log(`Points assigned: ${finalRes}`);

      toast({
        title: "Success",
        description: "Proof submitted and points assigned successfully!",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      resetMeter();
    } catch (e: any) {
      console.log(e);
      log(`Error in proof submission: ${e.message}`);
      toast({
        title: "Error",
        description: "An error occurred during proof submission.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const resetMeter = () => {
    // isPaused
    setFinalStats(null);
    setTimeout(() => router.push("/profile"), 2000);
  };

  const handleSubmit = useCallback(async () => {
    if (isPaused) {
      if (wallets && wallets.length > 0) {
        await handleProof();
      } else {
        handleLogin();
      }
      return;
    }

    if (isRecording) {
      await stopRecording();
      await stopTracking();

      // Store final statistics
      setFinalStats({ max, min, avg, time });

      // console.log("paused location data:", locationData);
      // console.log("paused statistics:", { max, min, avg, time });
      // const finalLocationData = getFinalData();
      // console.log("data ready for upload", finalLocationData);
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
      await startTracking();
      await captureAudio();
    } catch (error) {
      console.error("Error starting measurement:", error);
    }
  }, [startTracking, captureAudio]);

  useEffect(() => {
    if (isRecording) {
      addNoiseSample(currentReading);
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

      <StatusDialog
        isOpen={isOpen}
        onClose={onClose}
        alertMessage={alertMessage}
      />
    </>
  );
};

export default DecibelMeter;
