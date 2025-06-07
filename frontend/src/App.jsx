import React from 'react';
import Header from './components/Header.jsx';    // Corrected import path
import Scanner from './components/Scanner.jsx';  // Corrected import path
import Footer from './components/Footer.jsx';    // Corrected import path

// App Component: The main application component.
// It orchestrates the layout and renders the Header, Scanner, and Footer components.
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Render the Header component at the top of the application. */}
      <Header />

      {/* Main content area for the URL Threat Scanner.
          pt-24: Adds top padding to ensure content is not obscured by the fixed header.
          container mx-auto: Centers the content horizontally and sets a max-width for readability.
          p-4: Adds general padding around the content.
      */}
      <main className="pt-24 container mx-auto p-4">
        {/* Main title of the application. */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          URL Threat Scanner
        </h1>

        {/* Render the Scanner component, which handles URL input and displays scan results. */}
        <Scanner />
      </main>

      {/* Render the Footer component at the bottom of the application. */}
      <Footer />
    </div>
  );
};

export default App;
