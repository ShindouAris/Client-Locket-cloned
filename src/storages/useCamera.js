// src/hooks/useCamera.js
import { useState, useRef, useEffect } from "react";

export const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRef = useRef(null);
  const wasActiveRef = useRef(false);  // Track if camera was active before tab blur

  const [capturedMedia, setCapturedMedia] = useState(null);
  const [permissionChecked, setPermissionChecked] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [cameraMode, setCameraMode] = useState("user");

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // Store current camera state before hiding
        wasActiveRef.current = cameraActive;
        
        if (streamRef.current) {
          // Stop all tracks when tab becomes hidden
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
          setCameraActive(false);
        }
      } else if (wasActiveRef.current) {
        // Tab is visible again and camera was previously active
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: cameraMode || "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraActive(true);
        } catch (err) {
          console.error("Could not reactivate camera:", err);
        }
        wasActiveRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cameraActive, cameraMode]);

  return {
    videoRef,
    streamRef,
    cameraRef,
    canvasRef,
    capturedMedia,
    setCapturedMedia,
    permissionChecked, setPermissionChecked,
    holdTime, setHoldTime,
    rotation,
    setRotation,
    isHolding, setIsHolding,
    loading,
    setLoading,
    countdown,
    setCountdown,
    cameraActive, setCameraActive,
    cameraMode, setCameraMode
  };
};
