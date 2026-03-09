import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Target,
  Users,
  Award,
  Globe,
  Rocket,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const AboutUs = () => {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stats = [
    { number: "10+", label: "Years Experience", icon: Award },
    { number: "500+", label: "Projects Completed", icon: CheckCircle },
    { number: "100+", label: "Active Members", icon: Users },
    { number: "50+", label: "Global Clients", icon: Globe },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description:
        "We pour our hearts into every project, ensuring exceptional results that exceed expectations.",
    },
    {
      icon: Target,
      title: "Precision",
      description:
        "Every detail matters. We maintain the highest standards in everything we deliver.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We believe in the power of teamwork, working closely with clients to achieve shared goals.",
    },
    {
      icon: Rocket,
      title: "Innovation",
      description:
        "Constantly pushing boundaries and embracing new technologies to stay ahead.",
    },
  ];

  const team = [
    {
      name: "Stella Adaku Nwosu",
      role: "Female Gender 2",
      image:
        "https://mail.google.com/mail/u/1?ui=2&ik=efd31e2def&attid=0.4&permmsgid=msg-f:1859173400336716692&th=19cd1c5b76ecd394&view=att&zw&disp=safe",
      bio: "National Youth Council Nigeria, Umuahia South Local Government Area, Abia State. Passionate about youth empowerment and community development.",
    },
    {
      name: "Ihuoma Promise",
      role: "Social Secretary",
      image:
        "https://mail.google.com/mail/u/1?ui=2&ik=efd31e2def&attid=0.1&permmsgid=msg-f:1859173400336716692&th=19cd1c5b76ecd394&view=att&zw&disp=safe",
      bio: "Umuahia South Youth Platform. Dedicated to fostering community engagement and social initiatives for youth development.",
    },
    {
      name: "Ndukwe Chinemerem Daniel",
      role: "Assistant PRO",
      image:
        "https://mail.google.com/mail/u/1?ui=2&ik=efd31e2def&attid=0.3&permmsgid=msg-f:1859173400336716692&th=19cd1c5b76ecd394&view=att&zw&disp=safe",
      bio: "National Youth Council Nigeria, Umuahia South Local Government Area, Abia State.",
    },
    {
      name: "Comrade Dickson Samuel Chukwuemeka",
      role: "Public Relations Officer",
      image:
        "https://mail.google.com/mail/u/1?ui=2&ik=efd31e2def&attid=0.2&permmsgid=msg-f:1859173400336716692&th=19cd1c5b76ecd394&view=att&zw&disp=safe",
      bio: "MC MONICA ENTERPRISE Umuahia South Youth Platform. Focused on building strong relationships and promoting the platform's mission to empower youth.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-green-600 text-white py-24"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 text-center z-10">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90"
          >
            Umuahia Youth is a digital platform created to empower, inform, and
            connect the young people of Umuahia. Our mission is to keep the
            youth updated with accurate and timely information about government
            activities, community development, opportunities, and important
            events happening within Umuahia. We believe that when young people
            have access to the right information, they become more involved in
            shaping the future of their community. Through our platform, youths
            can receive news updates, stay informed about government
            initiatives, and engage with matters that affect their growth and
            development. Umuahia Youth is more than just a news feed it is a
            space where ideas are shared, voices are heard, and the next
            generation of leaders stays connected to the progress of Umuahia.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="container mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {stat.number}
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>

            <p className="text-lg text-gray-600 mb-4">
              We are a community of passionate young innovators who believe
              technology should empower people and create opportunities. Our
              team brings energy, creativity, and bold ideas together to build
              digital solutions that truly make an impact.
            </p>

            <p className="text-lg text-gray-600">
              Driven by curiosity and collaboration, we focus on helping
              businesses grow, adapt, and stand out in the digital world. Every
              project we work on is guided by fresh thinking, modern technology,
              and a commitment to delivering meaningful results.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 h-[500px] overflow-hidden"
          >
            <img
              src="https://mail.google.com/mail/u/1?ui=2&ik=efd31e2def&attid=0.5&permmsgid=msg-f:1859173400336716692&th=19cd1c5b76ecd394&view=att&zw&disp=safe"
              alt="Young team collaborating"
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Our Values
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-gray-800 mb-4"
        >
          Meet Our Team
        </motion.h2>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          The brilliant minds behind our success, dedicated to bringing your
          vision to life
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-green-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Ready to start your next project? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-4" />
              <p className="font-semibold">Email</p>
              <p className="opacity-90">coming soon@company.com</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <p className="font-semibold">Phone</p>
              <p className="opacity-90"> coming soon </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4" />
              <p className="font-semibold">Office</p>
              <p className="opacity-90">coming soon</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
