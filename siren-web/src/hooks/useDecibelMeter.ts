import { useState, useRef, useCallback, useEffect } from "react";

export const useDecibelMeter = () => {
  const [currentReading, setCurrentReading] = useState<number>(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [avg, setAvg] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [isRecording, setIsRecording] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const calculateDecibels = useCallback(() => {
    if (!isRecording || !analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const avg = sum / dataArray.length;
    const decibels = Math.max(20 * Math.log10(avg), 0);

    setCurrentReading(Math.round(decibels));
    // Update max, min, avg, and time here
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
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  };

  const stopRecording = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
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
