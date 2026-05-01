function Summary({ summary, total }) {
  return (
    <div className="card">
      <h2>Summary</h2>
      <div className="summary-grid">
        <div>
          <span className="label">Total spending</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        <div>
          <span className="label">Monthly totals</span>
          <ul>
            {summary.map((item) => (
              <li key={item.period}>
                <strong>{item.period}</strong>: ${item.total.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Summary;
