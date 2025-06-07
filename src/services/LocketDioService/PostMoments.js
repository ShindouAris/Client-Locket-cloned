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

    // Send request with FormData
    const response = await axios.post(utils.API_URL.UPLOAD_MEDIA_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }
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
