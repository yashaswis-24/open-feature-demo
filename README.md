# Lendistry OpenFeature – React Microfrontend Demo

This repository demonstrates the existing `@lendistry/openfeature` SDK in a Vite + React Module Federation setup. It contains one host and two remotes. The SDK itself is not copied into this repository; the applications consume the approved `0.1.4` npm tarball.

## Applications and ports

| Application | Port | Role |
|---|---:|---|
| Mock feature-flag API | 9099 | Local API used by `useFeatureFlagApi` |
| Host | 3000 | Initializes the SDK and loads remotes |
| Dashboard remote | 3001 | Demonstrates flags and conditional UI |
| Loan remote | 3002 | Demonstrates a loan flag and API evaluation |

## Prerequisites

- Node.js 22 or newer and npm
- The `lendistry-openfeature-0.1.4.tgz` package from the separate SDK repository

## 1. Add the SDK tarball

From the root of this cloned repository:

```bash
mkdir -p packages
cp ~/Documents/open-feature-flag-sdk-source/src/sdk/lendistry-openfeature-0.1.4.tgz packages/
```

The file must be named exactly `lendistry-openfeature-0.1.4.tgz`.

## 2. Install dependencies

```bash
npm install
```

## 3. Start the mock API

Terminal 1:

```bash
npm run dev:api
```

The mock API listens on `http://localhost:9099`. Default local key: `dev-api-key`.

## 4. Build the remotes

Terminal 2 (run once after install, and again after changing remote code):

```bash
npm run build:remotes
```

The remotes are served as built federation bundles. Keep their preview servers running while the host is open.

## 5. Start the dashboard remote

Terminal 3:

```bash
npm run serve:dashboard
```

It serves the built remote on `http://localhost:3001`.

## 6. Start the loan remote

Terminal 4:

```bash
npm run serve:loan
```

It serves the built remote on `http://localhost:3002`.

## 7. Start the host

Terminal 5:

```bash
npm run dev:host
```

Open `http://localhost:3000`.

## What to demonstrate

- The host initializes the SDK once for the `lendistry-demo` domain using `initializeFeatureFlags` and static initial values.
- The host wraps the application in `FeatureFlagProvider`.
- Dashboard and Loan are separately built and loaded by the host through Module Federation.
- The remotes consume the same shared React, React DOM, and `@lendistry/openfeature` instances.
- The Dashboard uses OpenFeature hooks and the `FeatureFlag` component to conditionally render UI.
- The Loan remote uses `useFeatureFlagApi` to make an individual Axios request to the mock API.

## Mock API contract

- `POST /v1/flags/evaluate-all` → `{ "values": { ... } }`
- `POST /v1/flags/:flagKey/evaluate` → `{ "value": true | false | ... }`
- Authentication header: `X-API-Key: dev-api-key`
- The mock server maps `dev-api-key` to namespace `ns-dev`; `other-api-key` maps to `ns-other`.

## Notes

- The API key is a local mock key only. Never put production secrets in this repository.
- The mock server returns demo values and is not a production service.
- If you change an exposed remote, rebuild remotes with `npm run build:remotes` and restart the preview server.
