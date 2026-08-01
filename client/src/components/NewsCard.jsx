import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  FaHeart,
  FaShare,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { HiClock } from "react-icons/hi";
import { handleImageError } from "../utils/imageFallback";

const NewsCard = ({ news, featured }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(news.isLiked || false);
  const [likesCount, setLikesCount] = useState(news.likes?.length || 0);
  const [sharesCount, setSharesCount] = useState(news.shares || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.put(`/api/news/${news._id || news.id}/like`);
      setLiked(res.data.data.isLiked);
      setLikesCount(res.data.data.likes);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/news/${news._id || news.id}`;
    try {
      // Increment share count on server
      await axios.put(`/api/news/${news._id || news.id}/share`);
      setSharesCount((prev) => prev + 1);
    } catch (err) {
      // Silently fail - share count increment is non-critical
    }
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.description,
          url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={handleImageError}
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
            {news.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <Link to={`/news/${news._id || news.id}`}>
          <h3 className="font-bold text-gray-900 font-[Playfair_Display] leading-tight mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {news.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {news.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center space-x-1">
            <HiClock className="w-3.5 h-3.5" />
            <span>{news.date}</span>
          </span>
          <div className="flex items-center space-x-2 text-gray-400">
            <button
              onClick={handleLike}
              className="hover:text-red-500 transition-colors"
            >
              {liked ? (
                <FaHeart className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <FaRegHeart className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="hover:text-primary-500 transition-colors"
            >
              <FaShare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
