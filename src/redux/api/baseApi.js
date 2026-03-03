import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

export const getApiBaseUrl = () => baseUrl;
export const getGoogleAuthUrl = () =>
  `${baseUrl.replace(/\/$/, "")}/api/auth/google`;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("okghumo_auth");
          const data = raw ? JSON.parse(raw) : null;
          const token = data?.token;
          if (token) headers.set("Authorization", `Bearer ${token}`);
        } catch (_) {}
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
