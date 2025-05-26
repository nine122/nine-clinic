import { useState, useEffect } from "react";
import { assets } from "../../assets/assets";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll effects
  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Placeholder for group profiles image
  const groupProfilesImg = assets.group_profiles;

  // Placeholder for header image
  const headerImg = assets.header_img;

  return (
    <div className="relative overflow-hidden bg-primary text-white">
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white opacity-5"></div>
      <div className="absolute bottom-40 right-10 w-64 h-64 rounded-full bg-white opacity-5"></div>
      <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white opacity-5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center pt-10 pb-20 md:py-16 lg:py-20">
          {/* Left side */}
          <div
            className={`w-full md:w-1/2 flex flex-col items-center md:items-start gap-6 md:gap-8 mb-16 md:mb-0 z-10 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center md:text-left leading-tight">
              Book Appointment <br className="hidden md:block" />
              <span className="relative inline-block">
                With Trusted
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-white opacity-30 rounded"></span>
              </span>{" "}
              Doctors
            </h1>

            <div
              className={`flex flex-col mt-4 items-center md:items-start gap-4 max-w-md transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <p className="text-sm text-center md:text-left text-white/80">
                Join thousands of patients who have found the perfect doctor for
                their healthcare needs. Our trusted doctors provide personalized
                care with modern approaches.
              </p>
              <div className="w-22 h-10 overflow-hidden rounded-lg">
                <img
                  src={groupProfilesImg}
                  alt="Trusted doctors"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <a
              href="#speciality"
              className={`group relative flex items-center gap-2 bg-white hover:bg-white/90 px-6 py-3 rounded-full text-primary font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/20 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              Book Appointment
              <span className="relative w-5 h-5 flex items-center justify-center">
                <span className="absolute w-5 h-px bg-primary"></span>
                <span className="absolute w-3 h-px bg-primary rotate-45 translate-x-1 -translate-y-1"></span>
                <span className="absolute w-3 h-px bg-primary -rotate-45 translate-x-1 translate-y-1"></span>
              </span>
            </a>

            {/* Decorative elements */}
            <div className="hidden md:flex gap-3 mt-6 opacity-50">
              <div className="w-8 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-4 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Right side */}
          <div
            className={`w-full md:w-1/2 relative transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-10 scale-95"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative">
              {/* Image container */}
              <div
                className="rounded-2xl overflow-hidden shadow-2xl md:transform md:rotate-1 hover:rotate-0 transition-all duration-500"
                style={{
                  transform: `translateY(${Math.min(scrollY * 0.02, 15)}px)`,
                }}
              >
                <img
                  src={headerImg}
                  alt="Doctor with patient"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Overlayed stats - repositioned to prevent overlap */}
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 transform rotate-1 hover:rotate-0 transition-all duration-300 z-20">
                <p className="text-xs text-white/70">Happy Patients</p>
                <p className="text-xl font-bold">10,000+</p>
              </div>

              {/* Floating element - repositioned */}
              <div
                className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-white/6 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 z-20"
                style={{
                  animation: "float 3s ease-in-out infinite",
                  animationDelay: "1s",
                }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full "></div>
                <p className="text-md">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(-50%);
          }
          50% {
            transform: translateY(-10px) translateX(-50%);
          }
          100% {
            transform: translateY(0px) translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default Header;
