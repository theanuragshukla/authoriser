import { LoginModal, SignupReq } from "@/utils/interfaces/auth";
import getClient from "../client";

const reqModal = async (func: Function) => {
    try {
        const { status, data } = await func();
        if (status === 200) {
            return data;
        } else {
            return {
                status: false,
                msg: `request failed with code ${status}`,
            };
        }
    } catch (e) {
        return {
            status: false,
            msg: "Something Unexpected happened",
        };
    }
};

export const signup = (values: SignupReq) => {
    return reqModal(() => getClient.post("/api/auth/signup", values));
};

export const login = (values: LoginModal) => {
    return reqModal(() => getClient.post("/api/auth/login", values));
};

export const profile = () => {
    return reqModal(() => getClient.get("/api/auth/profile"));
};

export const verify = () => {
    return reqModal(() => getClient.get("/api/auth/verify"));
};

export const token = () => {
    return reqModal(() => getClient.get("/api/auth/token"));
};

export const upgradeAccount = () => {
    return reqModal(() => getClient.get("/api/account/upgrade"));
};
