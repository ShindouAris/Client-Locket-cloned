import React, { useCallback } from "react";
import { useApp } from "../../../../context/AppContext";
import { showToast } from "../../../../components/Toast";
import { ImageUp } from "lucide-react";

const UploadFile = () => {
  const { post, useloading, camera } = useApp();
  const { selectedFile, setSelectedFile, preview, setPreview, setSizeMedia } =
    post;
  const { uploadLoading, setUploadLoading, setIsCaptionLoading } = useloading;
  const { cameraActive, setCameraActive } = camera;

  //Handle tải file
  const handleFileChange = useCallback(async (event) => {
    setSelectedFile(null);
    const rawFile = event.target.files[0];
    if (!rawFile) return;
    const localPreviewUrl = URL.createObjectURL(rawFile);
    const fileType = rawFile.type.startsWith("image/")
      ? "image"
      : rawFile.type.startsWith("video/")
      ? "video"
      : null;

    if (!fileType) {
      showToast("error", "Chỉ hỗ trợ ảnh và video.");
      URL.revokeObjectURL(localPreviewUrl);
      return;
    }

    if (fileType === "video") {
      try {
        const duration = await new Promise((resolve, reject) => {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.src = localPreviewUrl;
          video.onloadedmetadata = () => {
            resolve(video.duration);
            video.remove();
          };
          video.onerror = () => {
            reject(new Error("Video không hợp lệ."));
            video.remove();
          };
        });

        if (duration > 10) {
          showToast("error", "Video quá dài. Vui lòng chọn video có kích thước nhỏ hơn 10s.");
          URL.revokeObjectURL(localPreviewUrl);
          return;
        }
      } catch (error) {
        showToast("error", error.message);
        URL.revokeObjectURL(localPreviewUrl);
        return;
      }
    }

    // Only disable camera and set states if all validations pass
    setCameraActive(false);
    setPreview({ type: fileType, data: localPreviewUrl });
    const fileSizeInMB = rawFile.size / (1024 * 1024); 
    setSizeMedia(fileSizeInMB.toFixed(2)); 
    setIsCaptionLoading(true);
    setSelectedFile(rawFile); 
  }, []);
  return (
    <>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <ImageUp size={35} />
      </label>
    </>
  );
};
export default UploadFile;
