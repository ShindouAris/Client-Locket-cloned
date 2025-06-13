import React, { useEffect, useState, useRef, useCallback } from "react";
import AutoResizeCaption from "./AutoResizeCaption";
import Hourglass from "../../../components/UI/Loading/hourglass";
import { useApp } from "../../../context/AppContext";
import MediaSizeInfo from "../../../components/UI/MediaSizeInfo";
import BorderProgress from "../../../components/UI/SquareProgress";
import { RiCameraLensAiFill } from "react-icons/ri";

const MediaPreview = ({ loading, countdown, capturedMedia }) => {
  const { post, useloading, camera } = useApp();
  const { selectedFile, preview, isSizeMedia } = post;
  const { streamRef, videoRef, cameraActive, setCameraActive, cameraMode } =
    camera;
  const { isCaptionLoading, uploadLoading, sendLoading, setSendLoading } =
    useloading;

  // Zoom states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [maxZoom, setMaxZoom] = useState(4);
  const [isZooming, setIsZooming] = useState(false);
  
  // States cho camera quality
  const [cameraQuality, setCameraQuality] = useState('HD');
  const [isStabilizing, setIsStabilizing] = useState(false);
  // Touch và pinch states
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);
  
  const videoContainerRef = useRef(null);
  const zoomTimeoutRef = useRef(null);
  const [isAutoFocusSupported, setIsAutoFocusSupported] = useState(false);


  // Auto focus function
  const triggerAutoFocus = useCallback(async () => {
    if (!streamRef.current) return;
  
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;
  
    try {
      const capabilities = videoTrack.getCapabilities();
  
      setIsStabilizing(true);
      console.log(capabilities)
  
      if (capabilities.focusMode?.includes("auto")) {
        await videoTrack.applyConstraints({
          advanced: [{ focusMode: "auto" }]
        });
      } else {
        console.warn("focusMode not supported");
      }
  
      setTimeout(() => setIsStabilizing(false), 1000);
    } catch (err) {
      console.warn("Không thể auto focus:", err);
      setIsStabilizing(false);
    }
  }, [streamRef]);

  useEffect(() => {
    if (!streamRef.current) return;
  
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
  
    const capabilities = track.getCapabilities();
  
    const supported =
      "focusMode" in capabilities &&
      Array.isArray(capabilities.focusMode) &&
      capabilities.focusMode.includes("auto");
  
    setIsAutoFocusSupported(supported);
  }, [streamRef]);
  

  // Hàm tính khoảng cách giữa 2 điểm touch
  const getTouchDistance = (touches) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Áp dụng zoom cho camera
  const applyZoom = useCallback(async (zoom) => {
    if (!streamRef.current) return;
    
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const capabilities = videoTrack.getCapabilities();
      if (capabilities.zoom) {
        const constraints = {
          advanced: [{
            zoom: Math.min(Math.max(zoom, capabilities.zoom.min), capabilities.zoom.max)
          }]
        };
        await videoTrack.applyConstraints(constraints);
      }
    } catch (err) {
      console.warn("Không thể áp dụng zoom cho camera:", err);
    }
  }, [streamRef]);

  // Handle zoom change
  const handleZoomChange = useCallback((newZoom, is_wheel= false) => {
    let clampedZoom = Math.min(Math.max(newZoom, 1), maxZoom);
    console.log(`${newZoom}, ${maxZoom} ${clampedZoom}`)
    if (clampedZoom == maxZoom && !is_wheel) {
      clampedZoom = 1;
    }
    setZoomLevel(clampedZoom);
    
    // Apply zoom to camera if active
    if (cameraActive && !preview && !selectedFile && !capturedMedia) {
      applyZoom(clampedZoom);
    }
    
    // Show zoom indicator
    setIsZooming(true);
    clearTimeout(zoomTimeoutRef.current);
    zoomTimeoutRef.current = setTimeout(() => {
      setIsZooming(false);
    }, 1000);
  }, [maxZoom, cameraActive, preview, selectedFile, capturedMedia, applyZoom]);

  // Touch event handlers for pinch-to-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setLastTouchDistance(getTouchDistance(e.touches));
      setIsPointerDown(true);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && isPointerDown) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const scale = currentDistance / lastTouchDistance;
        const newZoom = zoomLevel * scale;
        handleZoomChange(newZoom);
      }
      setLastTouchDistance(currentDistance);
    }
  };

  const handleTouchEnd = (e) => {
    setIsPointerDown(false);
    setLastTouchDistance(0);
  };

  // Wheel event for desktop zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoomChange(zoomLevel + delta, true);
    }
  };

  // Double tap to reset zoom
  const handleDoubleClick = () => {
    handleZoomChange(1);
  };

  // Bật camera với cấu hình tối ưu
  useEffect(() => {
    const startCamera = async () => {
      try {
        // Thử các độ phân giải từ cao xuống thấp
        const resolutions = [
          { width: 1920, height: 1080 }, // Full HD
          { width: 1280, height: 720 },  // HD
          { width: 854, height: 480 },   // 480p
          { width: 640, height: 480 }    // VGA fallback
        ];

        let stream = null;
        
        for (const resolution of resolutions) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: cameraMode || "user",
                width: { ideal: resolution.width, min: 640 },
                height: { ideal: resolution.height, min: 480 },
                frameRate: { ideal: 30, min: 15 },
                // Cải thiện chất lượng hình ảnh
                aspectRatio: { ideal: 1.777777778 }, // 16:9
                resizeMode: "crop-and-scale",
                // Tối ưu cho ánh sáng
                whiteBalanceMode: "auto",
                exposureMode: "auto",
                focusMode: "auto",
                // Giảm noise và tăng độ sắc nét
                noiseSuppression: true,
                autoGainControl: true,
                echoCancellation: false, // Không cần cho video
                zoom: zoomLevel,
              },
              audio: false,
            });
            console.log(`✅ Camera started with ${resolution.width}x${resolution.height}`);
            break;
          } catch (resError) {
            console.warn(`Failed to start camera with ${resolution.width}x${resolution.height}:`, resError);
          }
        }

        if (!stream) {
          throw new Error("Không thể khởi động camera với bất kỳ độ phân giải nào");
        }
        
        // Check camera capabilities for advanced features
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const capabilities = videoTrack.getCapabilities();
          
          // Set max zoom
          if (capabilities.zoom) {
            setMaxZoom(Math.min(capabilities.zoom.max || 3, 8)); // Giới hạn zoom tối đa 8x
          }

          // Apply advanced constraints for better quality
          try {
            await videoTrack.applyConstraints({
              advanced: [
                {
                  // Tối ưu chất lượng hình ảnh
                  brightness: capabilities.brightness ? { ideal: 0 } : undefined,
                  contrast: capabilities.contrast ? { ideal: 1 } : undefined,
                  saturation: capabilities.saturation ? { ideal: 1 } : undefined,
                  sharpness: capabilities.sharpness ? { ideal: 0.8 } : undefined,
                  // Tự động lấy nét
                  focusMode: "auto",
                  // Cân bằng trắng tự động
                  whiteBalanceMode: "auto",
                  // Phơi sáng tự động
                  exposureMode: "auto",
                  exposureCompensation: capabilities.exposureCompensation ? { ideal: 0 } : undefined,
                }
              ]
            });
          } catch (constraintError) {
            console.warn("Không thể áp dụng advanced constraints:", constraintError);
          }
        }
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Tối ưu hiển thị video
          videoRef.current.onloadedmetadata = () => {
            console.log("🎥 Video metadata loaded, dimensions:", 
              videoRef.current.videoWidth + "x" + videoRef.current.videoHeight);
          };
        }
        
      } catch (err) {
        console.error("🚫 Không thể truy cập camera:", err);
        // Fallback với cấu hình cơ bản
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: cameraMode || "user" },
            audio: false,
          });
          streamRef.current = basicStream;
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream;
          }
        } catch (basicErr) {
          console.error("🚫 Fallback camera cũng thất bại:", basicErr);
        }
      }
    };

    if (cameraActive && !streamRef.current) {
      startCamera();
    }
  }, [cameraActive, cameraMode, zoomLevel]);

  useEffect(() => {
    if (!preview && !selectedFile && !capturedMedia) {
      setCameraActive(true);
    }
  }, [preview, selectedFile, capturedMedia, setCameraActive]);

  // Cleanup zoom timeout
  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <h1 className="text-3xl mb-1.5 font-semibold font-lovehouse">
        Locket Camera
      </h1>

      <div
        ref={videoContainerRef}
        className={`relative w-full max-w-md aspect-square bg-gray-800 rounded-[65px] overflow-hidden transition-transform duration-300`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        style={{ touchAction: 'none' }}
      >
        {/* Overlay loading */}
        {uploadLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 text-white text-lg font-medium">
            <Hourglass
              size={50}
              stroke={2}
              bgOpacity={0.1}
              speed={1.5}
              color="white"
            />
            <div>Đang xử lý tệp...</div>
          </div>
        )}

        {/* Camera Quality & Focus Controls */}
        {cameraActive && !preview && !selectedFile && !capturedMedia && isAutoFocusSupported && (
          <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
            {/* Quality indicator */}
            
            {/* Focus button */}
            <button
              onClick={triggerAutoFocus}
              disabled={isStabilizing}
              className={`
                w-10 h-10 bg-black/60 rounded-full flex items-center justify-center text-white 
                hover:bg-black/80 transition-all duration-200 backdrop-blur-sm
                ${isStabilizing ? 'animate-pulse' : ''} 
              `}
              title="Lấy nét tự động"
            >
              <RiCameraLensAiFill size={27}/>
            </button>
          </div>
        )}
        {(cameraActive || preview || selectedFile || capturedMedia) && (
          <div className="absolute top-6 right-6 z-40 flex flex-col gap-2">
            <button
              onClick={() => handleZoomChange(zoomLevel + 1)}
              className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-gray-500 transition-colors"
              disabled={zoomLevel >= maxZoom}
            >
              <span>{zoomLevel.toFixed(0)}x</span>
            </button>
          </div>
        )}

        {/* Zoom Indicator với animation đẹp */}
        {isZooming && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm animate-pulse">
            <span className="flex items-center gap-2">
              🔍 {zoomLevel.toFixed(1)}x
            </span>
          </div>
        )}

        {/* Hiển thị camera với filter và hiệu ứng đẹp */}
        {!preview && !selectedFile && !capturedMedia && cameraActive && (
          <div className="relative w-full h-full">
            {/* Video element với filter tối ưu */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`
                w-full h-full object-cover transition-all duration-300 ease-out
                ${cameraActive ? "opacity-100 scale-100 bg-sky-900" : "opacity-0 scale-95"}
              `}
              style={{
                transform: `
                  ${cameraMode === "user" ? "scaleX(-1)" : "scaleX(1)"} 
                  scale(${zoomLevel})
                `,
                transformOrigin: 'center center',
                // CSS filters để cải thiện chất lượng hình ảnh
                filter: `
                  contrast(1.05) 
                  saturate(1.1) 
                  brightness(1.02)
                  blur(0px)
                `,
                // Tối ưu rendering
                imageRendering: 'crisp-edges',
                backfaceVisibility: 'hidden',
                perspective: '1000px',
                willChange: 'transform'
              }}
            />
            
            {/* Overlay gradient cho depth */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at center, 
                    transparent 0%, 
                    transparent 70%, 
                    rgba(0,0,0,0.05) 100%
                  )
                `
              }}
            />
            
            {/* Vignette effect nhẹ */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                background: `
                  radial-gradient(ellipse at center, 
                    transparent 0%, 
                    transparent 50%, 
                    rgba(0,0,0,0.1) 100%
                  )
                `
              }}
            />
          </div>
        )}

        {/* Preview media với zoom và filter */}
        {preview?.type === "video" && (
          <div className="relative w-full h-full">
            <video
              src={preview.data}
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-full object-cover`}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                filter: `
                  contrast(1.03) 
                  saturate(1.05) 
                  brightness(1.01)
                `,
                imageRendering: 'crisp-edges',
                backfaceVisibility: 'hidden',
                willChange: 'transform'
              }}
            />
          </div>
        )}

        {preview?.type === "image" && (
          <div className="relative w-full h-full">
            <img
              src={preview.data}
              alt="Preview"
              className="w-full h-full object-cover select-none"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                filter: `
                  contrast(1.03) 
                  saturate(1.05) 
                  brightness(1.01)
                  sharpen(0.5)
                `,
                imageRendering: 'crisp-edges',
                backfaceVisibility: 'hidden',
                willChange: 'transform'
              }}
            />
          </div>
        )}

        {/* Caption */}
        {preview && selectedFile && (
          <div
            className={`absolute z-50 inset-x-0 bottom-0 px-4 pb-4 transition-opacity duration-200 ${
              isCaptionLoading ? "opacity-100" : "opacity-0"
            }`}
          >
            <AutoResizeCaption />
          </div>
        )}

        {/* Viền loading */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <BorderProgress />
        </div>

        {/* Grid lines để compose tốt hơn (rule of thirds) */}
        {cameraActive && !preview && !selectedFile && !capturedMedia && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            {/* Vertical lines */}
            <div className="absolute left-1/3 top-0 w-px h-full bg-white/20"></div>
            <div className="absolute left-2/3 top-0 w-px h-full bg-white/20"></div>
            {/* Horizontal lines */}
            <div className="absolute top-1/3 left-0 w-full h-px bg-white/20"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-white/20"></div>
          </div>
        )}
      </div>

      {/* Media size info */}
      <div className="mt-2 text-sm flex items-center justify-center pl-3">
        <MediaSizeInfo />
      </div>
    </>
  );
};

export default MediaPreview;