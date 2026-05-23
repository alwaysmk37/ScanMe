import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800/80 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-bold text-slate-200 hover:text-blue-400 focus:outline-none transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-slate-400 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl space-y-6">
      <h2 className="text-3xl font-extrabold text-slate-100 flex items-center justify-center gap-2 mb-2">
        <HelpCircle className="text-blue-500" />
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-slate-800">
        <AccordionItem title="What is the ScanMe suite?">
          ScanMe is a comprehensive client-side security platform that performs instant threat intelligence lookups on URLs, files, vulnerabilities (CVEs), and email headers to safeguard your daily operations.
        </AccordionItem>

        <AccordionItem title="How does the file scan work?">
          You can look up the threat level of any file using its SHA-256 hash, or upload the file directly. Our backend connects with VirusTotal's API to run the file across dozens of active antiviruses and returns their verdicts.
        </AccordionItem>

        <AccordionItem title="What is email header analysis?">
          By analyzing raw message headers, ScanMe checks if cryptographic certificates (DKIM, SPF, DMARC) pass alignment rules. It maps hops to visualize the exact route a mail took from the sender to your inbox.
        </AccordionItem>

        <AccordionItem title="Are queries saved in MongoDB?">
          Yes. To keep a clear audit trail of past threats, each search category, status, execution timestamp, and user IP location is recorded inside your MongoDB instance.
        </AccordionItem>
      </div>
    </div>
  );
};

export default FAQ;
