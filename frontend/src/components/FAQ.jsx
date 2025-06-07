import React, { useState } from 'react';

// A simple reusable Accordion Item component for FAQs
const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200 py-3">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-800 focus:outline-none"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="py-2 text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <AccordionItem title="What is Scan Me App?">
          Scan Me App is a free online tool that allows you to scan URLs for potential malware, phishing,
          and other online threats. It leverages the powerful VirusTotal API to provide comprehensive scan reports.
        </AccordionItem>

        <AccordionItem title="How does Scan Me App work?">
          When you enter a URL and click 'Scan URL', our backend sends that URL to the VirusTotal API.
          VirusTotal then scans the URL using multiple antivirus engines and website scanners,
          and sends the results back to our app for display.
        </AccordionItem>

        <AccordionItem title="Is Scan Me App free to use?">
          Yes, Scan Me App is completely free to use. We aim to provide a simple and effective
          tool for checking URL safety.
        </AccordionItem>

        <AccordionItem title="Do you store my scanned URLs?">
          No, we do not store a history of the URLs you submit on our servers. The URLs are
          sent directly to the VirusTotal API for analysis and are not retained by our application
          after the scan results are displayed.
        </AccordionItem>

        <AccordionItem title="What is VirusTotal?">
          VirusTotal is a free online service that analyzes suspicious files and URLs to detect
          types of malware and other malicious content. It uses various antivirus engines and
          website scanners to provide a comprehensive analysis.
        </AccordionItem>

        <AccordionItem title="What do the scan results mean?">
          The scan results show you how many security vendors flagged the URL as malicious
          ("Positives") out of the total number of scanners used. You can also see individual
          scanner reports, indicating whether a specific engine detected an issue and what
          the detected threat was.
        </AccordionItem>

        <AccordionItem title="Can I scan any URL?">
          You can scan most public URLs. However, scanning private URLs or those requiring
          authentication may not yield accurate results, as VirusTotal might not have access to them.
        </AccordionItem>

        <AccordionItem title="What should I do if a URL is flagged as malicious?">
          If a URL is flagged as malicious, it's strongly advised not to visit it. Such URLs
          can lead to malware infections, phishing attempts, or other cyber threats.
        </AccordionItem>
      </div>
    </div>
  );
};

export default FAQ;
