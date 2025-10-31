import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const slides = [
  {
    image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1600",
    title: "Light up your celebration",
    subtitle: "Discover our exclusive range of professional-grade fireworks for unforgettable moments",
    tag: "Up to 20% Off",
  },
  {
    image:"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600",
    title: "Safety comes first",
    subtitle: "All our products meet the highest safety standards for your peace of mind",
    tag: "Hot Deals",
  },
  {
    image:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600",
    title: "New Year Special",
    subtitle: "Get ready for the biggest celebration with our special discount offers",
    tag: "Up to 10% Off",
  },
];

export default function HeroSlider() {
  return (
    <div className="w-full h-full relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="w-full h-full rounded-2xl overflow-hidden bg-amber-50"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* Image with overlay */}
            <div className="relative w-full h-150 flex justify-center items-center">
              <img
                src={slide.image}                                                                                                        
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Text Content */}
              <div className="relative z-10 text-center text-white px-6">
                <span className="bg-red-400 px-4 py-1 rounded-full text-sm font-medium">
                  {slide.tag}
                </span>
                <h2 className="text-4xl md:text-6xl font-extrabold mt-4 mb-3 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-6">
                  {slide.subtitle}
                </p>

                <div className="flex gap-4 justify-center">
                  <Link
                    to="/quickbuy"
                    className="px-6 py-3 inline-flex bg-red-400 cursor-pointer p-2 font-semibold
             text-white text-xs  outline-none mb-3  rounded-lg
                hover:shadow-lg transform hover:scale-105 transition-all duration-200 
                items-center space-x-2"
                  >
                    Quick Buy →
                  </Link>
                  <Link
                    to="/products"
                    className="px-6 py-3 inline-flex bg-red-400 cursor-pointer p-2 font-semibold
             text-white text-xs  outline-none mb-3  rounded-lg
                hover:shadow-lg transform hover:scale-105 transition-all duration-200 
                items-center space-x-2"
                  >
                    View Products →
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
