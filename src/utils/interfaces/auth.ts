import { Session } from "inspector";

export interface LoginModal {
    email: string;
    password: string;
}
export interface AddAppModal {
    name: string;
    description: string;
    logo: string;
    tosUrl: string;
    privacyPolicyUrl: string;
    supportEmail: string;
    redirectUri: string;
    homepage: string;
}

export interface SignupReq {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface User extends SignupReq {
    uid: string;
    isDeveloper: boolean;
}

export interface DbUser extends User {
    id: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    [seed: string]: {
        [key: string]: string;
    };
}

export interface Seeds extends Session {}

export interface Profile {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
    isDeveloper: boolean;
}

export interface GlobalLogin {
    status: boolean;
    profile: Profile | null;
}
