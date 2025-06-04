import * as utils from "../../utils";

export const fetchUserPlan = async () => {
  // Return a premium plan regardless of the actual plan
  const premiumPlan = {
    uid: "premium_user",
    username: "premium_user",
    display_name: "Premium User",
    profile_picture: "",
    plan_id: "premium",
    plan_info: {
      id: "premium",
      name: "Premium",
      features: {
        custom_theme: true,
        select_friends: true,
        create_post: true,
        decorative: true,
        background: true,
        image_icon: true,
        music_icon: true,
        dev_tools: true
      },
      max_uploads: 999999,
      storage_limit: 999999
    },
    start_date: new Date().toLocaleDateString("vi-VN"),
    end_date: "∞"
  };

  // Save to localStorage
  localStorage.setItem("userPlan", JSON.stringify(premiumPlan));
  return premiumPlan;
};

export const registerFreePlan = async (user, idToken) => {
  // Always register as premium instead of free
  const premiumPlan = {
    data: {
      uid: user.localId,
      username: user.username || user.email || "user",
      email: user.email,
      display_name: user.displayName || user.email,
      profile_picture: user.profilePicture || "",
      plan_id: "premium",
      plan_info: {
        id: "premium",
        name: "Premium",
        features: {
          custom_theme: true,
          select_friends: true,
          create_post: true,
          decorative: true,
          background: true,
          image_icon: true,
          music_icon: true,
          dev_tools: true
        },
        max_uploads: 999999,
        storage_limit: 999999
      },
      start_date: new Date().toISOString(),
      end_date: "∞"
    }
  };

  localStorage.setItem("userPlan", JSON.stringify(premiumPlan.data));
  return premiumPlan;
};
