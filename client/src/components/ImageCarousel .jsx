import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, Heart, Share2, Info, Calendar, MapPin, Users, ArrowRight  } from 'lucide-react';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sample carousel data - replace with your actual images
  const slides = [
    {
      id: 1,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlhkkaaFU2a2B4B-sOlUTGVphZqFOfQ_9g5w&s',
      title: 'Abia State Governor',
      description: 'A visit from the Governor of Abia State, Nigeria, to our youth center, inspiring and encouraging the next generation of leaders',
      date: 'March 15, 2024',
      location: 'Abia State Government House, Umuahia',
      category: 'Event',
      attendees: 250,
    },
    {
      id: 2,
      image: 'https://i0.wp.com/outravelandtour.com/wp-content/uploads/2020/01/National-War-Museum-Umuahia-2.jpg?resize=640%2C426',
      title: 'National War Museum',
      description: 'A visit to the National War Museum in Umuahia, showcasing Nigeria\'s rich military history and heritage',
      date: 'March 10, 2026',
      location: 'National War Museum, Umuahia',
      category: 'Landmark',
      volunteers: 120,
    },
    {
      id: 3,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEIazHKePWVTH-fS5tvGVUEir_AvOErhhUXg&s',
      title: 'Abia State Bus Terminal',
      description: 'The bustling Abia State Bus Terminal in Umuahia, a hub of activity and commerce connecting the state to the rest of Nigeria',
      date: 'March 5, 2026',
      location: 'Abia State Bus Terminal, Umuahia',
      category: 'Landmark',
      participants: 85,
    },
    {
      id: 4,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSsM_6EJAGiSKKf9pmZY9v9mW_qtmgQlaHNw&s',
      title: 'The Abia Logo',
      description: 'Prosperity through Enterprise - The official logo of Abia State, Nigeria, symbolizing growth and development',
      date: 'February 28, 2026',
      location: 'Abia State Government Headquarters, Umuahia',
      category: 'Landmark',
      attendees: 1000,
    },
    {
      id: 5,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Abia_state_tower.jpg/1280px-Abia_state_tower.jpg',
      title: 'The Abia Tower',
      description: 'is a prominent landmark symbolizing peace and unity in Abia State, Nigeria',
      date: 'February 20, 2026',
      location: 'located on the Port Harcourt-Enugu Highway in Umuahia',
      category: 'Landmark',
      mentors: 30,
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && !isHovered && !isFullscreen) {
      interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, isFullscreen, slides.length]);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Moments</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Capturing the energy, impact, and spirit of our youth community
          </p>
        </motion.div>

        {/* Main Carousel Container */}
        <div 
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Carousel Wrapper */}
          <div className="relative aspect-[21/9] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                {/* Image with Gradient Overlay */}
                <div className="relative w-full h-full">
                  <img
                    src={slides[currentIndex].image}
                    alt={slides[currentIndex].title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Multiple Overlay Layers for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-6 left-6"
                  >
                    <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg">
                      {slides[currentIndex].category}
                    </span>
                  </motion.div>

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-6 right-6 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                      onClick={() => {/* Add share functionality */}}
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                      onClick={() => {/* Add favorite functionality */}}
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                      onClick={() => {/* Add info functionality */}}
                    >
                      <Info className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Content Overlay */}
                  <motion.div
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
                  >
                    <motion.h3 
                      className="text-3xl md:text-4xl font-bold text-white mb-3 max-w-2xl"
                    >
                      {slides[currentIndex].title}
                    </motion.h3>
                    
                    <motion.p 
                      variants={textVariants}
                      className="text-lg text-gray-200 mb-4 max-w-2xl"
                    >
                      {slides[currentIndex].description}
                    </motion.p>
                    
                    <motion.div 
                      variants={textVariants}
                      className="flex flex-wrap gap-4 items-center text-sm text-gray-300"
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {slides[currentIndex].date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {slides[currentIndex].location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {slides[currentIndex].attendees || slides[currentIndex].volunteers || slides[currentIndex].participants || slides[currentIndex].mentors}+ participants
                      </span>
                    </motion.div>

                    {/* Learn More Button */}
                  
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevious}
                className="pointer-events-auto p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="pointer-events-auto p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
              <div className="flex items-center justify-between">
                {/* Progress Indicators */}
                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className="relative group"
                      whileHover={{ scale: 1.2 }}
                    >
                      <div className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'w-8 bg-gradient-to-r from-green-400 to-emerald-400' 
                          : 'w-2 bg-white/50 group-hover:bg-white/80'
                      }`} />
                    </motion.button>
                  ))}
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                    title={isAutoPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                  >
                    {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleFullscreen}
                    className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Slide Counter */}
            <div className="absolute top-6 right-24 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {slides.length}
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 grid grid-cols-5 gap-3"
        >
          {slides.map((slide, index) => (
            <motion.button
              key={slide.id}
              onClick={() => handleDotClick(index)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/30' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-20 object-cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-blue-500/20" />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ImageCarousel;