import React from 'react';
import Header from './Header'; // Removed .jsx extension for common resolution
import Footer from './Footer'; // Removed .jsx extension for common resolution

const Contact = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Header onNavigate={onNavigate} /> {/* Pass onNavigate to Header */}

      <main className="pt-24 container mx-auto p-4 flex-grow">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              We'd love to hear from you! Whether you have questions, feedback, or need support,
              feel free to reach out to us using the information below.
            </p>
            <div className="text-center mt-6 space-y-3">
              <p className="text-xl font-semibold">Email:</p>
              <p className="text-blue-600 hover:underline"><a href="mailto:support@scanmeapp.com">support@scanmeapp.com</a></p>
              <p className="text-xl font-semibold mt-4">Address (Conceptual):</p>
              <p>Scan Me App Headquarters</p>
              <p>123 Security Lane</p>
              <p>Cyberville, ST 98765</p>
              <p>Internet</p>
            </div>
            <p className="mt-6">
              We strive to respond to all inquiries within 24-48 business hours. Thank you for your patience!
            </p>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate('home')}
              className="mt-4 bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition-colors duration-200 shadow-lg font-inter"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} /> {/* Pass onNavigate to Footer */}
    </div>
  );
};

export default Contact;
