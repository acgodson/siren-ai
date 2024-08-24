import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Button, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

const DecibelMeter = () => {
  const [currentReading, setCurrentReading] = useState(40);
  const [max, setMax] = useState(46);
  const [min, setMin] = useState(39);
  const [avg, setAvg] = useState(41);
  const [time, setTime] = useState('00:00:12');
  const [isRecording, setIsRecording] = useState(false);

  const handleMeasure = () => {
    setIsRecording(!isRecording);
    // Implement your measurement logic here
  };

  return (
    <Box className="bg-gray-100 p-6 rounded-lg shadow-md">
      <Text className="text-2xl font-bold mb-4">Measuring Decibels..</Text>
      <Box className="bg-white p-4 rounded-lg shadow">
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text>MAX</Text>
            <Text>AVG</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>{max}</Text>
            <Text>{avg}</Text>
          </HStack>
          <Box position="relative">
            <CircularProgress
              value={currentReading}
              size="200px"
              thickness="4px"
              color="blue.400"
            >
              <CircularProgressLabel className="text-3xl font-bold">
                {currentReading}
              </CircularProgressLabel>
            </CircularProgress>
            <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
              <Text className="text-sm">dB-A</Text>
            </Box>
          </Box>
          <HStack justify="space-between">
            <Text>MIN</Text>
            <Text>TIME</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>{min}</Text>
            <Text>{time}</Text>
          </HStack>
        </VStack>
      </Box>
      <Button
        onClick={handleMeasure}
        className={`mt-4 w-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
      >
        {isRecording ? 'Stop Measuring' : 'Start Measuring'}
      </Button>
    </Box>
  );
};

export default DecibelMeter;