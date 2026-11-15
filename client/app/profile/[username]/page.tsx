"use client";

import ProfileView from "@/components/insta/ProfileView";
import axiosInstance from "@/lib/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";

export default function Page() {
  const params = useParams();
  const currentUser = useAuthStore((state) => state.user);

  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchuser = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get(`/auth/${username}`);
        setUser(res.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchuser();
  }, [username]);
  // const user = getUserByUsername(username || "");

  if (loading) {
    return <div className="flex justify-center py-10">Loading profile...</div>;
  }
  if (!user) {
    return <div>User not found</div>;
  }

const isOwn = user.user?._id === currentUser?._id;

  return <ProfileView user={user} isOwnProfile={isOwn} />;
}
