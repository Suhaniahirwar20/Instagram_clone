
"use client";

import ProfileView from "@/components/insta/ProfileView";
import useAuthStore from "@/store/authStore";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export default function Page() {
  const authUser = useAuthStore((state) => state.user);

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.username) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(
          `/auth/${authUser.username}`
        );

        setProfileData(res.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?.username]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profileData) {
    return <div>Unable to load profile.</div>;
  }

  return <ProfileView user={profileData} isOwnProfile />;
}
