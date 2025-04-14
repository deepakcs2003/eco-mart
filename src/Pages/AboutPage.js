// About.js
import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-100">
    <i className={`feather ${icon} text-green-500 text-3xl mb-4`}></i>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatisticBox = ({ number, label }) => (
  <div className="bg-green-50 rounded-lg p-6 text-center">
    <h2 className="text-4xl font-bold text-green-600 mb-2">{number}</h2>
    <p className="text-gray-700 font-medium">{label}</p>
  </div>
);

const About = () => {
  return (
    <div className="font-[Poppins] text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-teal-400 text-white py-24 px-6 text-center rounded-b-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Making Sustainable Shopping Simple</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
          Your one-stop destination for eco-friendly products that make a difference
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 relative">
          <span className="bg-green-100 px-4 py-1 rounded-lg">Our Mission</span>
        </h2>
        <p className="text-lg leading-relaxed text-gray-700 text-center">
          At EcoMart, we're committed to making sustainable living accessible to everyone. 
          We believe that small changes in shopping habits can lead to significant positive 
          impacts on our planet. By bringing together eco-friendly products from various 
          sources, we make it easier for you to make environmentally conscious choices.
        </p>
      </section>

      {/* Statistics Section */}
      <section className="bg-green-900 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatisticBox number="10K+" label="Eco Products" />
          <StatisticBox number="50+" label="Trusted Brands" />
          <StatisticBox number="100K+" label="Happy Users" />
        </div>
      </section>

      {/* Key Features Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
          <span className="border-b-4 border-green-400 pb-2">What Makes Us Different</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            <span className="bg-green-100 px-4 py-1 rounded-lg">Powered by Technology</span>
          </h2>
          <div className="space-y-6">
            <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
              <i className="feather cpu text-green-500 text-2xl mr-4"></i>
              <span className="text-lg font-medium">AI-Powered Product Summaries</span>
            </div>
            <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
              <i className="feather trending-up text-green-500 text-2xl mr-4"></i>
              <span className="text-lg font-medium">Smart Recommendations</span>
            </div>
            <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
              <i className="feather shield text-green-500 text-2xl mr-4"></i>
              <span className="text-lg font-medium">Secure Shopping Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-500 text-white py-16 px-6 rounded-t-3xl mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Green Revolution</h2>
          <p className="text-lg mb-8 opacity-90">
            Be part of the community that's making a difference, one purchase at a time.
            Together, we can create a more sustainable future for our planet.
          </p>
          <a href='/' className="bg-white text-green-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-green-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Get Started
          </a>
        </div>
      </section>
      
      {/* Script for Feather Icons */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.28.0/feather.min.js"></script>
      <script>
        {`
          document.addEventListener('DOMContentLoaded', () => {
            feather.replace();
          });
        `}
      </script>
    </div>
  );
};

export default About;