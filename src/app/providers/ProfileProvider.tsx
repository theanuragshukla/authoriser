"use client";
import { ReactNode, createContext } from "react";
import { ProfileStore, useProfile } from "../hooks/useProfile";


export default function ProfileProvider({ children }: { children: ReactNode }) {
const profile = useProfile();
const ProfileContext = createContext<ProfileStore>(profile);
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}
