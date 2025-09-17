import React, { useState,useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function Dashboard() {
    const BASE_URL=import.meta.env.VITE_BASE_URL
    const [data,setData]=useState([])

    const [statusFilter, setStatusFilter] = useState([]);
    const [schoolFilter, setSchoolFilter] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
    axios.get(`${BASE_URL}/orders`)
      .then((res) => setData(res.data.data)) 
      .catch((err) => console.error('Error fetching orders:', err))
  }, [])
  // console.log(data)

    const uniqueStatuses = [...new Set(data.map(d => d.status))];
    const uniqueSchools = [...new Set(data.map(d => d.collect_id?.school_id))];
  
  const filteredData = data
  .filter(item => 
    (statusFilter.length === 0 || statusFilter.includes(item.status)) &&
    (schoolFilter.length === 0 || schoolFilter.includes(item.collect_id?.school_id)) &&
    (!searchTerm || item.collect_request_id?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!dateRange.from || new Date(item.payment_time) >= new Date(dateRange.from)) &&
    (!dateRange.to || new Date(item.payment_time) <= new Date(dateRange.to))
  );



  // Pagination
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const sortedPaginatedData = [...paginatedData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    return sortConfig.direction === 'asc' 
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1;
  });


  const toggleSort = (key) => {
  setSortConfig(prev =>
    prev.key === key
      ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      : { key, direction: 'asc' }
  );
};
  
  function renderSortIcon(key){
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up ms-1"></i>; // Default icon

    return sortConfig.direction === 'asc' ? (
      <i className="bi bi-sort-down-alt ms-1"></i>
    ) : (
      <i className="bi bi-sort-up-alt ms-1"></i>
    );
  }
  return (
    <div className='dashboard' >
    <div className="m-4 filters">

      <div className="row align-items-end mb-4 ">

        <div className='col-md-2'>
          <label className='form-label' >Search Collect ID :</label>
          <input className='form-control form-control-sm' type="text" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value);setCurrentPage(1)}} />
        </div>

         <div className="col-md-6"></div>
        <div className=" col-md-2 ms-auto">
          <label className="form-label">Status</label>

          <select className="form-select form-select-sm" value={statusFilter[0] || ''}
        onChange={(e) =>{setStatusFilter(e.target.value ? [e.target.value] : []);setCurrentPage(1)}}>

        <option value="">All</option>
        {uniqueStatuses.map((status, i) => (
          <option key={i} value={status}>{status}</option>
        ))}
        </select>
        </div>

        <div className="col-md-2 ms-auto">
          <label className='form-label'>School Id</label>

          <select className='form-select form-select-sm' value={schoolFilter} 
          onChange={(e)=>{setSchoolFilter(e.target.value?[e.target.value]:[]);setCurrentPage(1)}}>
            <option value="">All</option>
            {uniqueSchools.map((id,i)=>(
              <option  key={i} value={id}>{id}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="row date-row">
        <div className="col-md-8"></div>
        <div className="col-md-2">
            <label className='form-label' >From:</label>
            <input className='form-control form-control-sm' type="date" onChange={(e) => {setDateRange(prev => ({ ...prev, from: e.target.value }));setCurrentPage(1)}} />
        </div>

        <div className="col-md-2">
            <label className='form-label' >To:</label>
          <input className='form-control form-control-sm' type="date" onChange={(e) => {setDateRange(prev => ({ ...prev, to: e.target.value }));setCurrentPage(1)}} />
        </div>
      </div>

    </div>

        <div className="container">
          <table className="table table-responsive table-bordered table-hover table-striped">
        <thead className="thead-dark">
          <tr>
            <th className='align-middle'>Student Name</th>
            <th className='align-middle' >Student ID</th>
            <th className='align-middle' >School ID</th>
            <th className='align-middle' >Collect ID</th>
            <th className='align-middle' >Gateway</th>
            <th className='align-middle' onClick={() => toggleSort('order_amount')}>Order Amount {renderSortIcon('order_amount')}</th>
            <th className='align-middle' onClick={() => toggleSort('transaction_amount')}>Transaction Amount {renderSortIcon('transaction_amount')}</th>
            <th className='align-middle' onClick={() => toggleSort('status')}> Status {renderSortIcon('status')}</th>
            <th className='align-middle' >Payment Time</th>
            <th className='align-middle' >Links</th>
          </tr>
        </thead>
        <tbody>
          {sortedPaginatedData.length === 0 ? (
            <tr><td colSpan="9" className="text-center">No transactions found</td></tr>
          ) : (
            sortedPaginatedData.map((item, idx) => {
              const order = item.collect_id;
              const student = order?.student_info?.[0];

              return (
                <tr key={idx}>
                  <td>{student?.name || "N/A"}</td>
                  <td>{student?.id || "N/A"}</td>
                  <td>{order?.school_id}</td>
                  <td>{item.collect_request_id}</td>
                  <td>{order?.gateway_name}</td>
                  <td>₹{item.order_amount}</td>
                  <td>₹{item.transaction_amount}</td>
                  <td>
                    <span>
                      {item.status}
                    </span>
                  </td>
                  <td>
                  {item.status?.toLowerCase() === 'success' ? (
                    new Date(item.payment_time).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })
                  ) : (
                    <span className="text-danger fw-semibold">Payment not completed</span>
                    )
                  }
                </td>
                  <td>
                    {item.status?.toLowerCase() === "success" ? (
                      <button className="btn btn-sm btn-secondary" disabled>Paid</button>
                    ) : (
                      <a
                        className="btn btn-sm btn-primary"
                        href={item.payment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Link
                      </a>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
        </div>
      <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
        <button
          className="btn btn-outline-primary btn-sm me-2"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span className="fw-bold">
          Page {currentPage} of {Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
        </span>

        <button
          className="btn btn-outline-primary btn-sm ms-2"
          onClick={() => setCurrentPage(prev =>
            Math.min(prev + 1, Math.ceil(filteredData.length / ITEMS_PER_PAGE))
          )}
          disabled={currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
        >
          Next
        </button>
      </div>

    </div>
  )
}

export default Dashboard