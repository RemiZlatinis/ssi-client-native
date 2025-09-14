import * as SecureStore from "expo-secure-store";

import { AuthObject } from "@/types";

const KEY = "authObject";

const storeAuthObject = async (auth: AuthObject) => {
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(auth));
  } catch (error) {
    console.log("Error storing the auth token", error);
  }
};

const getAuthObject = async () => {
  try {
    const authObjectString = await SecureStore.getItemAsync(KEY);
    return authObjectString
      ? (JSON.parse(authObjectString) as AuthObject)
      : null;
  } catch (error) {
    console.log("Error getting the auth token", error);
  }
};

const removeAuthObject = async () => {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch (error) {
    console.log("Error removing the auth token", error);
  }
};

export default {
  getAuthObject,
  removeAuthObject,
  storeAuthObject,
};
