import axios from "axios";
import { getLocalStorageItem } from "@/utils/localStorage";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = getLocalStorageItem('Expendit-token') || null;
  const userId = getLocalStorageItem('Expendit-user') || null;

  if (token && userId) {
    const user_id = userId.user_id;
    console.log(user_id);

    req.headers["Authorization"] = `Bearer ${JSON.parse(token)}`;
    req.headers["X-UserID"] = `${JSON.parse(user_id)}`;
  }

  return req;
});

export { API };
