import { FeatureFlag, useBooleanFlagValue } from "@lendistry/openfeature";

export default function Dashboard() {
  const dashboardEnabled = useBooleanFlagValue("new-dashboard", false);
  const paymentEnabled = useBooleanFlagValue("enable-payment", false);
  const reportsEnabled = useBooleanFlagValue("show-reports", false);

  if (!dashboardEnabled) {
    return <div className="remote-state disabled"><strong>Dashboard is disabled</strong><p>Turn on <code>new-dashboard</code> from the host controls.</p></div>;
  }

  return (
    <div className="remote-state">
      <div className="success-banner">Dashboard feature is enabled</div>
      <div className="mini-grid">
        <div className="metric"><span>Open accounts</span><strong>128</strong></div>
        <div className="metric"><span>Pending reviews</span><strong>14</strong></div>
      </div>
      {reportsEnabled && <p className="feature-note">Reports section is visible because <code>show-reports</code> is true.</p>}
      <FeatureFlag flagKey="enable-payment" defaultValue={false}>
        <div className="feature-note">Payment actions are available because <code>enable-payment</code> is true.</div>
      </FeatureFlag>
      {!paymentEnabled && <p className="muted-small">Payment actions are hidden because <code>enable-payment</code> is false.</p>}
    </div>
  );
}
