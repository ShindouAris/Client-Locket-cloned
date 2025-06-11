export const normalizeFriendData = (response) => {
  if (!response || response.result?.status !== 200 || !response.result?.data) {
    return null;
  }

  const data = response.result.data;

  return {
    uid: data.uid,
    firstName: data.first_name || "",
    lastName: data.last_name || "",
    username: data.username || "",
    profilePic: data.profile_picture_url || "",
    badge: data.badge || null,
    isTemp: data.temp || false,
    isCelebrity: data.celebrity || false,
    friendshipStatus: data.friendship_status || null,
    celebrityData: data.celebrity_data || null,
  };
};