import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Newspaper, BookOpen, Calendar, Briefcase, Award, Heart, MessageCircle } from 'lucide-react';

const categories = [
  { name: 'News & Updates', path: '/news', icon: Newspaper  },
  { name: 'Opportunities', path: '/opportunities', icon: Briefcase  },
  { name: 'Lifestyle', path: '/lifestyle', icon: BookOpen  },
  { name: 'Culture', path: '/culture', icon: Award  },
  { name: 'Stories', path: '/stories', icon: Heart  },
  { name: 'Resources', path: '/resources', icon: MessageCircle  },
];

const Landing = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.4,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: 0.8,
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const categoryVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    }),
    hover: {
      y: -8,
      scale: 1.05,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 overflow-hidden">
        {/* Animated Background Pattern */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Animated Floating Shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20">
            
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-300 rounded-full"
                />
                Be Part of the Deveploment 
              </motion.div>

              {/* Main Heading */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Welcome to{' '}
                  <span className="relative">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-200">
                      Umuahia South
                    </span>
                    <motion.svg 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="absolute -bottom-2 left-0 h-3 text-green-300/50 -z-10" 
                      viewBox="0 0 100 12" 
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M0,0 Q25,8 50,8 T100,0" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  </span>
                  <br />
                  <span className="text-white/90">Youth Platform</span>
                </h1>

                <motion.p variants={itemVariants} className="text-lg sm:text-xl text-green-50 max-w-2xl leading-relaxed">
                  Connecting and empowering the next generation of leaders through 
                  <span className="font-semibold text-yellow-300"> opportunities, news, </span>
                  and
                  <span className="font-semibold text-yellow-300"> community development </span>
                  initiatives.
                </motion.p>
              </motion.div>

            

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
        

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/news"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:bg-white hover:text-green-600 hover:border-white transition-all duration-300 group"
                  >
                    <Newspaper className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Explore News
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                variants={itemVariants}
                className="pt-6 flex items-center gap-6 text-sm text-green-100"
              >
                {['Verified Community', 'Secure & Free', '24/7 Support'].map((text, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-2"
                  >
                    <motion.svg 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="w-5 h-5 text-yellow-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </motion.svg>
                    {text}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image/Visual */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Abia_state_tower.jpg/1280px-Abia_state_tower.jpg" 
                    alt="Youth community gathering and collaboration" 
                    className="w-full h-[500px] object-cover"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 via-transparent to-transparent"></div>
                  
                  {/* Floating Card */}
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                      >
                        <Users className="w-5 h-5 text-green-600" />
                      </motion.div>
                      <div>
                        <div className="font-semibold text-gray-900">Join 500+ Young Leaders</div>
                        <div className="text-sm text-gray-500">Be part of the change</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-400/30 rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute -top-4 -left-4 w-32 h-32 bg-yellow-400/30 rounded-full blur-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Categories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore various opportunities and resources tailored for youth development
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((cat, index) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.name}
                custom={index}
                variants={categoryVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={cat.path}
                  className="block bg-white hover:bg-gradient-to-br from-green-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-6 text-center group"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    <Icon 
                      className="mx-auto mb-3 text-green-600 group-hover:text-green-700 transition-colors" 
                      size={36} 
                    />
                  </motion.div>

                  <h4 className="font-semibold text-gray-800 group-hover:text-gray-900">
                    {cat.name}
                  </h4>


                  {/* Hover Effect Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: '40%' }}
                    transition={{ duration: 0.3 }}
                    className="h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-3 rounded-full"
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold group"
          >
            View All Categories
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;