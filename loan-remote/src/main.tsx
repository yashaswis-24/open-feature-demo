import React from "react";
import { createRoot } from "react-dom/client";
import { FeatureFlagProvider } from "@lendistry/openfeature";
import Loan from "./Loan";
import "./remote.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="standalone-note">Open this remote through the host app to use the host's shared flag configuration.</div>
    <FeatureFlagProvider domain="lendistry-demo"><Loan /></FeatureFlagProvider>
  </React.StrictMode>
);
