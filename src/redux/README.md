# Redux & API (RTK Query) – bucketlistt

Same pattern as Okghumo frontend guide.

## File structure

```
src/redux/
  api/
    baseApi.ts    → createApi, base URL, auth headers (Bearer from localStorage 'okghumo_auth')
    endpoints.ts  → All API endpoints (injectEndpoints)
    index.ts      → Re-exports baseApi + all hooks
  README.md       → This file
```

Store lives in `src/store/index.ts`: wires `baseApi.reducer` + `baseApi.middleware` and `setupListeners(store.dispatch)`.

## Base API (baseApi.ts)

- `createApi` with `reducerPath: 'api'`
- `baseQuery`: `fetchBaseQuery` with `NEXT_PUBLIC_API_BASE_URL` or `NEXT_PUBLIC_API_URL`
- `prepareHeaders`: reads token from `localStorage.getItem('okghumo_auth')` → `Authorization: Bearer <token>`
- `credentials: 'include'`
- `endpoints: () => ({})` — real endpoints in endpoints.ts

## Adding a new endpoint (endpoints.ts)

**Query (GET):**

```ts
getXxx: builder.query<ResponseType, ParamType>({
  query: (idOrParams) => ({ url: '/api/your-path', params: { id: idOrParams } }),
}),
```

**Mutation (POST/PATCH/DELETE):**

```ts
createXxx: builder.mutation<ResponseType, BodyType>({
  query: (body) => ({ url: '/api/your-path', method: 'POST', body }),
}),
```

Then:

1. Export the hook in endpoints.ts: `useGetXxxQuery` / `useCreateXxxMutation`
2. Re-export in api/index.ts
3. Use in component: `useGetXxxQuery()` or `const [createXxx] = useCreateXxxMutation(); await createXxx(payload).unwrap();`

## Hook naming (RTK Query)

- Query → `use` + EndpointName (PascalCase) + `Query` (e.g. `getCreators` → `useGetCreatorsQuery`)
- Mutation → `use` + EndpointName + `Mutation` (e.g. `sendOtp` → `useSendOtpMutation`)

## Checklist for a new API

- [ ] Add endpoint in endpoints.ts (builder.query or builder.mutation)
- [ ] Export hook in endpoints.ts and in api/index.ts
- [ ] Use the hook in your component

## Current endpoints (only OTP for now)

| Endpoint   | Type     | Hook                | Body |
|------------|----------|---------------------|------|
| sendOtp    | Mutation | useSendOtpMutation   | `{ phoneNumber, platform: "bucketlistt" }` |
| verifyOtp  | Mutation | useVerifyOtpMutation | `{ phoneNumber, otp, platform: "bucketlistt" }` |

Helper: `getGoogleAuthUrl()` for redirect to Google OAuth (same base URL as API).
