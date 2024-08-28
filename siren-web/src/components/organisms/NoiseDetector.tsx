"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, VStack, HStack, Text, Button } from "@chakra-ui/react";
import DualSoundBarProgress from "../molecules/dual-soundbar-progress";
import { Noir } from "@noir-lang/noir_js";
import { deserializeProof, shortenAddress } from "@/utils";

const DecibelMeter = ({
  showTip,
  actionRef,
}: {
  showTip: () => void;
  actionRef: any;
}) => {
  const loadWasmModules = async () => {
    await Promise.all([
      import("@noir-lang/noirc_abi/web/noirc_abi_wasm.js").then((module) =>
        module.default()
      ),
      import("@noir-lang/acvm_js/web/acvm_js.js").then((module) =>
        module.default()
      ),
    ]);
  };

  // State variables for noise measurements
  const [currentReading, setCurrentReading] = useState(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [avg, setAvg] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [isRecording, setIsRecording] = useState(false);

  // Refs for audio context-related variables
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // State variables for GPS tracking
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [locationData, setLocationData] = useState<
    { lat: number; lng: number; noise: number }[]
  >([]);

  const [BarretenbergBackend, setBarretenbergBackend] = useState<any>(null);
  const [noir, setNoir] = useState<any>(null);
  const [Verifier, setVerifier] = useState<any>(null);

  useEffect(() => {
    const loadBarretenbergModules = async () => {
      try {
        const module = await import("@noir-lang/backend_barretenberg");
        const response: any = await fetch(
          "/circuits/check_distance/target/check_distance.json"
        );
        if (response.ok) {
          const circuit = await response.json();
          console.log(circuit);
          const backend = new module.BarretenbergBackend(circuit);
          const _verifer = new module.BarretenbergVerifier(circuit);
          setVerifier(_verifer);
          setBarretenbergBackend(backend);
          const _noir = new Noir(circuit);
          setNoir(_noir);
        }
      } catch (error) {
        console.error("Error loading Barretenberg modules:", error);
      }
    };
    loadWasmModules()
      .then(() => {
        // Now you have the WASM modules loaded
        console.log("Loaded noircAbi and acvmJs:");
        loadBarretenbergModules();
      })
      .catch((error) => {
        console.error("Error loading WASM modules:", error);
      });
  }, []);

  const generateProof = async () => {
    if (!noir || !BarretenbergBackend) {
      console.log("noir not initiated");
      return;
    }
    try {
      const value = "52520,13405,48857,2352";
      const [lat1, lon1, lat2, lon2] = value.split(",").map(Number);
      if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        throw new Error("Invalid input; please enter valid coordinates.");
      }
      console.log("this values", lat1, lon1, lat2, lon2);
      const input = { lat1, lon1, lat2, lon2 };
      console.log(input);

      const { witness } = await noir.execute(input);
      const proof = await BarretenbergBackend.generateProof(witness);
      console.log("distance-prover", "✅ Proofgenerated");
      console.log(proof);
      return proof;
    } catch (e) {
      console.log("error generating proof", e);
    }
  };

  const verifyProof = async (proof: string) => {
    if (!noir || !BarretenbergBackend || !Verifier) {
      console.log("noir or verifier not initiated");
      return;
    }
    try {
      const inputProof = deserializeProof(proof);
      const verificationKey = await BarretenbergBackend.getVerificationKey();
      const isValid = await Verifier.verifyProof(inputProof, verificationKey);
      if (isValid) {
        console.log("distance-verifier", "✅ Proof verified");
      } else {
        console.log("distance-verifier", "❌ Proof invalid");
      }
    } catch (e) {
      console.log("error verifying proof", e);
    }
  };

  // Handle GPS tracking
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLatitude(latitude);
        setCurrentLongitude(longitude);
        // Log the location data to the console
        console.log("Location Data: ", { latitude, longitude });
      },
      (error) => {
        console.error("Error getting location", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Handle noise measurement and updating locationData
  useEffect(() => {
    if (
      currentReading > 0 &&
      currentLatitude !== null &&
      currentLongitude !== null
    ) {
      setLocationData((prevData) => [
        ...prevData,
        {
          lat: currentLatitude,
          lng: currentLongitude,
          noise: currentReading,
        },
      ]);

      // Log the combined data (location + noise)
      console.log("Data Point:", {
        lat: currentLatitude,
        lng: currentLongitude,
        noise: currentReading,
      });
    }
  }, [currentReading, currentLatitude, currentLongitude]);

  const calculateDecibels = useCallback(
    (dataArray: Uint8Array) => {
      if (!isRecording) return;
      analyserRef.current?.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const avg = sum / dataArray.length;
      const decibels = Math.max(20 * Math.log10(avg), 0);
      setCurrentReading(Math.round(decibels));
    },
    [isRecording, analyserRef]
  );

  // State for recording
  useEffect(() => {
    if (!isRecording) return;
    const dataArray = new Uint8Array(
      analyserRef.current?.frequencyBinCount || 0
    );
    const updateDecibels = () => {
      calculateDecibels(dataArray);
      if (isRecording) {
        requestAnimationFrame(updateDecibels); // Continue loop if still recording
      }
    };
    requestAnimationFrame(updateDecibels);
    return () => {
      // Cleanup: Stop loop when recording stops
      setCurrentReading(0);
    };
  }, [isRecording, calculateDecibels]);

  const captureAudio = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioContextRef.current = new AudioContext();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(
        streamRef.current
      );
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      sourceRef.current.connect(analyserRef.current);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  };

  //load circuit

  const handleSubmit = async () => {
    const proof = await generateProof();
    if (proof) {
      await verifyProof(JSON.stringify(proof));
    }
    return;
    if (isRecording) {
      stopRecording();
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
    captureAudio();
  };

  const stopRecording = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close(); // Close the audio context
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
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

      <Box w="100%" px={[4, 2, 0]}>
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
              border={"3px solid #cfd6db"}
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

              <DualSoundBarProgress currentReading={currentReading} />

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
              <Text mt={0.5} ml={-1.0} fontSize={"sm"} fontWeight={"bold"}>
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
