import { lazy, Suspense, useState } from "react";
import { initializeFeatureFlags, useBooleanFlagValue } from "@lendistry/openfeature";
import { FEATURE_FLAG_DOMAIN } from "./config";

const Dashboard = lazy(() => import("dashboard_remote/Dashboard"));
const Loan = lazy(() => import("loan_remote/Loan"));

const initialFlags = {
  "new-dashboard": true,
  "enable-payment": false,
  "show-reports": true,
  "loan-application-flow-v2": true,
};

function FlagStatus({ flagKey, label }: { flagKey: keyof typeof initialFlags; label: string }) {
  const value = useBooleanFlagValue(flagKey, false);
  return <span className={value ? "pill enabled" : "pill disabled"}>{label}: {String(value)}</span>;
}

export default function App() {
  const [flags, setFlags] = useState(initialFlags);
  const [updating, setUpdating] = useState(false);
  const [remoteVisible, setRemoteVisible] = useState({ dashboard: true, loan: true });

  async function updateFlag(key: keyof typeof initialFlags) {
    const next = { ...flags, [key]: !flags[key] };
    setUpdating(true);
    try {
      await initializeFeatureFlags({ domain: FEATURE_FLAG_DOMAIN, fetchFlags: false, initialFlags: next });
      setFlags(next);
    } catch (error) {
      console.error("Could not update demo flag", error);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">LENDISTRY · OPENFEATURE SDK</p>
          <h1>Microfrontend feature-flag demo</h1>
          <p className="muted">One host, two separately deployed remotes, one shared SDK client.</p>
        </div>
        <div className="host-tag">HOST · :3000</div>
      </header>

      <section className="panel">
        <h2>Host flag controls</h2>
        <p className="muted">The host initializes the SDK. Toggle a flag to register an updated in-memory configuration for the shared domain.</p>
        <div className="flag-row"><FlagStatus flagKey="new-dashboard" label="new-dashboard" /><button disabled={updating} onClick={() => updateFlag("new-dashboard")}>Toggle dashboard</button></div>
        <div className="flag-row"><FlagStatus flagKey="enable-payment" label="enable-payment" /><button disabled={updating} onClick={() => updateFlag("enable-payment")}>Toggle payment</button></div>
        <div className="flag-row"><FlagStatus flagKey="loan-application-flow-v2" label="loan-application-flow-v2" /><button disabled={updating} onClick={() => updateFlag("loan-application-flow-v2")}>Toggle loan flow</button></div>
      </section>

      <section className="remote-grid">
        <article className="remote-card">
          <div className="remote-heading"><div><p className="eyebrow">REMOTE 1</p><h2>Dashboard</h2></div><span className="port">:3001</span></div>
          <p className="muted">Loaded from dashboard_remote through Module Federation.</p>
          <button className="secondary" onClick={() => setRemoteVisible(v => ({ ...v, dashboard: !v.dashboard }))}>{remoteVisible.dashboard ? "Hide remote" : "Show remote"}</button>
          {remoteVisible.dashboard && <Suspense fallback={<p>Loading dashboard remote…</p>}><Dashboard /></Suspense>}
        </article>
        <article className="remote-card">
          <div className="remote-heading"><div><p className="eyebrow">REMOTE 2</p><h2>Loan application</h2></div><span className="port">:3002</span></div>
          <p className="muted">Loaded from loan_remote through Module Federation.</p>
          <button className="secondary" onClick={() => setRemoteVisible(v => ({ ...v, loan: !v.loan }))}>{remoteVisible.loan ? "Hide remote" : "Show remote"}</button>
          {remoteVisible.loan && <Suspense fallback={<p>Loading loan remote…</p>}><Loan /></Suspense>}
        </article>
      </section>
      <footer>Feature flag domain: <code>{FEATURE_FLAG_DOMAIN}</code> · SDK package: <code>@lendistry/openfeature@0.1.4</code></footer>
    </main>
  );
}
