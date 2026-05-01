import { useState } from 'react';

function TransactionList({ transactions, loading, error, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditValues({ ...item, amount: item.amount.toString(), spent_at: item.spent_at.slice(0, 10) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditValues((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (id) => {
    await onUpdate(id, {
      description: editValues.description,
      amount: Number(editValues.amount),
      category: editValues.category,
      status: editValues.status,
      spent_at: editValues.spent_at
    });
    cancelEdit();
  };

  if (loading) {
    return <div className="card">Loading transactions...</div>;
  }

  return (
    <div className="card">
      <h2>Expense history</h2>
      {error && <p className="error">{error}</p>}
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id}>
                  <td>
                    {editingId === item.id ? (
                      <input name="description" value={editValues.description} onChange={handleChange} />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input name="amount" type="number" step="0.01" value={editValues.amount} onChange={handleChange} />
                    ) : (
                      `$${Number(item.amount).toFixed(2)}`
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input name="category" value={editValues.category} onChange={handleChange} />
                    ) : (
                      item.category
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <select name="status" value={editValues.status} onChange={handleChange}>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                      </select>
                    ) : (
                      <span className={`status-pill ${item.status}`}>{item.status}</span>
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input name="spent_at" type="date" value={editValues.spent_at} onChange={handleChange} />
                    ) : (
                      item.spent_at.slice(0, 10)
                    )}
                  </td>
                  <td className="actions">
                    {editingId === item.id ? (
                      <>
                        <button type="button" onClick={() => handleSave(item.id)}>Save</button>
                        <button type="button" onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => startEdit(item)}>Edit</button>
                        <button type="button" onClick={() => onDelete(item.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
