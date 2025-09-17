import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentPayments = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/transactions/student`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch transactions');
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container py-5">
      <h3>Your Transactions</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Collect ID</th>
                <th>Order Amount</th>
                <th>Transaction Amount</th>
                <th>Status</th>
                <th>Payment Link</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.collect_id}>
                  <td>{tx.collect_id}</td>
                  <td>₹{tx.order_amount}</td>
                  <td>₹{tx.transaction_amount}</td>
                  <td>
                    <span className={`badge ${tx.status === 'SUCCESS' ? 'bg-success' : 'bg-warning'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    {tx.status === 'SUCCESS' ? (
                      '—'
                    ) : 
                    <a href={tx.payment_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                        Pay Now
                      </a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentPayments;
