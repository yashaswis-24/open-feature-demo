import React from "react";
import { createRoot } from "react-dom/client";
import { FeatureFlagProvider, initializeFeatureFlags, setEvaluationContext } from "@lendistry/openfeature";
import App from "./App";
import { FEATURE_FLAG_DOMAIN } from "./config";
import "./styles.css";


async function bootstrap() {
  await initializeFeatureFlags({
    domain: FEATURE_FLAG_DOMAIN,
    fetchFlags: false,
    initialFlags: {
      "new-dashboard": true,
      "enable-payment": false,
      "show-reports": true,
      "loan-application-flow-v2": true,
    },
  });

  await setEvaluationContext({
    subjectId: "microfrontend-demo-user",
    application: "host-app",
    environment: "local",
  }, FEATURE_FLAG_DOMAIN);

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <FeatureFlagProvider domain={FEATURE_FLAG_DOMAIN}>
        <App />
      </FeatureFlagProvider>
    </React.StrictMode>
  );
}

bootstrap().catch((error) => {
  console.error("Unable to initialize the OpenFeature demo", error);
  document.getElementById("root")!.textContent = String(error);
});
