import React, { useState, useEffect } from 'react';
import { getViolations, updateViolationStatus } from '../utils/db';
import { Shield, Clock, CheckCircle, XCircle, FileText, Check, X } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getViolations();
      setViolations(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const success = await updateViolationStatus(id, newStatus);
    if (success) {
      setViolations(violations.map(v => v.id === id ? { ...v, status: newStatus } : v));
    }
  };

  const pendingCount = violations.filter(v => v.status === 'Pending').length;
  const verifiedCount = violations.filter(v => v.status === 'Verified').length;
  const rejectedCount = violations.filter(v => v.status === 'Rejected').length;

  return (
    <div className="admin-dashboard container animate-fade-in">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="text-secondary">Manage and review user-reported traffic violations.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-secondary text-lg">Loading database...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon" style={{ color: 'var(--text-primary)' }}>
            <FileText size={28} />
          </div>
          <div className="stat-info">
            <h3>{violations.length}</h3>
            <p>Total Reports</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon" style={{ color: 'var(--warning)' }}>
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <h3>{pendingCount}</h3>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon" style={{ color: 'var(--accent-primary)' }}>
            <CheckCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>{verifiedCount}</h3>
            <p>Verified</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon" style={{ color: 'var(--danger)' }}>
            <XCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>{rejectedCount}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center gap-2">
          <Shield className="text-accent-primary" />
          <h2>Recent Violations Database</h2>
        </div>
        <div className="card-body p-0">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Evidence</th>
                  <th>Date & Time</th>
                  <th>Vehicle Info</th>
                  <th>Violation Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <img src={v.evidenceUrl} alt="Evidence" className="evidence-img" />
                    </td>
                    <td>
                      <div>{v.date}</div>
                      <div className="text-secondary text-sm">{v.time}</div>
                    </td>
                    <td>
                      <strong>{v.vehicleNumber}</strong>
                    </td>
                    <td>{v.violationType}</td>
                    <td>{v.location}</td>
                    <td>
                      <span className={`status-badge status-${v.status.toLowerCase()}`}>
                        {v.status === 'Pending' && <Clock size={12} />}
                        {v.status === 'Verified' && <CheckCircle size={12} />}
                        {v.status === 'Rejected' && <XCircle size={12} />}
                        {v.status}
                      </span>
                    </td>
                    <td>
                      {v.status === 'Pending' ? (
                        <div className="action-buttons">
                          <button 
                            className="btn-icon verify" 
                            title="Verify"
                            onClick={() => handleStatusChange(v.id, 'Verified')}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            className="btn-icon reject" 
                            title="Reject"
                            onClick={() => handleStatusChange(v.id, 'Rejected')}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-secondary text-sm">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {violations.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-secondary">
                      No violations found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default Admin;
