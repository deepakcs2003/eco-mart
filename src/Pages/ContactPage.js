import React, { useState, useEffect } from 'react';
import { Send, Mail, Phone, MapPin, Leaf, Recycle, Sprout, Wind } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [displayText, setDisplayText] = useState([]);
  const headingText = ['Get', 'in', 'Touch', 'with', 'Nature'];

  useEffect(() => {
    const timer = setTimeout(() => {
      headingText.forEach((word, index) => {
        setTimeout(() => {
          setDisplayText(prev => [...prev, word]);
        }, index * 500);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-amber-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Floating Nature Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <Leaf className="w-8 h-8 text-green-700 opacity-50" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Sprout className="w-10 h-10 text-green-600 opacity-50" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float">
          <Wind className="w-8 h-8 text-teal-700 opacity-50" />
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 flex justify-center gap-3 flex-wrap">
            {displayText.map((word, index) => (
              <span 
                key={index}
                className="text-green-700 hover:text-teal-700 transition-colors duration-300 transform hover:scale-105 inline-block"
              >
                {word}
              </span>
            ))}
          </h1>
          <p className="text-teal-700 text-lg max-w-2xl mx-auto mt-4">
            Join us in making the world greener, one sustainable choice at a time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-green-50 bg-opacity-90 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <Mail className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-teal-700 mb-2">Email Us</h3>
            <p className="text-amber-800">green@ecomart.com</p>
          </div>

          <div className="bg-green-50 bg-opacity-90 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <Phone className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-teal-700 mb-2">Call Us</h3>
            <p className="text-amber-800">+1 (555) ECO-MART</p>
          </div>

          <div className="bg-green-50 bg-opacity-90 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <MapPin className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-teal-700 mb-2">Visit Us</h3>
            <p className="text-amber-800">123 Green Valley, Eco City</p>
          </div>
        </div>

        <div className="bg-green-50 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Recycle className="w-12 h-12 text-green-700 animate-spin-slow" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-teal-700 mb-2" htmlFor="name">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 bg-white bg-opacity-50 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-teal-700 mb-2" htmlFor="email">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 bg-white bg-opacity-50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-teal-700 mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 bg-white bg-opacity-50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-teal-700 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 bg-white bg-opacity-50 transition-all duration-300"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-4 px-6 rounded-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
            >
              <span className="text-lg">Send Message</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>
        </div>
      </div>

      {/* Add animations with CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;