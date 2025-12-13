import ProfileOverview from "@/components/modules/profile/ProfileOverview";
import { getProfileInfo } from "@/services/user/userManagement";

// ProfilePage Component
const ProfilePage = async () => {
  const profileResult = await getProfileInfo();
  const user = profileResult?.success ? profileResult.data : null;

  return <ProfileOverview user={user} />;
};

export default ProfilePage;
