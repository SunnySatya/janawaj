import React, { useState, useEffect } from "react";
import axios from "axios";
import PollCard from "../components/PollCard";
import { MdPoll, MdTrendingUp, MdHowToVote, MdBarChart } from "react-icons/md";
import {
  FaSearch,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await axios.get("/api/polls?limit=50");
      setPolls(res.data.data || []);
    } catch (err) {
      console.error("Failed to load polls:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    "Politics",
    "Technology",
    "Education",
    "Health",
    "Sports",
    "Media",
  ];
  const filters = ["all", "active", "ending-soon", "closed"];

  const filteredPolls = polls.filter((poll) => {
    const matchesSearch =
      poll.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || poll.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      icon: <MdPoll className="w-5 h-5" />,
      value: polls.length,
      label: "Total Polls",
    },
    {
      icon: <MdHowToVote className="w-5 h-5" />,
      value: polls
        .reduce((sum, p) => sum + (p.totalVotes || 0), 0)
        .toLocaleString(),
      label: "Total Votes",
    },
    {
      icon: <MdTrendingUp className="w-5 h-5" />,
      value: polls.filter((p) => p.status === "active").length,
      label: "Active Polls",
    },
    {
      icon: <FaClock className="w-5 h-5" />,
      value: polls.filter((p) => p.status === "ending-soon").length,
      label: "Ending Soon",
    },
  ];

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
              <MdPoll className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white font-[Playfair_Display] mb-3">
              Public Opinion Polls
            </h1>
            <p className="text-primary-100 text-sm md:text-lg max-w-2xl mx-auto">
              Share your opinion on important topics and see how others are
              voting. Your voice matters!
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl bg-gray-50"
              >
                <div className="text-primary-600 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search polls..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
              <FaFilter className="text-gray-400 w-4 h-4 flex-shrink-0" />
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    filter === f
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f === "all"
                    ? "All Polls"
                    : f === "ending-soon"
                      ? "Ending Soon"
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  searchTerm.toLowerCase() === cat.toLowerCase() ||
                  (cat === "All" && !searchTerm)
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSearchTerm(cat === "All" ? "" : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Polls Grid */}
      <section className="py-8 md:py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : filteredPolls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolls.map((poll) => (
                <PollCard key={poll._id} poll={poll} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MdPoll className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                No Polls Found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Polls;
