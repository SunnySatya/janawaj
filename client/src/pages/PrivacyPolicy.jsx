import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="pt-16 md:pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link
          to="/signup"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm mb-6 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Sign Up</span>
        </Link>
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FaShieldAlt className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-[Playfair_Display]">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: January 2025
              </p>
            </div>
          </div>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us, including
                your name, email address, and profile information when you
                create an account. We also collect information about your
                interactions with our platform, including articles you read,
                polls you participate in, and discussions you engage in.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                2. How We Use Your Information
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    To provide, maintain, and improve our platform and services.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    To personalize your experience and deliver content relevant
                    to your interests.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    To communicate with you about updates, security alerts, and
                    support.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    To monitor and analyze usage patterns to improve our
                    platform.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    To protect against unauthorized access and ensure platform
                    security.
                  </span>
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                3. Information Sharing
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share anonymized, aggregate data for
                analytical purposes. We may disclose information if required by
                law or to protect our rights and the safety of our users.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                4. Data Security
              </h2>
              <p>
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over
                the Internet is 100% secure. We strive to protect your data but
                cannot guarantee absolute security.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                5. Your Rights
              </h2>
              <p>
                You have the right to access, update, or delete your personal
                information at any time. You can manage your account settings or
                contact us to exercise these rights. We will respond to your
                request within a reasonable timeframe.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                6. Cookies
              </h2>
              <p>
                We use cookies and similar tracking technologies to enhance your
                experience. You can control cookie preferences through your
                browser settings. We use essential cookies for platform
                functionality and analytics cookies to improve our services.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                7. Third-Party Services
              </h2>
              <p>
                Our platform may contain links to third-party websites. We are
                not responsible for the privacy practices of these external
                sites. We encourage you to review their privacy policies before
                providing any personal information.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. We will
                notify users of significant changes via email or platform
                notice. Continued use of the platform after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                9. Contact
              </h2>
              <p>
                If you have any questions about this privacy policy, please
                contact us at{" "}
                <a
                  href="mailto:janawajmanage@gmail.com"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  janawajmanage@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
