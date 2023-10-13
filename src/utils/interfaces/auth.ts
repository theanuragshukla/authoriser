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
