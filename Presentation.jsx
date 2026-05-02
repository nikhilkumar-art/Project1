import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { 
  Monitor, 
  Database, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  Layout as LayoutIcon,
  Code2,
  Server,
  Sparkles,
  Rocket
} from 'lucide-react';
import './Presentation.css';

const slides = [
  {
    id: 1,
    title: "Traffic Violation Reporting System",
    subtitle: "Revolutionizing Road Safety through Digital Innovation",
    icon: <Rocket size={60} className="text-cyan-400" />,
    content: "A professional-grade platform bridging the gap between citizens and traffic authorities.",
    type: "title"
  },
  {
    id: 2,
    title: "Core Languages",
    subtitle: "The Foundation",
    tech: [
      { name: "HTML5", desc: "Semantic Web Structure", icon: <LayoutIcon size={24} /> },
      { name: "CSS3", desc: "Advanced Neon Styling", icon: <Sparkles size={24} /> },
      { name: "JavaScript", desc: "Core Logic & Interactivity", icon: <Code2 size={24} /> },
      { name: "Node.js", desc: "Development Environment", icon: <Server size={24} /> }
    ],
    type: "tech"
  },
  {
    id: 3,
    title: "The Problem",
    subtitle: "Current Challenges",
    items: [
      "Slow and error-prone manual reporting",
      "Lack of transparency for citizens",
      "Inefficient data management for police",
      "Non-responsive legacy systems"
    ],
    icon: <Monitor size={48} />,
    type: "list"
  },
  {
    id: 3,
    title: "Frontend Tech Stack",
    subtitle: "Modern & Performant",
    tech: [
      { name: "React 19", desc: "Component-based UI Architecture", icon: <LayoutIcon size={24} /> },
      { name: "Vite", desc: "Lightning-fast Build Tooling", icon: <Zap size={24} /> },
      { name: "GSAP", desc: "High-end Cinematic Animations", icon: <Sparkles size={24} /> },
      { name: "Lucide", desc: "Premium Vector Iconography", icon: <Code2 size={24} /> }
    ],
    type: "tech"
  },
  {
    id: 4,
    title: "Backend & Services",
    subtitle: "Secure & Scalable",
    tech: [
      { name: "Firebase Firestore", desc: "Real-time NoSQL Database", icon: <Database size={24} /> },
      { name: "Firebase Auth", desc: "Secure Google & OTP Login", icon: <ShieldCheck size={24} /> },
      { name: "EmailJS", desc: "Dynamic Email Communications", icon: <Server size={24} /> },
      { name: "Vercel", desc: "Edge-optimized Deployment", icon: <Rocket size={24} /> }
    ],
    type: "tech"
  },
  {
    id: 5,
    title: "Key Features",
    subtitle: "Built for Everyone",
    items: [
      "Real-time Violation Reporting",
      "Interactive Admin Dashboard",
      "Secure Authentication Flow",
      "Live Status Tracking",
      "Premium Neon UI/UX"
    ],
    icon: <ShieldCheck size={48} />,
    type: "list"
  },
  {
    id: 7,
    title: "Future Roadmap",
    subtitle: "Scaling New Heights",
    items: [
      "AI-Powered License Plate Scanner",
      "Integrated Payment Gateways",
      "Mobile Application (iOS/Android)",
      "Real-time GPS Tracking"
    ],
    icon: <Rocket size={48} />,
    type: "list"
  }
];

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(".presentation-container", 
      { opacity: 0 }, 
      { opacity: 1, duration: 1 }
    );
  }, []);

  useEffect(() => {
    // Slide transition animation
    const tl = gsap.timeline();
    tl.to(contentRef.current, { opacity: 0, y: 20, duration: 0.3 })
      .set(contentRef.current, { y: -20 })
      .to(contentRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const renderSlideContent = (slide) => {
    switch (slide.type) {
      case "title":
        return (
          <div className="slide-content title-slide">
            <div className="icon-wrapper animate-pulse-slow">
              {slide.icon}
            </div>
            <h1 className="neon-text-blue">{slide.title}</h1>
            <p className="subtitle">{slide.subtitle}</p>
            <div className="divider"></div>
            <p className="description">{slide.content}</p>
          </div>
        );
      case "list":
        return (
          <div className="slide-content list-slide">
            <h2 className="neon-text-purple">{slide.title}</h2>
            <p className="subtitle">{slide.subtitle}</p>
            <ul className="presentation-list">
              {slide.items.map((item, index) => (
                <li key={index} className="list-item">
                  <ChevronRight className="text-cyan-400" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "tech":
        return (
          <div className="slide-content tech-slide">
            <h2 className="neon-text-cyan">{slide.title}</h2>
            <p className="subtitle">{slide.subtitle}</p>
            <div className="tech-grid">
              {slide.tech.map((t, index) => (
                <div key={index} className="tech-card glass-card">
                  <div className="tech-icon">{t.icon}</div>
                  <div className="tech-info">
                    <h3>{t.name}</h3>
                    <p>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="presentation-container">
      <div className="presentation-progress">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={`progress-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>

      <div className="slide-wrapper" ref={slideRef}>
        <div ref={contentRef}>
          {renderSlideContent(slides[currentSlide])}
        </div>
      </div>

      <div className="presentation-controls">
        <button 
          onClick={prevSlide} 
          disabled={currentSlide === 0}
          className="control-btn prev"
        >
          <ChevronLeft size={24} />
          <span>Previous</span>
        </button>
        <div className="slide-number">
          {currentSlide + 1} / {slides.length}
        </div>
        <button 
          onClick={nextSlide} 
          disabled={currentSlide === slides.length - 1}
          className="control-btn next"
        >
          <span>Next</span>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="presentation-footer">
        Traffic Violation System Project Presentation • 2024
      </div>
    </div>
  );
};

export default Presentation;
