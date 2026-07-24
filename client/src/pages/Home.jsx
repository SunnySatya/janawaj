import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageSlider from "../components/ImageSlider";
import PollCard from "../components/PollCard";
import NewsCard from "../components/NewsCard";
import {
  FaNewspaper,
  FaUsers,
  FaGlobeAsia,
  FaTrophy,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuredRes, latestRes, pollsRes] = await Promise.all([
        axios.get("/api/news?featured=true&limit=3"),
        axios.get("/api/news?limit=6"),
        axios.get("/api/polls?limit=3"),
      ]);

      if (featuredRes.data.data?.length > 0) {
        setFeaturedNews(featuredRes.data.data);
      }

      if (latestRes.data.data?.length > 0) {
        setLatestNews(latestRes.data.data);
      } else if (featuredRes.data.data?.length > 0) {
        setLatestNews(featuredRes.data.data);
      }

      if (pollsRes.data.data?.length > 0) {
        setPolls(pollsRes.data.data);
      }
    } catch (err) {
      console.error("Failed to load homepage data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
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

  const stats = [
    {
      icon: <FaNewspaper className="w-6 h-6" />,
      value: "587+",
      label: "News Articles",
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      value: "21000+",
      label: "Active Readers",
    },
    {
      icon: <FaGlobeAsia className="w-6 h-6" />,
      value: "10+",
      label: "Countries Covered",
    },
    {
      icon: <FaTrophy className="w-6 h-6" />,
      value: "300+",
      label: "Supporters",
    },
  ];

  if (loading) {
    return (
      <div className="pt-16 md:pt-20 min-h-screen flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Image Slider Section */}
      <ImageSlider />

      {/* Stats Section */}
      <section className="bg-white py-12 md:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 font-[Playfair_Display]">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      {featuredNews.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                  Featured
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 font-[Playfair_Display]">
                  Top Stories
                </h2>
              </div>
              <Link
                to="/"
                className="hidden md:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
              >
                <span>View All</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredNews.map((news) => (
                <NewsCard
                  key={news._id}
                  news={{
                    ...news,
                    id: news._id,
                    date: formatDate(news.publishedAt),
                  }}
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News & Polls Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Latest News */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                    Updates
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-[Playfair_Display]">
                    Latest News
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {latestNews.slice(0, 4).map((news) => (
                  <NewsCard
                    key={news._id}
                    news={{
                      ...news,
                      id: news._id,
                      date: formatDate(news.publishedAt),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Polls Sidebar */}
            {polls.length > 0 && (
              <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                      Opinion
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-[Playfair_Display]">
                      Trending Polls
                    </h2>
                  </div>
                </div>
                <div className="space-y-6">
                  {polls.map((poll) => (
                    <PollCard key={poll._id} poll={poll} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* More News Section */}
      {latestNews.length > 4 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                  More
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-[Playfair_Display]">
                  More News
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestNews.slice(4).map((news) => (
                <NewsCard
                  key={news._id}
                  news={{
                    ...news,
                    id: news._id,
                    date: formatDate(news.publishedAt),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
