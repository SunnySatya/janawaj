import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaNewspaper,
  FaUserPlus,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, error, setError, loading, socialLoading } =
    useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agree: false,
  });
  const [localLoading, setLocalLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    setLocalLoading(true);
    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    });
    setLocalLoading(false);
    if (result.success) {
      navigate("/");
    }
  };

  const isSubmitting = localLoading || loading || !!socialLoading;

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result?.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
              <FaNewspaper className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-[Playfair_Display]">
              Create Account
            </h2>
            <p className="text-gray-500 mt-2">Join Janawaj and stay informed</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <FaExclamationCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 bg-gray-50/50"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 bg-gray-50/50"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 bg-gray-50/50"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Agree to Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer mt-1"
                  id="agree"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="agree"
                  className="ml-2 text-sm text-gray-600 cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms-of-service"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {socialLoading === "google" ? (
                <FaSpinner className="w-4 h-4 animate-spin text-red-500" />
              ) : (
                <FaGoogle className="w-4 h-4 text-red-500" />
              )}
              <span>Sign up with Google</span>
            </button>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
