import React from "react";
import { Check, X } from "lucide-react";
import { useApp } from "../../../context/AppContext";

const MediaSizeInfo = () => {
  const { post } = useApp();
  const { preview, isSizeMedia } = post;

  const isImage = preview?.type === "image";
  const isVideo = preview?.type === "video";
  const userPlan = JSON.parse(localStorage.getItem("userPlan"));
  const isTooBig = isImage ? isSizeMedia > userPlan.plan_info.max_image_size : isVideo ? isSizeMedia > userPlan.plan_info.max_video_size : false;
  const colorClass = isTooBig ? "text-red-500" : "text-green-500";

  return (
    <div className="h-6 transition-opacity duration-300 ease-in-out">
      {preview?.type && isSizeMedia ? (
        <div className={`text-sm flex items-center gap-1 ${colorClass}`}>
          Dung lượng {isImage ? "ảnh" : "video"} là{" "}
          <span className="font-semibold underline">{isSizeMedia} MB</span>
          {isTooBig ? (
            <X  className="text-lg" />
          ) : (
            <Check className="text-lg" />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MediaSizeInfo;
