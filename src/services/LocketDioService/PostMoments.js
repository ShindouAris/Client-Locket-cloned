import axios from "axios";
import * as utils from "../../utils";

export const uploadMedia = async (payload) => {
  try {
    const { mediaInfo } = payload;
    const fileType = mediaInfo.type;

    // Set timeout based on file type
    const timeoutDuration = fileType === "image" ? 5000 : fileType === "video" ? 10000 : 5000;
    const timeoutId = setTimeout(() => {
      console.log("⏳ Uploading is taking longer than expected...");
    }, timeoutDuration);

    // Create FormData for the request
    const formData = new FormData();
    formData.append("userId", payload.userData.localId);
    formData.append("idToken", payload.userData.idToken);
    formData.append("caption", payload.options.caption || "");

    // Add media file
    if (fileType === "image") {
      formData.append("images", mediaInfo.file);
    } else {
      formData.append("videos", mediaInfo.file);
    }

    // Send request with FormData
    const response = await axios.post(utils.API_URL.UPLOAD_MEDIA_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    clearTimeout(timeoutId);
    console.log("✅ Upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Upload error:", error.response?.data || error.message);

    if (error.response) {
      console.error("📡 Server Error:", error.response);
    } else {
      console.error("🌐 Network Error:", error.message);
    }

    throw error;
  }
};

export const uploadMediaV2 = async (payload) => {
  try {
    const { mediaInfo } = payload;
    const fileType = mediaInfo.type;

    // Set timeout based on file type
    const timeoutDuration = fileType === "image" ? 5000 : fileType === "video" ? 10000 : 5000;
    const timeoutId = setTimeout(() => {
      console.log("⏳ Uploading is taking longer than expected...");
    }, timeoutDuration);

    // Create FormData for the request
    const formData = new FormData();
    formData.append("userId", payload.userData.localId);
    formData.append("idToken", payload.userData.idToken);
    formData.append("caption", payload.options.caption || "");

    // Add media file
    if (fileType === "image") {
      formData.append("images", mediaInfo.file);
    } else {
      formData.append("videos", mediaInfo.file);
    }

    // Send request with FormData
    const response = await axios.post(utils.API_URL.UPLOAD_MEDIA_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    clearTimeout(timeoutId);
    console.log("✅ Upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Upload error:", error.response?.data || error.message);

    if (error.response) {
      console.error("📡 Server Error:", error.response);
    } else {
      console.error("🌐 Network Error:", error.message);
    }

    throw error;
  }
};

export const PostMoments = async (payload) => {
  try {
    const { mediaInfo } = payload;
    const fileType = mediaInfo.type;

    const timeoutDuration = fileType === "image" ? 5000 : fileType === "video" ? 10000 : 5000;
    const timeoutId = setTimeout(() => {
      console.log("⏳ Uploading is taking longer than expected...");
    }, timeoutDuration);

    // Create FormData
    const formData = new FormData();
    formData.append("userId", payload.userData.localId);
    formData.append("idToken", payload.userData.idToken);
    formData.append("options", JSON.stringify(payload.options));
    formData.append("caption", payload.options.caption || "");
    
    // Add the actual file
    if (fileType === "image") {
      formData.append("images", mediaInfo.file);
    } else {
      formData.append("videos", mediaInfo.file);
    }

    // Add metadata
    formData.append("metadata", JSON.stringify({
      type: fileType,
      url: mediaInfo.url,
      public_id: mediaInfo.public_id,
      size: mediaInfo.size,
      ...(fileType === "image" 
        ? {
            format: mediaInfo.format,
            width: mediaInfo.width,
            height: mediaInfo.height,
          }
        : {
            duration: mediaInfo.duration,
            thumbnail: mediaInfo.thumbnail,
          }
      )
    }));

    // Add overlay options
    formData.append("overlay", JSON.stringify({
      overlay_id: payload.options.overlay_id || "",
      type: payload.options.type || "default",
      icon: payload.options.icon || "",
      text_color: payload.options.text_color || "#FFFFFF",
      color_top: payload.options.color_top || "",
      color_bottom: payload.options.color_bottom || ""
    }));

    // Send request with FormData
    const response = await axios.post(utils.API_URL.UPLOAD_MEDIA_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    clearTimeout(timeoutId);
    console.log("✅ Upload thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi upload:", error.response?.data || error.message);
    if (error.response) {
      console.error("📡 Server Error:", error.response);
    } else {
      console.error("🌐 Network Error:", error.message);
    }
    throw error;
  }
};
