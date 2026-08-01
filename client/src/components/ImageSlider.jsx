import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa";
import { HiClock } from "react-icons/hi";

const DEFAULT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect fill='%231f2937' width='800' height='450'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='24' x='400' y='225' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";

const ImageSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await axios.get("/api/sliders");
      const apiSlides = res.data.data || [];
      if (apiSlides.length > 0) {
        setSlides(
          apiSlides.map((slide) => ({
            id: slide._id,
            image: slide.image,
            title: slide.title,
            description: slide.description || "",
            category: slide.category || "Featured",
            date: slide.createdAt
              ? new Date(slide.createdAt).toLocaleDateString()
              : "Recent",
          })),
        );
      } else {
        const newsRes = await axios.get("/api/news?limit=5&featured=true");
        const news = newsRes.data.data || [];
        if (news.length > 0) {
          setSlides(
            news.map((item) => ({
              id: item._id,
              image: item.image,
              title: item.title,
              description: item.description || "",
              category: item.category || "Featured",
              date: item.publishedAt
                ? new Date(item.publishedAt).toLocaleDateString()
                : "Recent",
            })),
          );
        }
      }
    } catch (err) {
      console.error("Failed to load sliders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Preload all slider images for instant transitions
  useEffect(() => {
    if (slides.length > 0) {
      slides.forEach((slide) => {
        const img = new Image();
        img.src = slide.image;
      });
    }
  }, [slides]);

  useEffect(() => {
    if (isAutoPlaying && slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE;
  };

  if (loading) {
    return (
      <section className="relative w-full bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];
  return (
    <section className="relative w-full bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-10">
          <div className="inline-block px-3 py-1 bg-primary-500/20 rounded-full text-primary-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Top Stories
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-[Playfair_Display]">
            Your Platform Your Voice
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base max-w-2xl mx-auto">
            Stay updated with the latest news and current events from around the
            world
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative group">
          {/* Main Slide */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
            <div className="relative overflow-hidden aspect-[16/9] md:aspect-[21/9]">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                fetchpriority="high"
                onError={handleImageError}
              />
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                  {currentSlide.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              {/* Title */}
              <h3 className="font-bold text-gray-900 font-[Playfair_Display] leading-tight mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 text-lg md:text-2xl">
                {currentSlide.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {currentSlide.description}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center space-x-1">
                  <HiClock className="w-3.5 h-3.5" />
                  <span>{currentSlide.date}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <FaChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Dots Pagination */}
        <div className="flex items-center justify-center mt-6 space-x-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 h-2.5 bg-primary-500"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
