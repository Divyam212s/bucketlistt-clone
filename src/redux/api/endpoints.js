import { baseApi } from "./baseApi";

export const apiEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (body) => ({
        url: "/api/auth/otp/send",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/api/auth/otp/verify",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
} = apiEndpoints;
