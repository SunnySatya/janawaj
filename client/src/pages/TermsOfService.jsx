import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

const TermsOfService = () => {
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
                Terms of Service
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: January 2025
              </p>
            </div>
          </div>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using Janawaj (the Platform), you agree to be
                bound by these Terms of Service. If you do not agree with any
                part of these terms, you may not use our services.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                2. User Accounts
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    You must provide accurate and complete information when
                    creating an account.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    You are responsible for maintaining the confidentiality of
                    your account credentials.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    You must notify us immediately of any unauthorized use of
                    your account.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    We reserve the right to suspend or terminate accounts that
                    violate our terms.
                  </span>
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                3. User Conduct
              </h2>
              <p className="mb-3">As a user of Janawaj, you agree to:</p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    Post accurate and respectful content in discussions and
                    comments.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    Not engage in harassment, hate speech, or any form of
                    discrimination.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    Not post spam, misleading information, or malicious content.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    Respect the intellectual property rights of others.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                  <span>
                    Not attempt to disrupt or compromise the platform security.
                  </span>
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                4. Content Ownership
              </h2>
              <p>
                Users retain ownership of the content they post on Janawaj. By
                posting content, you grant Janawaj a non-exclusive, royalty-free
                license to display and distribute your content on our platform.
                We respect your rights and will not use your content outside of
                the platform without your consent.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                5. Privacy
              </h2>
              <p>
                Your privacy is important to us. Please review our{" "}
                <Link
                  to="/privacy-policy"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Privacy Policy
                </Link>{" "}
                to understand how we collect, use, and protect your personal
                information.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                6. Limitation of Liability
              </h2>
              <p>
                Janawaj is provided "as is" without any warranties. We are not
                liable for any damages arising from the use of our platform. We
                do not guarantee that the platform will be uninterrupted or
                error-free.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                7. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Users
                will be notified of significant changes. Continued use of the
                platform after changes constitutes acceptance of the new terms.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-[Playfair_Display]">
                8. Contact
              </h2>
              <p>
                For questions about these terms, please contact us at{" "}
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

export default TermsOfService;
