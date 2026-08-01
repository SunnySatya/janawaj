import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaBookmark,
  FaRegHeart,
  FaRegBookmark,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaSpinner,
} from "react-icons/fa";
import { HiClock } from "react-icons/hi";
import { handleImageError } from "../utils/imageFallback";

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/news/${id}`);
      const newsData = res.data.data.news;
      setNews(newsData);
      setRelatedNews(res.data.data.relatedNews || []);
      setLikesCount(newsData.likes?.length || 0);
      // Check if current user has liked
      if (user && newsData.likes) {
        setIsLiked(newsData.likes.includes(user._id));
      }
      if (user && newsData.saves) {
        setIsSaved(newsData.saves.includes(user._id));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.put(`/api/news/${id}/like`);
      setIsLiked(res.data.data.isLiked);
      setLikesCount(res.data.data.likes);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.put(`/api/news/${id}/save`);
      setIsSaved(res.data.data.isSaved);
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  const handleShareCount = async () => {
    try {
      await axios.put(`/api/news/${id}/share`);
    } catch (err) {
      // Non-critical
    }
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(news?.title || "");
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      default:
        return;
    }

    handleShareCount();
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleNativeShare = async () => {
    handleShareCount();
    if (navigator.share) {
      try {
        await navigator.share({
          title: news?.title,
          text: news?.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-16 md:pt-20 min-h-screen flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="pt-16 md:pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            News Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            {error || "The requested news article could not be found."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Image */}
      <div className="relative h-[25vh] md:h-[35vh] overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <article className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors mb-6 text-sm"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back to News</span>
          </Link>

          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
              {news.category}
            </span>
            <span className="text-sm text-gray-500 flex items-center space-x-1">
              <HiClock className="w-4 h-4" />
              <span>{formatDate(news.publishedAt)}</span>
            </span>
            <span className="text-sm text-gray-500">
              {news.views || 0} views
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 font-[Playfair_Display] leading-tight mb-4">
            {news.title}
          </h1>

          {/* Author */}
          {news.author && (
            <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-sm">
                  {news.author.fullName?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {news.author.fullName || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-lg text-gray-600 font-medium mb-6 leading-relaxed">
            {news.description}
          </p>

          {/* Full Content */}
          <div className="prose prose-gray max-w-none">
            {news.content?.split("\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              // Check if it's a header (bold text)
              if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                return (
                  <h3
                    key={index}
                    className="text-xl font-bold text-gray-900 mt-6 mb-3"
                  >
                    {trimmed.replace(/\*\*/g, "")}
                  </h3>
                );
              }
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                {isLiked ? (
                  <FaHeart className="w-4 h-4 text-red-500" />
                ) : (
                  <FaRegHeart className="w-4 h-4" />
                )}
                <span>{likesCount}</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 transition-all duration-200"
              >
                {isSaved ? (
                  <FaBookmark className="w-4 h-4 text-yellow-500" />
                ) : (
                  <FaRegBookmark className="w-4 h-4" />
                )}
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>
              <button
                onClick={handleNativeShare}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-500 hover:bg-primary-50 transition-all duration-200"
              >
                <FaShare className="w-4 h-4" />
                <span>{news.shares || 0}</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Share:</span>
              {[
                {
                  icon: <FaFacebook />,
                  color: "hover:text-blue-600 hover:bg-blue-50",
                  label: "Facebook",
                  platform: "facebook",
                },
                {
                  icon: <FaTwitter />,
                  color: "hover:text-blue-400 hover:bg-blue-50",
                  label: "Twitter",
                  platform: "twitter",
                },
                {
                  icon: <FaLinkedin />,
                  color: "hover:text-blue-700 hover:bg-blue-50",
                  label: "LinkedIn",
                  platform: "linkedin",
                },
                {
                  icon: <FaWhatsapp />,
                  color: "hover:text-green-500 hover:bg-green-50",
                  label: "WhatsApp",
                  platform: "whatsapp",
                },
              ].map((social) => (
                <button
                  key={social.label}
                  onClick={() => handleSocialShare(social.platform)}
                  className={`p-2 rounded-lg text-gray-400 ${social.color} transition-all duration-200`}
                  aria-label={social.label}
                >
                  {React.cloneElement(social.icon, { className: "w-4 h-4" })}
                </button>
              ))}
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section className="mt-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-6">
              Related News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedNews.map((item) => (
                <Link
                  key={item._id}
                  to={`/news/${item._id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-2">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default NewsDetails;
