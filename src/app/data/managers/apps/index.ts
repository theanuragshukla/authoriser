import { AddAppModal } from "@/utils/interfaces/auth";
import { reqModal } from "../auth";
import getClient from "../client";

export const addNewApp = (values: AddAppModal) => {
    return reqModal(() => getClient.post("/api/apps/add-new-app", values));
};

export const getAllApps = () => {
    return reqModal(() => getClient.get("/api/apps/get-all-apps"));
};
