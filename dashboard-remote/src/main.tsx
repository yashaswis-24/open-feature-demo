import React from "react";
import { createRoot } from "react-dom/client";
import { FeatureFlagProvider } from "@lendistry/openfeature";
import Dashboard from "./Dashboard";
import "./remote.css";

// This page is useful for checking the remote bundle directly. In the main demo,
// the host owns SDK initialization and supplies the shared FeatureFlagProvider.
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="standalone-note">Open this remote through the host app to use the host's shared flag configuration.</div>
    <FeatureFlagProvider domain="lendistry-demo"><Dashboard /></FeatureFlagProvider>
  </React.StrictMode>
);
