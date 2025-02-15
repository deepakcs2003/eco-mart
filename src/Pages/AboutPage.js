// About.js
import React from 'react';
import './About.css';

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <i className={`feather ${icon} feature-icon`}></i>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

const StatisticBox = ({ number, label }) => (
  <div className="statistic-box">
    <h2 className="statistic-number">{number}</h2>
    <p className="statistic-label">{label}</p>
  </div>
);

const About = () => {
  return (
    <div className="about-container">
      {/* Google Fonts import for Poppins */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Feather icons CSS */}
      <link href="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.css" rel="stylesheet" />
      
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Making Sustainable Shopping Simple</h1>
        <p className="hero-subtitle">
          Your one-stop destination for eco-friendly products that make a difference
        </p>
      </section>

      {/* Mission Section */}
      <section className="section">
        <h2 className="section-title">Our Mission</h2>
        <p className="mission-text">
          At EcoMart, we're committed to making sustainable living accessible to everyone. 
          We believe that small changes in shopping habits can lead to significant positive 
          impacts on our planet. By bringing together eco-friendly products from various 
          sources, we make it easier for you to make environmentally conscious choices.
        </p>
      </section>

      {/* Statistics Section */}
      <section className="statistics-container">
        <StatisticBox number="10K+" label="Eco Products" />
        <StatisticBox number="50+" label="Trusted Brands" />
        <StatisticBox number="100K+" label="Happy Users" />
      </section>

      {/* Key Features Section */}
      <section className="section">
        <h2 className="section-title">What Makes Us Different</h2>
        <div className="features-grid">
          <FeatureCard
            icon="search"
            title="Smart Product Discovery"
            description="AI-powered search and filtering to help you find the perfect sustainable products"
          />
          <FeatureCard
            icon="archive"
            title="Curated Collections"
            description="Carefully selected eco-friendly products from verified suppliers"
          />
          <FeatureCard
            icon="award"
            title="Sustainability Ratings"
            description="Transparent scoring system to evaluate environmental impact"
          />
          <FeatureCard
            icon="users"
            title="Community Driven"
            description="Real reviews and recommendations from eco-conscious shoppers"
          />
        </div>
      </section>

      {/* Technology Section */}
      <section className="section">
        <h2 className="section-title">Powered by Technology</h2>
        <div className="technology-list">
          <div className="technology-item">
            <i className="feather cpu technology-icon"></i>
            <span className="technology-text">AI-Powered Product Summaries</span>
          </div>
          <div className="technology-item">
            <i className="feather trending-up technology-icon"></i>
            <span className="technology-text">Smart Recommendations</span>
          </div>
          <div className="technology-item">
            <i className="feather shield technology-icon"></i>
            <span className="technology-text">Secure Shopping Experience</span>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="join-section">
        <h2 className="join-title">Join the Green Revolution</h2>
        <p className="join-text">
          Be part of the community that's making a difference, one purchase at a time.
          Together, we can create a more sustainable future for our planet.
        </p>
        <button className="join-button">Get Started</button>
      </section>
    </div>
  );
};

export default About;