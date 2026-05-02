import React, { useState, useEffect } from 'react';
import { getUserViolations } from '../utils/db';
import { useAuth } from '../contexts/AuthContext';
import { Clock, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const MyReports = () => {
  const { user } = useAuth();
  const [myViolations, setMyViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViolations = async () => {
      if (user && user.role === 'user') {
        setLoading(true);
        const data = await getUserViolations(user.email);
        setMyViolations(data);
        setLoading(false);
      }
    };
    fetchViolations();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="container py-12 animate-fade-in">
      <div className="dashboard-header">
        <h1>My Reports</h1>
        <p className="text-secondary">Track the status of the traffic violations you have reported.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-secondary text-lg">Loading your reports...</p>
        </div>
      ) : (
        <div className="card mt-8">
        <div className="card-header flex items-center gap-2">
          <Shield className="text-accent-primary" />
          <h2>Submission History</h2>
        </div>
        <div className="card-body p-0">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Vehicle Info</th>
                  <th>Violation Type</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myViolations.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div>{v.date}</div>
                      <div className="text-secondary text-sm">{v.time}</div>
                    </td>
                    <td><strong>{v.vehicleNumber}</strong></td>
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
                  </tr>
                ))}
                {myViolations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-secondary">
                      You haven't reported any violations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default MyReports;
