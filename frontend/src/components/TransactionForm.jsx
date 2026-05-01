import { useState } from 'react';

const defaultState = {
  description: '',
  amount: '',
  category: 'General',
  status: 'completed',
  spent_at: new Date().toISOString().slice(0, 10)
};

function TransactionForm({ onSubmit }) {
  const [form, setForm] = useState(defaultState);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        description: form.description,
        amount: Number(form.amount),
        category: form.category,
        status: form.status,
        spent_at: form.spent_at
      });
      setForm(defaultState);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Description
          <input name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label>
          Amount
          <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required />
        </label>
        <label>
          Category
          <input name="category" value={form.category} onChange={handleChange} required />
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </label>
        <label>
          Date
          <input name="spent_at" type="date" value={form.spent_at} onChange={handleChange} required />
        </label>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add expense'}</button>
      </form>
    </div>
  );
}

export default TransactionForm;
