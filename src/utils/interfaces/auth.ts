export interface LoginModal {
    email: string;
    password: string;
}

export interface SignupReq {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface User extends SignupReq {
    uid: string;
    isDeveloper:boolean
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

export interface Profile {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
    isDeveloper:boolean
}
