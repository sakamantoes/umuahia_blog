import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Users,
  Newspaper,
  Briefcase,
  Heart,
  Landmark,
  BookOpen,
} from "lucide-react";
import Loader from "../components/Loader";
import Landing from "../components/Landing";
import { motion } from "framer-motion";
import ImageCarousel from "../components/ImageCarousel ";
// import AnnouncementMarquee from "../components/AnnouncementMarquee";
function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [stats, setStats] = useState({
    youthCount: 0,
    opportunitiesCount: 0,
    newsCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const Api = "https://umuahia-blog-2.onrender.com"; // Update with your actual API URL

  const fetchData = async () => {
    try {
      const [postsRes, statsRes] = await Promise.all([
        axios.get(`${Api}/api/posts?featured=true&limit=6`),
        axios
          .get(`${Api}/api/admin/stats`)
          .catch(() => ({ data: { stats: {} } })),
      ]);

      setFeaturedPosts(postsRes.data.posts);

      const opportunities = await axios.get(
        `${Api}/api/posts/category/Opportunities?limit=1`,
      );

      const news = await axios.get(
        `${Api}/api/posts/category/News%20&%20Updates?limit=1`,
      );

      setStats({
        youthCount: statsRes.data.stats?.totalYouth || 0,
        opportunitiesCount: opportunities.data.total || 0,
        newsCount: news.data.total || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const categories = [
    {
      name: "News & Updates",
      icon: Newspaper,
      path: "/news",
      count: stats.newsCount,
    },
    {
      name: "Opportunities",
      icon: Briefcase,
      path: "/opportunities",
      count: stats.opportunitiesCount,
    },
    { name: "Lifestyle", icon: Heart, path: "/lifestyle" },
    { name: "Culture", icon: Landmark, path: "/culture" },
    { name: "Stories", icon: BookOpen, path: "/stories" },
    { name: "Resources", icon: Users, path: "/resources" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HERO */}
      <Landing />
 {/* <AnnouncementMarquee /> */}
      {/* FEATURED POSTS */}
      <section className="mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Updates
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Latest news and opportunities from our community
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -8,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                {post.image && (
                  <div className="relative overflow-hidden h-48">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      src={`https://umuahia-blog-2.onrender.com${post.image}`}
                      alt={post.title}
                      className="h-48 w-full object-cover"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-3 py-1.5 rounded-full font-medium border border-green-100"
                    >
                      {post.category}
                    </motion.span>

                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <motion.svg
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </motion.svg>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <motion.h3
                    initial={{ opacity: 0.9 }}
                    whileHover={{ opacity: 1 }}
                    className="font-bold text-lg mb-2 text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2"
                  >
                    {post.title}
                  </motion.h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {post.content.substring(0, 120)}...
                  </p>

                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      to={`/${post.category.toLowerCase().replace(/ & /g, "-")}`}
                      className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors group/link"
                    >
                      Read More
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                        className="inline-block"
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                </div>

                {/* Decorative corner accent */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="h-1 bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="inline-block mb-4"
              >
                <svg
                  className="w-16 h-16 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  ></path>
                </svg>
              </motion.div>
              <p className="text-gray-500 text-lg">No featured posts yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Check back soon for updates!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <ImageCarousel />

      {/* STATS */}
      <section className="mt-20 grid md:grid-cols-3 gap-6 mb-20">
        {/* Opportunities Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          whileHover={{
            y: -8,
            boxShadow: "0 25px 30px -12px rgba(22, 163, 74, 0.35)",
            transition: { type: "spring", stiffness: 400, damping: 17 },
          }}
          className="bg-gradient-to-br from-green-600 to-green-500 text-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl relative overflow-hidden group"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,white,transparent_50%)]"></div>
          </div>

          {/* Icon with animation */}
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <Briefcase
              className="mx-auto mb-3 relative z-10"
              size={40}
              strokeWidth={1.5}
            />
          </motion.div>

          {/* Counter with animation */}
          <motion.h3
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-3xl font-bold relative z-10"
          >
            {stats.opportunitiesCount}+
          </motion.h3>

          <p className="relative z-10 text-green-100 font-medium">
            Opportunities
          </p>

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-3xl"></div>
        </motion.div>

        {/* News Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{
            y: -8,
            boxShadow: "0 25px 30px -12px rgba(79, 70, 229, 0.35)",
            transition: { type: "spring", stiffness: 400, damping: 17 },
          }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl relative overflow-hidden group"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,white,transparent_50%)]"></div>
          </div>

          {/* Icon with animation */}
          <motion.div
            animate={{
              rotateY: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative"
          >
            <Newspaper
              className="mx-auto mb-3 relative z-10"
              size={40}
              strokeWidth={1.5}
            />
          </motion.div>
             
          {/* Counter with animation */}
          <motion.h3
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="text-3xl font-bold relative z-10"
          >
            {stats.newsCount}+
          </motion.h3>

          <p className="relative z-10 text-indigo-100 font-medium">
            News Updates
          </p>

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-3xl"></div>
        </motion.div>

      </section>
    </div>
  );
}

export default Home;
