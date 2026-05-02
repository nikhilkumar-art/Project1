import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Camera, FileText, CheckCircle, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    // Hero Animations
    const heroElements = heroRef.current.children;
    gsap.fromTo(heroElements, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
    );

    // 3D Floating Effect on Hero Image/Element
    gsap.to('.hero-badge-float', {
      y: -20,
      rotationX: 10,
      rotationY: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Stats Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(counter, 
            { innerHTML: 0 }, 
            { 
              innerHTML: counter.getAttribute('data-target'),
              duration: 2, 
              ease: "power2.out",
              snap: { innerHTML: 1 },
              onUpdate: function() {
                counter.innerHTML = Math.round(this.targets()[0].innerHTML).toLocaleString();
              }
            }
          );
        },
        once: true
      });
    });

    // Features Zoom-in Effect
    const featureCards = gsap.utils.toArray('.feature-card');
    featureCards.forEach((card, i) => {
      gsap.fromTo(card,
        { scale: 0.8, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // FAQ Fade-up
    gsap.fromTo('.faq-item',
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 80%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const toggleFaq = (e) => {
    const content = e.currentTarget.nextElementSibling;
    const icon = e.currentTarget.querySelector('.faq-icon');
    
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      content.style.opacity = 0;
      icon.style.transform = "rotate(0deg)";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.opacity = 1;
      icon.style.transform = "rotate(180deg)";
    }
  };

  return (
    <div className="home-page">
      <section className="hero-section" ref={heroRef}>
        <div className="badge hero-badge-float">
          <ShieldCheck size={16} className="text-success" />
          <span>Official Traffic Violation Portal</span>
        </div>
        <h1 className="hero-title">Making Our Roads <br/><span className="text-gradient">Safer Together</span></h1>
        <p className="hero-subtitle">
          A modern, transparent way to report traffic violations and manage fines. 
          Empowering citizens to contribute to road safety through advanced technology.
        </p>
        <div className="hero-actions">
          <Link to="/report" className="btn btn-primary btn-lg">
            <Camera size={20} />
            Report Violation
          </Link>
          <Link to="/fines" className="btn btn-secondary btn-lg">
            Check Fines
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          <div className="stat-card card">
            <h3 className="stat-number text-gradient" data-target="15243">0</h3>
            <p>Violations Reported</p>
          </div>
          <div className="stat-card card">
            <h3 className="stat-number text-gradient" data-target="8942">0</h3>
            <p>Fines Processed</p>
          </div>
          <div className="stat-card card">
            <h3 className="stat-number text-gradient" data-target="120">0</h3>
            <p>Active Corridors Monitored</p>
          </div>
        </div>
      </section>

      <section className="features-section" ref={featuresRef}>
        <div className="section-header text-center">
          <h2 className="text-gradient">How It Works</h2>
          <p className="text-secondary">A simple, transparent process for everyone.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon-wrapper">
              <Camera size={28} />
            </div>
            <h3>1. Capture & Report</h3>
            <p>Snap a photo of the violation and submit it through our secure portal with accurate location and time details.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon-wrapper">
              <FileText size={28} />
            </div>
            <h3>2. Authority Review</h3>
            <p>Our traffic administrators review the digital evidence and issue the appropriate official fine if valid.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon-wrapper">
              <CheckCircle size={28} />
            </div>
            <h3>3. Secure Resolution</h3>
            <p>Violators can securely check their penalty status using their vehicle number and pay fines online instantly.</p>
          </div>
        </div>
      </section>

      <section className="faq-section" ref={faqRef}>
        <div className="section-header text-center">
          <h2>Frequently Asked <span className="text-gradient">Questions</span></h2>
        </div>
        <div className="faq-container">
          {[
            { q: "Is my identity kept anonymous when reporting?", a: "Yes, all citizen reports are completely anonymous. We only use the evidence provided to verify the traffic violation." },
            { q: "How long does it take for a fine to reflect on the portal?", a: "Once a report is submitted, authorities typically review and process it within 24-48 hours. Fines will appear here immediately after approval." },
            { q: "What forms of payment are accepted?", a: "We accept all major credit cards, debit cards, and secure UPI/net banking payments through our encrypted payment gateway." }
          ].map((faq, index) => (
            <div className="faq-item card" key={index}>
              <button className="faq-question" onClick={toggleFaq}>
                <h3 className="text-lg">{faq.q}</h3>
                <ChevronDown className="faq-icon text-secondary" size={20} />
              </button>
              <div className="faq-answer">
                <p className="text-secondary">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
