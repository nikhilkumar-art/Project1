import React, { useState, useEffect, useRef } from 'react';
import { Search, AlertTriangle, CreditCard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './CheckFines.css';

const CheckFines = () => {
  const containerRef = useRef(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [fines, setFines] = useState([]);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.animate-item');
      gsap.fromTo(elements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  // Helper to generate a simple hash from a string
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Deterministically generate fines based on vehicle number
  const generateFinesForVehicle = (vehicleNo) => {
    const normalizedNo = vehicleNo.replace(/\s+/g, '').toUpperCase();
    if (!normalizedNo) return [];
    
    const hash = hashCode(normalizedNo);
    
    // Number of fines based on hash (0 to 3)
    const numFines = hash % 4;
    if (numFines === 0) return [];

    const violationTypes = ['Speeding', 'Illegal Parking', 'Red Light', 'No Helmet', 'Wrong Way'];
    const locations = ['Main Street Hwy', 'Downtown Avenue', 'Central Square', 'Park Road', 'Airport Expressway'];
    const generatedFines = [];

    let currentHash = hash;
    for (let i = 0; i < numFines; i++) {
      currentHash = hashCode(currentHash.toString() + i.toString());
      
      const typeIdx = currentHash % violationTypes.length;
      const locIdx = (currentHash >> 2) % locations.length;
      const amount = ((currentHash % 15) + 5) * 100; // 500 to 1900
      
      const daysAgo = (currentHash % 180) + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const dateStr = date.toISOString().split('T')[0];

      generatedFines.push({
        id: `FIN-${date.getFullYear()}-${Math.abs(currentHash).toString().substring(0, 4)}`,
        type: violationTypes[typeIdx],
        date: dateStr,
        location: locations[locIdx],
        amount: amount,
        status: 'Unpaid'
      });
    }
    return generatedFines;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) return;
    
    setIsLoading(true);
    setHasSearched(false);
    
    // Simulate API call
    setTimeout(() => {
      const results = generateFinesForVehicle(vehicleNumber);
      setFines(results);
      setIsLoading(false);
      setHasSearched(true);
    }, 1000);
  };

  const handlePay = (fineId) => {
    navigate(`/payment/${fineId}`);
  };

  return (
    <div className="fines-page animate-fade-in" ref={containerRef}>
      <div className="page-header animate-item">
        <h1>Check Your Traffic Fines</h1>
        <p className="text-secondary">Enter your vehicle registration number to view outstanding penalties.</p>
      </div>

      <div className="search-section card animate-item" style={{ animationDelay: '0.1s' }}>
        <div className="card-body">
          <label htmlFor="vehicle-search" className="form-label" style={{ textAlign: 'left', display: 'block', marginBottom: '1rem', fontSize: '1rem' }}>
            Enter Vehicle Number
          </label>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Search className="search-icon text-secondary" size={20} />
              <input
                id="vehicle-search"
                type="text"
                className="search-input form-input"
                placeholder="e.g., MH 12 AB 1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary search-btn" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search Fines'}
            </button>
          </form>
        </div>
      </div>

      {hasSearched && !isLoading && (
        <div className="results-section animate-fade-in">
          <div className="results-header">
            <h2>Results for "{vehicleNumber.toUpperCase()}"</h2>
            <div className="badge badge-warning">
              <AlertTriangle size={16} />
              <span>{fines.length} Outstanding Fines</span>
            </div>
          </div>

          <div className="fines-list">
            {fines.length === 0 ? (
              <div className="text-center py-8 text-secondary">
                <p>No outstanding fines found for this vehicle.</p>
              </div>
            ) : (
              fines.map((fine) => (
                <div key={fine.id} className="fine-card card">
                  <div className="fine-card-body card-body flex justify-between items-center">
                    <div className="fine-details">
                      <div className="fine-type">{fine.type}</div>
                      <div className="fine-meta text-secondary">
                        <span>{fine.date}</span> • <span>{fine.location}</span>
                      </div>
                      <div className="fine-id text-sm text-secondary mt-1">Ref: {fine.id}</div>
                    </div>
                    <div className="fine-action flex flex-col items-end">
                      <div className="fine-amount">₹{fine.amount}</div>
                      <button 
                        className="btn btn-primary mt-2 flex items-center gap-2"
                        onClick={() => handlePay(fine.id)}
                      >
                        <CreditCard size={16} />
                        Pay Now
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckFines;
