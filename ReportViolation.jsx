import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { addViolation } from '../utils/db';
import { useAuth } from '../contexts/AuthContext';
import './ReportViolation.css';

const ReportViolation = () => {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    violationType: 'Speeding',
    location: '',
    date: '',
    time: '',
    description: ''
  });

  useEffect(() => {
    if (containerRef.current && !isSubmitted) {
      const elements = containerRef.current.querySelectorAll('.animate-item');
      gsap.fromTo(elements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [isSubmitted]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Save to Firebase Firestore
      await addViolation(formData, user?.email || 'anonymous');
      setTimeout(() => {
        setIsSubmitted(true);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Submission failed", error);
      setIsLoading(false);
      alert("Failed to submit report. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="report-page animate-fade-in">
        <div className="success-card card text-center">
          <div className="success-icon-wrapper">
            <CheckCircle size={64} className="text-success" />
          </div>
          <h2>Report Submitted Successfully!</h2>
          <p className="text-secondary mt-4 mb-8">
            Thank you for helping keep our roads safe. Our traffic authorities will review the evidence provided.
          </p>
          <button className="btn btn-primary" onClick={() => setIsSubmitted(false)}>
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page animate-fade-in" ref={containerRef}>
      <div className="page-header animate-item">
        <h1>Report a Traffic Violation</h1>
        <p className="text-secondary">Provide details and evidence of the traffic violation you witnessed.</p>
      </div>

      <div className="report-container">
        <div className="report-info animate-item">
          <div className="info-card card">
            <div className="info-header flex items-center gap-2 mb-4">
              <AlertCircle className="text-warning" />
              <h3>Guidelines</h3>
            </div>
            <ul className="guidelines-list">
              <li>Ensure the vehicle license plate is clearly visible in the photo.</li>
              <li>Provide accurate date, time, and location information.</li>
              <li>Do not use your phone while driving to capture evidence.</li>
              <li>False reporting may lead to penalties.</li>
            </ul>
          </div>
        </div>

        <div className="report-form-wrapper card animate-item" style={{ animationDelay: '0.2s' }}>
          <form className="report-form card-body" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Vehicle Registration Number *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="e.g., MH 12 AB 1234" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Violation Type *</label>
                <select 
                  className="form-input"
                  name="violationType"
                  value={formData.violationType}
                  onChange={handleChange}
                  required
                >
                  <option value="Speeding">Speeding</option>
                  <option value="Red Light">Running Red Light</option>
                  <option value="Wrong Way">Wrong Way Driving</option>
                  <option value="No Helmet">Riding without Helmet</option>
                  <option value="No Seatbelt">Driving without Seatbelt</option>
                  <option value="Illegal Parking">Illegal Parking</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input 
                type="text" 
                className="form-input" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Street name, landmark, or GPS coordinates" 
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input 
                  type="date" 
                  className="form-input" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time *</label>
                <input 
                  type="time" 
                  className="form-input" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Evidence (Photo/Video) *</label>
              <div className="upload-area">
                <UploadCloud size={40} className="text-secondary mb-4" />
                <p><strong>Click to upload</strong> or drag and drop</p>
                <p className="text-sm text-secondary">PNG, JPG, MP4 up to 10MB</p>
                <input type="file" className="file-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Description (Optional)</label>
              <textarea 
                className="form-input textarea" 
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide any additional context..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportViolation;
