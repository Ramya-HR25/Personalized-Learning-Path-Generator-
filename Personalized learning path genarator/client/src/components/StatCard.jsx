export function StatCard({ label, value, helper }) {
  return (
    <div className="glass-card stat-card">
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      <span className="muted-text">{helper}</span>
    </div>
  );
}
