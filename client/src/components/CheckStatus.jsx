import React, { useState,useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Adjust if needed

const CheckStatus = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [formData, setFormData] = useState({
    collect_request_id: '',
    school_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/schools`);
        setSchools(response.data.schools); // Save schools to state
      } catch (err) {
        console.error(err);
        setError('Failed to fetch schools data.');
      }
    };
    fetchSchools();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusData(null);
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/checkStatus`, formData);
      setStatusData(response.data.updatedStatus);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 mb-4">
      <h3 className="mb-4">🔍 Check Transaction Status</h3>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label">Collect ID</label>
          <input
            type="text"
            name="collect_request_id"
            value={formData.collect_request_id}
            onChange={handleChange}
            className="form-control form-control-sm"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">School ID</label>
          {/* <input
            type="text"
            name="school_id"
            value={formData.school_id}
            onChange={handleChange}
            className="form-control form-control-sm"
            required
          /> */}
          <select
            name="school_id"
            value={formData.school_id}
            onChange={handleChange}
            className="form-select form-select-sm"
            required
          >
            <option value="">Select</option>
            {schools.map((schoolId) => (
              <option key={schoolId} value={schoolId}>
                {schoolId}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger" role="alert">
          ❌ {error}
        </div>
      )}

      {statusData && (
        <div className="card shadow-sm border-start border-primary border-4">
          <div className="card-body">
            <h5 className="card-title">Transaction Status: <span className={`badge ${statusData.status === 'SUCCESS' ? 'bg-success' : 'bg-warning'}`}>{statusData.status}</span></h5>

            <ul className="list-group list-group-flush mt-3">
              <li className="list-group-item"><strong>Collect ID:</strong> {statusData.collect_request_id}</li>
              {/* <li className="list-group-item"><strong>Collect ID:</strong> {statusData.collect_id}</li> */}
              <li className="list-group-item"><strong>School ID:</strong> {formData.school_id}</li>
              <li className="list-group-item"><strong>Order Amount:</strong> ₹{statusData.order_amount}</li>
              <li className="list-group-item"><strong>Transaction Amount:</strong> ₹{statusData.transaction_amount}</li>
              <li className="list-group-item"><strong>Payment Mode:</strong> {statusData.payment_mode}</li>
              <li className="list-group-item"><strong>Last Updated Time:</strong> {new Date(statusData.payment_time).toLocaleString('en-IN')}</li>
            </ul>

            {statusData.status === 'PENDING' && (
              <div className="mt-3">
                <a href={statusData.payment_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                  🔗 Complete Payment
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckStatus;
