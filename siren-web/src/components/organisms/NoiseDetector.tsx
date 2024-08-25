"use client";
import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Avatar,
} from "@chakra-ui/react";

const DecibelMeter = () => {
  const [currentReading, setCurrentReading] = useState(40);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [avg, setAvg] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [isRecording, setIsRecording] = useState(false);

  const segments = 36; // Number of blocks around the circle
  const activeSegments = Math.round((currentReading / 100) * segments);

  const handleMeasure = () => {
    setIsRecording(!isRecording);
    // Implement measurement logic here
  };

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

      <VStack
        mt={8}
        spacing={4}
        align="center"
        bg="white"
        p={6}
        w="100%"
        borderRadius="lg"
        shadow="md"
        maxW="md"
        mx="auto"
      >
        {/* Details above the circle */}
        <HStack justify="space-between" w="100%" px={6}>
          <VStack align="flex-start">
            <Text fontWeight="bold">MAX</Text>
            <Text>{max}</Text>
          </VStack>
          <VStack align="flex-end">
            <Text fontWeight="bold">AVG</Text>
            <Text>{avg}</Text>
          </VStack>
        </HStack>

        <Box mt={-8} w="210px" h="210px" position={"relative"}>
          <Box
            position={"relative"}
            rounded={"full"}
            bg="#9faec8"
            border={"6px solid #cfd6db"}
            h="fit-content"
            w="fit-content"
          >
            <Box p={0.5} mt={0}>
              <img src="/meter.svg" alt="base-frame" />
            </Box>

            <Box
              p={"2.5px"}
              mt={"0.2px"}
              left={0}
              top={0}
              zIndex={1}
              position={"absolute"}
            >
              <img src="/volumebase.svg" alt="base-frame" />
            </Box>

            {/* <Box
              opacity={1}
              zIndex={1}
              // px={"3.2px"}
              position={"absolute"}
              mt={'0.2px'}
              right={"-8.15px"}
              top={-0.5}
            >
              <CircularProgress
                value={currentReading}
                size="211px"
                thickness="5.5px"
                color="green.400"
                // trackColor="red"
                trackColor="transparent"
                capIsRound
                // style={{ transform: "rotate(180deg)" }}
              ></CircularProgress>
            </Box> */}

            <Box
              left={0}
              mt={"2.85px"}
              ml={"-0.1px"}
              top={-1.0}
              p={0.5}
              zIndex={3}
              position={"absolute"}
            >
              <img src="/meter.svg" alt="base-frame" />
            </Box>
          </Box>

          {/* Top mark */}
          <Box
            w="100%"
            zIndex={3}
            position="absolute"
            top="0"
            textAlign={"center"}
          >
            <Text mt={1} ml={-1.0} fontSize={"sm"} fontWeight={"bold"}>
              100
            </Text>
          </Box>

          {/* Lower mark */}
          <Box
            w="100%"
            zIndex={3}
            position="absolute"
            bottom="0"
            textAlign={"center"}
          >
            <Text mb={1} ml={1.0} fontSize={"sm"} fontWeight={"bold"}>
              0
            </Text>
          </Box>

          {/* Inner circle with reading */}
          <Box
            position="absolute"
            top="53%"
            left="50%"
            mt={-1.5}
            transform="translate(-50%, -50%)"
            w="155px"
            h="155px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            boxShadow="inner"
            p={0.5}
          >
            <Box
              h="full"
              w="full"
              rounded={"full"}
              borderRadius="full"
              bg="gray.100"
              display={"flex"}
              justifyContent="center"
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Text top="32%" left="50%" fontSize="xs" color="gray.500">
                Over
              </Text>

              <Box
                my={1}
                width="95px"
                height="95px"
                borderRadius="full"
                bg="#e5eaed"
                border="1px solid #aec4cd"
                display="flex"
                flexDirection={"column"}
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="2xl"
                p={4}
              >
                <Box
                  rounded={"full"}
                  h="full"
                  w="full"
                  alignItems="center"
                  justifyContent="center"
                  display="flex"
                  bg="rgba(255, 255, 255, 0.3)"
                  boxShadow="inset 0 2px 8px rgba(255, 255, 255, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.1)"
                  backdropFilter="blur(10px)"
                  border="1px solid rgba(255, 255, 255, 0.3)"
                >
                  {currentReading}
                </Box>
              </Box>

              <Text fontSize="xs" color="gray.500">
                dB-A
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Details below the circle */}
        <HStack justify="space-between" mt={-8} w="full" px={6}>
          <VStack align="flex-start">
            <Text fontWeight="bold">MIN</Text>
            <Text>{min}</Text>
          </VStack>
          <VStack align="flex-end">
            <Text fontWeight="bold">TIME</Text>
            <Text>{time}</Text>
          </VStack>
        </HStack>
      </VStack>

      <Box
        w="100%"
        mt={8}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        px={[2, 2, 0]}
      >
        <Button
          onClick={handleMeasure}
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
