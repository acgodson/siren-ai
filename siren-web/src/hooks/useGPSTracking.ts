import { useState, useEffect, useCallback, useRef } from "react";

export const useGPSTracking = () => {
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [locationData, setLocationData] = useState<
    { lat: number; lng: number; noise: number }[]
  >([]);
  const watchIdRef = useRef<number | null>(null);
  const isTrackingRef = useRef(false);

  const startTracking = useCallback(() => {
    if (!isTrackingRef.current) {
      isTrackingRef.current = true;
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLatitude(latitude);
          setCurrentLongitude(longitude);
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
    }
  }, []);


  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      isTrackingRef.current = false;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);


  const updateLocationData = useCallback((noiseLevel: number) => {
    if (isTrackingRef.current && currentLatitude !== null && currentLongitude !== null) {
      const newDataPoint = {
        lat: currentLatitude,
        lng: currentLongitude,
        noise: noiseLevel,
      };
      setLocationData((prevData) => [...prevData, newDataPoint]);
      console.log("Data Point:", newDataPoint);
    }
  }, [currentLatitude, currentLongitude]);

  return { currentLatitude, currentLongitude, locationData, updateLocationData, startTracking, stopTracking };
};



