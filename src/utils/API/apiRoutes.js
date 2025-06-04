import { getBackendUrl } from "../backendConfig";

const getBaseUrl = () => {
  // if (import.meta.env.VITE_BASE_API_URL) {
  //   return import.meta.env.VITE_BASE_API_URL;
  // }
  return getBackendUrl();
};

const getBaseDbUrl = () => {
  if (import.meta.env.VITE_BASE_API_URL_DB) {
    return import.meta.env.VITE_BASE_API_URL_DB;
  }
  return getBackendUrl();
};

const BASE_API_URL = getBaseUrl();
const BASE_DB_API_URL = getBaseDbUrl();
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const BASE_API_URL = "https://apilocket-diov2-production.up.railway.app";

const LOCKET_URL = "/locket";
const LOCKET_PRO = "/locketpro";

export const API_URL = {
  // Core API endpoints
  CHECK_SERVER: `${BASE_API_URL}/keepalive`,
  LOGIN_URL: `${BASE_API_URL}${LOCKET_URL}/login`,
  LOGIN_URL_V2: `${BASE_API_URL}${LOCKET_URL}/login`,
  LOGOUT_URL: `${BASE_API_URL}${LOCKET_URL}/logout`,
  CHECK_AUTH_URL: `${BASE_API_URL}${LOCKET_URL}/checkauth`,
  GET_INFO_URL: `${BASE_API_URL}${LOCKET_URL}/getinfo`,
  REFESH_TOKEN_URL: `${BASE_API_URL}${LOCKET_URL}/refresh-token`,
  GET_LIST_FRIENDS_URL: `${BASE_API_URL}${LOCKET_URL}/get-allfriends`,
  UPLOAD_MEDIA_URL: `${BASE_API_URL}${LOCKET_URL}/upload-media`,
  GET_USER: `https://api.locketcamera.com/fetchUserV2`,
  GET_INCOMING_URL: `${BASE_API_URL}${LOCKET_URL}/get-incoming_friends`,
  DELETE_FRIEND_REQUEST_URL: `${BASE_API_URL}${LOCKET_URL}/delete-incoming_friends`,

  //API lấy dữ liệu từ máy chủ
  GET_LASTEST_URL: `${BASE_API_URL}${LOCKET_PRO}/getmoment`,
  GET_CAPTION_THEMES: `${BASE_DB_API_URL}${LOCKET_PRO}/themes`,
  GET_TIMELINE: `${BASE_DB_API_URL}${LOCKET_PRO}/timelines`,
  DONATE_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/donations`,
  NOTIFI_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/notification`,
  USER_THEMES_POSTS_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/user-themes/posts`,
  POST_USER_THEMES_POSTS_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/user-themes/posts`,
  CAPTION_POSTS_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/user-themes/caption-posts`,
  SUBCRIBE: `${BASE_DB_API_URL}${LOCKET_PRO}/subscribe`,
  REGISTER_USER_PLANS: `${BASE_DB_API_URL}${LOCKET_PRO}/user-plans/register-free`,
  //Get plan user
  GET_USER_PLANS: `${BASE_DB_API_URL}${LOCKET_PRO}/user-plans`,

  // Cloudinary endpoints
  UPLOAD_IMAGE_TO_CLOUD: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  UPLOAD_VIDEO_TO_CLOUD: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
};
