import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Terms of Service</h2>
      <div className="text-gray-700 leading-relaxed space-y-4">
        <p><strong>Last Updated: June 7, 2025</strong></p>
        <p>
          Welcome to Scan Me App. These Terms of Service ("Terms") govern your access to and use of the
          Scan Me App website and services ("Service"). By accessing or using the Service, you agree
          to be bound by these Terms. If you disagree with any part of the terms, then you may not
          access the Service.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">1. Use of Service</h3>
        <p>
          The Scan Me App provides a tool to scan URLs for potential threats using the VirusTotal API.
          You agree to use the Service only for lawful purposes and in a way that does not infringe
          the rights of, restrict or inhibit anyone else's use and enjoyment of the Service.
        </p>
        <h4 className="text-xl font-medium text-gray-700 mt-4 mb-2">1.1. Prohibited Uses</h4>
        <p>You agree not to use the Service:</p>
        <ul className="list-disc list-inside ml-4">
          <li>In any way that violates any applicable national or international law or regulation.</li>
          <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
          <li>To impersonate or attempt to impersonate Scan Me App, a Scan Me App employee, another user, or any other person or entity.</li>
          <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm Scan Me App or users of the Service or expose them to liability.</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">2. Intellectual Property</h3>
        <p>
          The Service and its original content, features, and functionality are and will remain the
          exclusive property of Scan Me App and its licensors. Our trademarks and trade dress may not
          be used in connection with any product or service without the prior written consent of Scan Me App.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">3. Third-Party Services</h3>
        <p>
          The Service relies on the VirusTotal API for its core functionality. By using our Service,
          you acknowledge and agree to abide by the terms of service and privacy policy of VirusTotal.
          We are not responsible for the content, privacy policies, or practices of any third-party
          web sites or services.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">4. Disclaimer of Warranties</h3>
        <p>
          Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and
          "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether
          express or implied, including, but not limited to, implied warranties of merchantability,
          fitness for a particular purpose, non-infringement, or course of performance.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">5. Limitation of Liability</h3>
        <p>
          In no event shall Scan Me App, nor its directors, employees, partners, agents, suppliers,
          or affiliates, be liable for any indirect, incidental, special, consequential or punitive
          damages, including without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from (i) your access to or use of or inability to access or
          use the Service; (ii) any conduct or content of any third party on the Service; (iii) any
          content obtained from the Service; and (iv) unauthorized access, use or alteration of your
          transmissions or content, whether based on warranty, contract, tort (including negligence)
          or any other legal theory, whether or not we have been informed of the possibility of such
          damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">6. Governing Law</h3>
        <p>
          These Terms shall be governed and construed in accordance with the laws of [Your Country/State],
          without regard to its conflict of law provisions.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">7. Changes to Terms</h3>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
          By continuing to access or use our Service after those revisions become effective, you agree
          to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">8. Contact Us</h3>
        <p>
          If you have any questions about these Terms, please contact us at support@scanmeapp.com.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
