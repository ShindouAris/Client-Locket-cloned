import * as utils from "../../utils";
import { API_URL } from "../../utils/API/apiRoutes";
import { plans } from "../../utils/plans";
import axios from "axios";

export const fetchUserPlan = async (userId) => {
  try {
    const useCustomBackend = localStorage.getItem("use_custom_backend") === "true";

    if (useCustomBackend) {
      // Premium plan if use custom backend
      const premiumPlan = {
        uid: "pro_plus_user",
        username: "pro_plus_user",
        display_name: "Pro Plus User",
        plan_id: "pro_plus",
        plan_info: {
          id: "pro_plus",
          name: "Pro Plus",
          features: {
            custom_theme: true,
            select_friends: true,
            create_post: true,
            decorative: true,
            background: true,
            image_icon: true,
            music_icon: true,
            dev_tools: true,
            no_ads: true,
          },
          max_uploads: 999999,
          max_video_size: 25,
          max_image_size: 10,
        },
        start_date: new Date().toLocaleDateString("vi-VN"),
        end_date: "∞"
      };
      localStorage.setItem("userPlan", JSON.stringify(premiumPlan));
      return premiumPlan;
    }

    if (!userId) {
      const storedPlan = localStorage.getItem("userPlan");
      if (storedPlan) {
        try {
          const parsedPlan = JSON.parse(storedPlan);
          if (parsedPlan.start_date && parsedPlan.start_date !== "∞") {
            parsedPlan.start_date = new Date(parsedPlan.start_date).toLocaleDateString("vi-VN");
          }
          if (parsedPlan.end_date && parsedPlan.end_date !== "∞") {
            parsedPlan.end_date = new Date(parsedPlan.end_date).toLocaleDateString("vi-VN");
          }
          return parsedPlan;
        } catch (e) {
          console.error("Error parsing stored plan:", e);
        }
      }
      return getDefaultFreePlan();
    }

    const response = await axios.get(API_URL.GET_USER_SUBSCRIPTION(userId));
    const planData = response.data;

    // Find the plan details from our plans data
    const planDetails = plans.find(p => p.id === planData.plan_id) || plans[0]; // Default to free plan if not found

    const userPlan = {
      uid: userId,
      username: userId,
      display_name: "User",
      plan_id: planData.plan_id,
      plan_info: {
        id: planData.plan_id,
        name: planDetails.name,
        features: planDetails.features,
        max_uploads: planDetails.max_uploads,
        max_video_size: planDetails.max_video_size,
        max_image_size: planDetails.max_image_size,
      },
      start_date: planData.start_date ? new Date(planData.start_date * 1000).toLocaleDateString("vi-VN") : new Date().toLocaleDateString("vi-VN"),
      end_date: planData.end_date ? new Date(planData.end_date * 1000).toLocaleDateString("vi-VN") : "∞",
      qr_code: planData.qr_code
    };

    localStorage.setItem("userPlan", JSON.stringify(userPlan));
    return userPlan;
  } catch (error) {
    console.error("Error fetching user plan:", error);
    // On error, return free plan
    return getDefaultFreePlan();
  }
};

// Helper function to get default free plan
const getDefaultFreePlan = () => {
  const freePlan = plans[0]; // Free plan is always first in the array
  const defaultPlan = {
    uid: "free_user",
    username: "free_user",
    display_name: "Free User",
    plan_id: "free",
    plan_info: {
      id: "free",
      name: freePlan.name,
      features: freePlan.features,
      max_uploads: freePlan.max_uploads,
      max_video_size: freePlan.max_video_size,
      max_image_size: freePlan.max_image_size,
    },
    start_date: new Date().toLocaleDateString("vi-VN"),
    end_date: "∞"
  };
  localStorage.setItem("userPlan", JSON.stringify(defaultPlan));
  return defaultPlan;
};

export const registerFreePlan = async (user, idToken) => {
  try {
    // Check current plan first
    const currentPlan = await fetchUserPlan(user.localId);
    if (currentPlan && currentPlan.plan_id !== "free") {
      throw new Error("Bạn đã đăng ký gói khác. Vui lòng hủy gói hiện tại trước khi đăng ký gói mới.");
    }

    const response = await axios.post(API_URL.REGISTER_USER_PLANS, {
      user_id: user.localId,
      plan_id: "free"
    });

    if (response.data.success) {
      // Only fetch and return new plan after successful registration
      const newPlan = await fetchUserPlan(user.localId);
      if (!newPlan) {
        throw new Error("Không thể lấy thông tin gói sau khi đăng ký");
      }
      return newPlan;
    } else {
      throw new Error(response.data.message || "Đăng ký gói thất bại");
    }
  } catch (error) {
    console.error("Error registering free plan:", error);
    throw error;
  }
};

export const registerPaidPlan = async (user, planId) => {
  try {
    const currentPlan = await fetchUserPlan(user.localId);
    if (currentPlan && currentPlan.plan_id !== "free") {
      throw new Error("Bạn đã đăng ký gói rồi.");
    }

    const validPlanIds = ["premium_lite", "premium", "pro_plus"];
    if (!validPlanIds.includes(planId)) {
      throw new Error("Gói không hợp lệ");
    }

    const response = await axios.post(API_URL.REGISTER_USER_PLANS, {
      user_id: user.localId,
      plan_id: planId
    });

    if (response.data.success) {
      return {
        success: true,
        qr_code: response.data.qr_code,
        message: response.data.message
      };
    } else if (response.data.message === "User already has a pending request") {
      return {
        success: true,
        qr_code: response.data.qr_code,
        message: "Bạn đã có yêu cầu đang chờ xử lý"
      };
    } else {
      throw new Error(response.data.message || "Đăng ký gói thất bại");
    }
  } catch (error) {
    console.error("Error registering paid plan:", error);
    throw error;
  }
};
