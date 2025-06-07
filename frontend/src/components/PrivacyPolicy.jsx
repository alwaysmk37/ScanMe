import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Privacy Policy</h2>
      <div className="text-gray-700 leading-relaxed space-y-4">
        <p><strong>Effective Date: June 7, 2025</strong></p>
        <p>
          Welcome to Scan Me App. We are committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you use our URL scanning service.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">1. Information We Collect</h3>
        <p>
          When you use Scan Me App to scan a URL, we collect the URL you submit. We do not collect any personal
          identifiable information (PII) such as your name, email address, or IP address directly from your use
          of the scanning feature.
        </p>
        <h4 className="text-xl font-medium text-gray-700 mt-4 mb-2">1.1. URLs Submitted for Scanning</h4>
        <p>
          The URLs you submit are sent to the VirusTotal API for analysis. VirusTotal is a third-party service,
          and their privacy policy governs how they handle the data they receive. We do not store a history of URLs
          you submit on our servers.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h3>
        <p>
          The URLs collected are used solely for the purpose of providing the URL scanning service through the
          VirusTotal API. We do not use this information for advertising, tracking, or any other commercial purposes.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">3. Disclosure of Your Information</h3>
        <p>
          We do not share any information with third parties, except for the URLs submitted, which are
          shared with the VirusTotal API as part of the service's core functionality.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">4. Data Security</h3>
        <p>
          We implement a variety of security measures to maintain the safety of your information. However,
          no method of transmission over the Internet, or method of electronic storage, is 100% secure.
          While we strive to use commercially acceptable means to protect your information, we cannot
          guarantee its absolute security.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">5. Third-Party Services</h3>
        <p>
          Our application utilizes the VirusTotal API. Your use of the URL scanning feature means that the
          URLs you submit will be processed by VirusTotal. We encourage you to review their privacy policy
          to understand their data practices.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">6. Changes to This Privacy Policy</h3>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting
          the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically
          for any changes.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">7. Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us at support@scanmeapp.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
