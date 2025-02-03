import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide functionality
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const slides = [
    {
      title: "Turn Your Rides Into Rewards",
      subtitle:
        "Record with Siren and make every journey Count. Together, we can monitor noise levels on our roads and help build healthier Cities",
      cta: {
        primary: {
          text: "Start Measuring",
          icon: "/measuring.png",
        },
      },
      image: "/bus.svg",
      gradient: "from-red-600 to-gray-900",
      bgColor: "bg-white",
      buttonBg: "from-red-600 to-gray-900",
    },
    {
      title: "Transform your Farm records for Rewards",
      subtitle:
        "Log  your livestock health status securely on chain. Survelliance and early detection means better care and higher yields for livestocks in our regions",
      cta: {
        primary: {
          text: "Early Access",
          icon: null,
        },
        secondary: {
          text: "Watch Demo",
          icon: <Play className="w-4 h-4" />,
        },
      },
      image: "/piggy.png",
      gradient: "from-green-600 to-green-900",
      bgColor: "bg-green-50",
      buttonBg: "from-green-600 to-green-900",
    },
    {
      title: "Secure Sensory Data Framework",
      subtitle:
        "From hardware sensors to survelliance feeds, securely store IoT data on-chain for tamper-proof records and immutable trails on low-cost infastructure",
      cta: {
        primary: {
          text: "Request Demo",
          icon: null,
        },
      },
      image: "/noise.png",
      gradient: "from-gray-700 to-gray-900",
      bgColor: "bg-gray-50",
      buttonBg: "from-gray-700 to-gray-900",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      className="relative w-full h-[calc(100vh-80px)] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* Slides */}
        <div className="absolute inset-0 flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`relative min-w-full h-full flex flex-col px-6 lg:px-12 ${slide.bgColor} transition-colors duration-500`}
            >
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-100 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-100 to-transparent rounded-full transform -translate-x-1/2 translate-y-1/2 opacity-30" />
              </div>

              {/* Content */}
              <div className="relative z-10 pt-8 lg:pt-12 max-w-4xl">
                <h1
                  className={`text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}
                >
                  {slide.title}
                </h1>
                <p className="text-base lg:text-xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className={`px-8 py-3 rounded-full bg-gradient-to-r ${slide.buttonBg} text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                  >
                    {slide.cta.primary.text}
                    {slide.cta.primary.icon && (
                      <img
                        src={slide.cta.primary.icon}
                        alt="icon"
                        className="w-5 h-5"
                      />
                    )}
                  </button>
                  {slide.cta.secondary && (
                    <button
                      className={`px-8 py-3 rounded-full border-2 font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-50 
                        ${
                          index === 1
                            ? "border-green-600 text-green-700"
                            : "border-gray-900 text-gray-900"
                        }`}
                    >
                      {slide.cta.secondary.text}
                      {slide.cta.secondary.icon}
                    </button>
                  )}
                </div>
              </div>

              {/* Background Image */}
              <div className="absolute right-0 top-1/2 -translate-y-1/4 w-full lg:w-1/2 h-1/2 lg:h-2/3">
                <img
                  src={slide.image}
                  alt="hero"
                  className={`${
                    index === 2 && "opacity-15"
                  } w-full h-full object-contain object-right-center transform transition-transform duration-700 hover:scale-105`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/90 text-gray-900 hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-gray-900 scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/90 text-gray-900 hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
