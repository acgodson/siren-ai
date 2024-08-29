import { useState, useEffect, useCallback, useRef } from "react";

const UPDATE_INTERVAL = 1000; // 1 second
const DISTANCE_THRESHOLD = 10; // 10 meters
const MAX_SAMPLES_PER_POINT = 20;

interface LocationData {
  lat: number;
  lng: number;
  noise: number;
  samples: number;
  timestamp: number;
}
interface Positions {
  lat: number;
  lng: number;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const useGPSTracking = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMaxSamplesReached, setIsMaxSamplesReached] = useState(false);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Positions | null>(
    null
  );
  const [lastRecordedPosition, setLastRecordedPosition] =
    useState<Positions | null>(null);

  const [noiseSamples, setNoiseSamples] = useState<number[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  const isTrackingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateLocationData = useCallback(() => {
    if (currentPosition && noiseSamples.length > 0) {
      const avgNoise =
        noiseSamples.reduce((a, b) => a + b, 0) / noiseSamples.length;
      const newData: LocationData = {
        ...currentPosition,
        noise: avgNoise,
        samples: noiseSamples.length,
        timestamp: Date.now(),
      };

      console.log("New data point:", newData);
      setLocationData((prevData) => [...prevData, newData]);
      setLastRecordedPosition(currentPosition);
      // setNoiseSamples([]);
      // setIsMaxSamplesReached(false);
      return true;
    } else {
      console.log(
        "Not updating location data. Current position or noise samples missing."
      );
    }
    setIsMaxSamplesReached(false);
  }, [currentPosition, noiseSamples]);

  const checkPositionChange = useCallback(async () => {
    // console.log("checkPositionChange called");
    // console.log("Current position:", currentPosition);
    // console.log("Last recorded position:", lastRecordedPosition);

    if (currentPosition) {
      if (lastRecordedPosition) {
        const distance = calculateDistance(
          lastRecordedPosition.lat,
          lastRecordedPosition.lng,
          currentPosition.lat,
          currentPosition.lng
        );
        if (distance >= DISTANCE_THRESHOLD) {
          // console.log("Distance threshold exceeded. Updating location data.");
          updateLocationData();
          setNoiseSamples([]);
        }
      } else {
        // First position recorded
        // console.log("First position recorded. Updating location data.");
        updateLocationData();
      }
    }
  }, [currentPosition, lastRecordedPosition, updateLocationData]);

  const startTracking = useCallback(() => {
    console.log("startTracking called");

    if (!isTracking) {
      setIsTracking(true);
      setIsPaused(false);

      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.log("Tracking already active");
    }
  }, [isTracking, checkPositionChange, intervalRef]);

  const stopTracking = useCallback(() => {
    console.log("stopTracking called");
    setIsTracking(false);
    setIsPaused(true);
  }, []);

  const addNoiseSample = useCallback(
    (noiseLevel: number) => {
      // console.log("addNoiseSample called with level:", noiseLevel);

      if (!currentPosition) {
        return;
      }
      setNoiseSamples((prevSamples) => {
        if (prevSamples.length < MAX_SAMPLES_PER_POINT) {
          const newSamples = [...prevSamples, noiseLevel];
          // console.log("Updated noise samples:", newSamples);
          if (newSamples.length === MAX_SAMPLES_PER_POINT) {
            setIsMaxSamplesReached(true);
          }
          return newSamples;
        } else {
          console.log(
            "Max samples reached for this point. Not adding new sample."
          );
          setIsMaxSamplesReached(true);
          return prevSamples;
        }
      });
    },
    [currentPosition]
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isTracking) {
      intervalId = setInterval(checkPositionChange, UPDATE_INTERVAL);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTracking, checkPositionChange]);

  // useEffect(() => {
  //   if (isPaused) {
  //     console.log("isPaused, current location data:", locationData);
  //   }
  // }, [isPaused, locationData]);

  return {
    isPaused,
    locationData,
    addNoiseSample,
    startTracking,
    stopTracking,
  };
};
