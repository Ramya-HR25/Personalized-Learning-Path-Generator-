export function ProgressChart({ data = [] }) {
  return (
    <div className="glass-card chart-card">
      <div className="section-heading">
        <h3>Chapter progress</h3>
        <p>Automatic completion updates based on your activity.</p>
      </div>
      <div className="chart-list">
        {data.map((item) => (
          <div key={item.label} className="chart-row">
            <span>{item.label}</span>
            <div className="chart-bar">
              <div style={{ width: `${item.value}%` }} />
            </div>
            <strong>{item.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
