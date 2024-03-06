import { Profile } from "@/utils/interfaces/auth";
import { create } from "zustand";

export type ProfileStore = {
  isAuth: boolean;
  profile: Profile | undefined;
  update: (props: { isAuth: boolean; profile: Profile | undefined }) => void;
};

export const useProfile = create<ProfileStore>()((set) => ({
  isAuth: false,
  profile: undefined,
  update: ({ isAuth, profile }) =>
    set(() => ({ isAuth, profile })),
}));
