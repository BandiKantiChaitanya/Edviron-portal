import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      

      <section className="hero text-center d-flex align-items-center justify-content-center">
        <div className="container">
          <h2 className="display-5 fw-bold">Welcome to Edviron Payments Portal</h2>
          <p className="lead text-muted">Manage all your school transactions in one place with ease and transparency.</p>
          <div className="mt-4">
            <button className="btn btn-primary btn-lg me-3" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            {/* <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate('/school-transactions')}>View Transactions</button> */}
            <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate('/studentLogin')}>Student Login</button>
          </div>
        </div>
      </section>

      <section className="features py-5">
        <div className="container">
          <h3 className="text-center mb-4">Key Features</h3>
          <div className="row text-center">
            {/* <div className="col-md-2"></div> */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title">All Transactions</h5>
                  <p className="card-text text-muted">Filter, search, and sort your payment data with detailed information.</p>
                </div>
              </div>
            </div>
            {/* <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title">School-wise View</h5>
                  <p className="card-text text-muted">See transactions grouped and filtered by specific schools.</p>
                </div>
              </div>
            </div> */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title">Payment Status</h5>
                  <p className="card-text text-muted">Quickly check which payments are pending or completed.</p>
                </div>
              </div>
            </div>

              <div className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title">Student Login</h5>
                  <p className="card-text text-muted">Students can securely log in to view and complete their pending fee payments.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

     
    </div>
  );
}

export default LandingPage;
