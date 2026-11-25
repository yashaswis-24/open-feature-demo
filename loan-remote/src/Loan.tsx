import { useState } from "react";
import { useBooleanFlagValue, useFeatureFlagApi } from "@lendistry/openfeature";

const apiOptions = {
  baseUrl: import.meta.env.VITE_FEATURE_FLAG_API_BASE_URL || "http://localhost:9099",
  apiKey: import.meta.env.VITE_FEATURE_FLAG_API_KEY || "dev-api-key",
  subjectId: import.meta.env.VITE_FEATURE_FLAG_SUBJECT_ID || "microfrontend-demo-user",
};

function ApiFlagResult() {
  const { data, loading, error } = useFeatureFlagApi<boolean>({
    flagKey: "loan-application-flow-v2",
    defaultValue: false,
    domain: "lendistry-demo",
    apiOptions,
  });

  if (loading) return <p className="muted-small">Calling the feature-flag API…</p>;
  if (error) return <p className="api-error">API error: {error}</p>;
  return <p className={data ? "api-success" : "api-disabled"}>API returned: <strong>{String(data)}</strong></p>;
}

export default function Loan() {
  const flowEnabled = useBooleanFlagValue("loan-application-flow-v2", false);
  const [showApiResult, setShowApiResult] = useState(false);

  return (
    <div className="loan-panel">
      {flowEnabled ? (
        <div className="loan-enabled">
          <strong>Loan application flow v2 is enabled</strong>
          <p>The loan remote is rendering the new application experience.</p>
          <div className="loan-steps"><span>1. Applicant details</span><span>2. Financial details</span><span>3. Review</span></div>
        </div>
      ) : (
        <div className="loan-disabled"><strong>Loan application flow v2 is disabled</strong><p>Enable <code>loan-application-flow-v2</code> in the host controls.</p></div>
      )}
      <div className="api-box">
        <strong>Individual API evaluation</strong>
        <p className="muted-small">This calls the mock backend directly through useFeatureFlagApi and Axios.</p>
        <button onClick={() => setShowApiResult(true)}>Evaluate loan flag using API</button>
        {showApiResult && <ApiFlagResult />}
      </div>
    </div>
  );
}
