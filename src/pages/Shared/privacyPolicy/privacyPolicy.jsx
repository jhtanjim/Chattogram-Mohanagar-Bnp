import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800 und">Privacy Policy</h1>

      <p className="mb-4">
        Welcome to <strong>e-BNP, Chattogram Mohanogor</strong>. We are committed to protecting your privacy and ensuring transparency in how we collect, use, and store your personal information.
      </p>
      <p className="mb-6">
        By using our web application ("e-BNP", "we", "our", or "us"), you agree to the collection and use of information in accordance with this Privacy Policy.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-red-700">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Full Name</li>
          <li>Profile Image or Photograph</li>
          <li>Contact Information (e.g., phone number, email address)</li>
          <li>National ID or other identity documentation (if applicable)</li>
          <li>Address or Location Information</li>
          <li>User-submitted content such as forms, feedback, or applications</li>
          <li>Technical Data including IP address, browser type, device information, and usage statistics</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-red-700">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Identify and verify users</li>
          <li>Maintain accurate member records</li>
          <li>Improve the services and functionality of e-BNP</li>
          <li>Facilitate internal communication and organization planning</li>
          <li>Provide administrative support</li>
          <li>Comply with legal or regulatory requirements</li>
        </ul>
        <p className="mt-2">We do not sell or rent your personal information to third parties.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-red-700">3. Data Storage and Security</h2>
        <p>
          Your data is securely stored in our systems. We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
        </p>
        <p className="mt-2">
          Despite our efforts, no method of electronic transmission or storage is 100% secure. We encourage you to take precautions to protect your own information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-red-700">4. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, or as required by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-red-700">5. Sharing of Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Authorized personnel within the organization</li>
          <li>Service providers (under confidentiality agreements)</li>
          <li>Government or legal authorities, if required by law</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-red-700">6. Your Rights</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Withdraw your consent at any time (where applicable)</li>
        </ul>
        <p className="mt-2">
          To exercise these rights, please contact us using the contact information provided on the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-red-700">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Effective Date".
        </p>
        <p className="mt-2">
          We encourage you to review this Privacy Policy periodically.
        </p>
      </section>

    </div>
  );
};

export default PrivacyPolicy;
