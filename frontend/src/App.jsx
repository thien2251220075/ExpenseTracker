import { useEffect, useMemo, useState } from 'react';
import {
  createTransaction,
  deleteTransaction,
  getSummary,
  getTransactions,
  updateTransaction
} from './api';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const totalAmount = useMemo(
    () => transactions.reduce((sum, item) => sum + Number(item.amount), 0),
    [transactions]
  );

  async function reloadData() {
    setLoading(true);
    setError('');
    try {
      const [txs, summaryData] = await Promise.all([getTransactions(), getSummary()]);
      setTransactions(txs);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message || 'Unable to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reloadData();
  }, []);

  async function handleCreate(values) {
    await createTransaction(values);
    await reloadData();
  }

  async function handleUpdate(id, values) {
    await updateTransaction(id, values);
    await reloadData();
  }

  async function handleDelete(id) {
    await deleteTransaction(id);
    await reloadData();
  }

  return (
    <div className="app-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Expense Tracker</p>
          <h1>Financial dashboard</h1>
          <p>Monitor spending, review history, and keep monthly totals in one place.</p>
        </div>
        <div className="header-actions">
          <span className="status-chip">Live insights</span>
          <span className="status-chip accent">Updated automatically</span>
        </div>
      </header>
      <main>
        <section className="dashboard-top">
          <Summary summary={summary} total={totalAmount} />
        </section>
        <section className="dashboard-grid">
          <TransactionForm onSubmit={handleCreate} />
          <TransactionList
            loading={loading}
            error={error}
            transactions={transactions}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
