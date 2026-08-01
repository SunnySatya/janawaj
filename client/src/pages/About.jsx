import React from "react";
import { Link } from "react-router-dom";
import {
  FaNewspaper,
  FaUsers,
  FaGlobeAsia,
  FaBalanceScale,
  FaMicrophoneAlt,
  FaHandHoldingHeart,
  FaQuoteLeft,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { HiShieldCheck, HiLightBulb } from "react-icons/hi";

const About = () => {
  const features = [
    {
      icon: <FaBalanceScale className="w-8 h-8" />,
      title: "पूर्णतः स्वतंत्र",
      titleEn: "Completely Independent",
      description:
        "We are not affiliated with any political party, corporate house, or government. Our only allegiance is to the truth and the people of this nation.",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "जनता के हाथों में",
      titleEn: "In Public's Hands",
      description:
        "This platform is owned and managed by the people, for the people. Every citizen has a voice here — to share, discuss, and shape the nation's discourse.",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: <FaMicrophoneAlt className="w-8 h-8" />,
      title: "देश के महत्वपूर्ण मुद्दे",
      titleEn: "Nation's Key Issues",
      description:
        "We focus exclusively on the most critical issues facing our country — from policy and governance to social justice, economy, and national security.",
      color: "text-primary-500",
      bgColor: "bg-primary-50",
    },
    {
      icon: <FaHandHoldingHeart className="w-8 h-8" />,
      title: "बिना किसी दबाव के",
      titleEn: "Without Any Pressure",
      description:
        "No corporate sponsors, no political pressure, no hidden agendas. Our content is driven purely by what matters most to the citizens of this nation.",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  const principles = [
    {
      icon: <HiShieldCheck className="w-6 h-6" />,
      title: "Transparency",
      description: "Complete transparency in our operations and funding.",
    },
    {
      icon: <FaBalanceScale className="w-6 h-6" />,
      title: "Neutrality",
      description: "Unbiased reporting without any political leaning.",
    },
    {
      icon: <HiLightBulb className="w-6 h-6" />,
      title: "Public First",
      description: "Every decision prioritizes the public interest above all.",
    },
    {
      icon: <FaGlobeAsia className="w-6 h-6" />,
      title: "National Focus",
      description: "Zeroing in on issues that shape our nation's future.",
    },
  ];

  const stats = [
    { value: "100%", label: "Independent", sublabel: "No external influence" },
    { value: "24/7", label: "People-Powered", sublabel: "Run by citizens" },
    { value: "742", label: "Stories Covered", sublabel: "Nation's key issues" },
    { value: "21,000+", label: "Active Voices", sublabel: "Citizens engaged" },
  ];

  return (
    <div className="pt-16 md:pt-20">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/15 text-white text-xs font-semibold rounded-full uppercase tracking-wider mb-4 backdrop-blur-sm border border-white/10">
              About Us
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-[Playfair_Display] leading-tight mb-6">
              <span className="block">A Platform That Belongs</span>
              <span className="block text-primary-200">To The People</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed mb-8">
              <strong>Janawaj</strong> — where the nation's most important
              conversations happen. We are a completely independent,
              citizen-powered platform dedicated to discussing the critical
              issues that shape our country's future. No agendas. No influence.
              Just the voice of the people.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaNewspaper className="w-4 h-4" />
                <span>Explore News</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
              >
                <span>Join the Conversation</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION STATEMENT ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-6">
              <FaQuoteLeft className="w-7 h-7 text-primary-600" />
            </div>
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-900 font-[Playfair_Display] leading-relaxed italic">
              "This platform is not owned by any corporation, political party,
              or individual. It belongs to the people of this nation — a space
              where citizens discuss the most important issues facing our
              country, free from any external pressure or influence."
            </blockquote>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-8 h-px bg-gray-300"></div>
              <span>Janawaj — The People's Voice</span>
              <div className="w-8 h-px bg-gray-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 font-[Playfair_Display] mb-1">
                  {stat.value}
                </div>
                <div className="text-base md:text-lg font-semibold text-gray-900">
                  {stat.label}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CORE PILLARS ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
              Our Foundation
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-[Playfair_Display]">
              What Makes Us Different
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              We are built on four core principles that ensure we stay true to
              our mission of serving the nation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center ${feature.color} mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-bold ${feature.color} mb-1`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 italic mb-3">
                  {feature.titleEn}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR PRINCIPLES ===== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
                Our Commitment
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 font-[Playfair_Display] mb-6">
                A Platform Built On{" "}
                <span className="text-primary-600">Trust & Transparency</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                In a world where media is often controlled by powerful
                interests, Janawaj stands as a beacon of independence. We are
                funded by the people, run by the people, and answer only to the
                people. Every article, every discussion, every debate — is
                focused solely on what matters most for our nation.
              </p>

              <div className="space-y-4">
                {principles.map((principle, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0 mt-0.5">
                      {principle.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {principle.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl">
                <h3 className="text-xl md:text-2xl font-bold font-[Playfair_Display] mb-6">
                  Why Janawaj?
                </h3>
                <ul className="space-y-4">
                  {[
                    "We discuss the most important topics of the nation — not just what's trending.",
                    "We are 100% independent — no political or corporate influence.",
                    "This platform is in the hands of the public — managed by citizens, for citizens.",
                    "No hidden agenda — our only goal is to inform, engage, and empower.",
                    "Every voice matters — we believe in democratic discourse.",
                    "We prioritize national interest over any individual or group interest.",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <FaCheckCircle className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-primary-100">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative */}
              <div className="hidden lg:block absolute -bottom-4 -right-4 w-24 h-24 bg-amber-400/20 rounded-full blur-xl"></div>
              <div className="hidden lg:block absolute -top-4 -left-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-900 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white font-[Playfair_Display] mb-4">
            Be Part of the Change
          </h2>
          <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto mb-8">
            This platform belongs to you. Join the conversation, share your
            voice, and help shape the national discourse — because the most
            important topics of the country deserve to be discussed by the
            people, for the people.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              <FaUsers className="w-4 h-4" />
              <span>Join Janawaj Today</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
            >
              <span>Share Your Thoughts</span>
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
