import { useState, useRef, useCallback, useEffect } from "react";

export const useDecibelMeter = () => {
  const [currentReading, setCurrentReading] = useState<number>(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(Infinity);
  const [avg, setAvg] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [isRecording, setIsRecording] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const readingsRef = useRef<number[]>([]);

  const calculateDecibels = useCallback(() => {
    if (!isRecording || !analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const avg = sum / dataArray.length;
    const decibels = Math.max(20 * Math.log10(avg), 0);
    const roundedDecibels = Math.round(decibels);

    setCurrentReading(Math.max(0, roundedDecibels));
    readingsRef.current.push(roundedDecibels);
    setMax((prevMax) => Math.max(prevMax, roundedDecibels));
    setMin((prevMin) => Math.min(prevMin, roundedDecibels));

    // Update average
    const newAvg = Math.round(
      readingsRef.current.reduce((a, b) => a + b, 0) /
        readingsRef.current.length
    );
    setAvg(newAvg);

    // Update time
    const elapsedTime = Date.now() - startTimeRef.current;
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    setTime(
      `${hours.toString().padStart(2, "0")}:${(minutes % 60)
        .toString()
        .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
    );
  }, [isRecording]);

  useEffect(() => {
    let animationFrameId: number;

    const updateDecibels = () => {
      calculateDecibels();
      if (isRecording) {
        animationFrameId = requestAnimationFrame(updateDecibels);
      }
    };

    if (isRecording) {
      updateDecibels();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
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

      sourceRef.current.connect(analyserRef.current);
      setIsRecording(true);
      startTimeRef.current = Date.now();
      readingsRef.current = [];
      setMax(0);
      setMin(Infinity);
      setAvg(0);
      setTime("00:00:00");
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  };

  const stopRecording = async () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    setIsRecording(false);

    // Ensure final calculations are correct
    if (readingsRef.current.length > 0) {
      const finalMax = Math.max(...readingsRef.current);
      const finalMin = Math.min(...readingsRef.current);
      const finalAvg = Math.round(
        readingsRef.current.reduce((a, b) => a + b, 0) /
          readingsRef.current.length
      );
      setMax(finalMax);
      setMin(finalMin);
      setAvg(finalAvg);
    }
  };

  return {
    currentReading,
    max,
    min,
    avg,
    time,
    isRecording,
    captureAudio,
    stopRecording,
  };
};
