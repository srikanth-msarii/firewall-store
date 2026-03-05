import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, BadgeCheck, Briefcase, Lock,
  Award, Truck, Headset,
  Target, Eye,
  Mail, Phone, Linkedin, Twitter, Github // Added social icons
} from 'lucide-react';
import { motion } from 'framer-motion';

// Framer Motion Variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

// --- Reusable Icon Card Component ---
const FeatureCard = ({ icon: Icon, title, children }) => (
  <motion.div
    variants={itemVariants}
    className="flex items-start space-x-4 rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
  >
    <div className="flex-shrink-0">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Icon className="h-6 w-6" />
      </span>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-600">{children}</p>
    </div>
  </motion.div>
);


export const AboutPage = () => {
  return (
    <>
      {/* --- SEO Tags (React 19) --- */}
      <title>About Us | Firewall Store</title>
      <meta
        name="description"
        content="Learn about Firewall-Store.com, India's trusted online destination for enterprise-grade IT hardware, firewalls, networking, and servers. Discover our mission, vision, and leadership."
      />
      <link rel="canonical" href="https://www.firewall-store.com/about" />
      <meta property="og:title" content="About Us | Firewall Store" />
      <meta property="og:description" content="Learn about our mission to make IT hardware procurement simple, authentic, and effortless." />

      {/* --- Page Content --- */}
      <div className="bg-gray-50 pb-20">
        {/* Hero Section */}
        <div
          className="relative h-96 bg-cover bg-center flex items-center"
          style={{ backgroundImage: "url('/assets/images/solutions-cta-bg.webp')" || "url('https://images.unsplash.com/photo-1517038169123-afc6df1687f8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/60" />
          <div className="container relative z-10 mx-auto max-w-7xl px-4 text-white text-center md:text-left">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-extrabold tracking-tight md:text-6xl"
            >
              Innovating Secure Networks for India
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto md:mx-0"
            >
              Committed to making enterprise-grade IT hardware accessible, authentic, and effortless.
            </motion.p>
          </div>
        </div>

        {/* Floating Card Content */}
        <div className="container mx-auto max-w-7xl -translate-y-16 px-4">
          <div className="rounded-xl bg-white p-8 shadow-md md:p-12">

            {/* Our Story Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="relative bg-gray-50 p-8 rounded-lg mb-12 overflow-hidden"
            >
              {/* Optional: Add a subtle background pattern/image for this section */}
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "url('/assets/images/story-bg.webp')" || "url('https://www.transparenttextures.com/patterns/clean-textile.png')" }}
              />
              <div className="relative z-10">
                <motion.h2 variants={itemVariants} className="text-4xl font-bold tracking-tight text-gray-900 mb-6">Our Story</motion.h2>
                <motion.p variants={itemVariants} className="mt-4 text-lg text-gray-700 leading-relaxed">
                  The idea behind Firewall-Store.com was simple — to create a reliable online marketplace where customers can find genuine IT infrastructure products backed by transparent pricing, clear specifications, and strong after-sales support. We bring together top-tier OEMs, expert guidance, and a smooth buying experience to simplify your technology procurement process.
                </motion.p>
                <motion.p variants={itemVariants} className="mt-4 text-lg text-gray-700 leading-relaxed">
                  As one of India’s trusted online destinations for firewalls, networking equipment, servers, and interactive panels, we help businesses build secure, connected, and high-performing digital environments. We’re dedicated to making enterprise-grade IT hardware accessible, authentic, and effortless to procure for startups, mid-size companies, and large enterprises alike.
                </motion.p>
              </div>
            </motion.div>

            {/* What We Offer Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="mt-12 border-t border-gray-200 pt-12"
            >
              <motion.h2 variants={itemVariants} className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-10">What We Offer</motion.h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                <FeatureCard icon={Layers} title="Comprehensive Product Range">
                  From firewalls and network switches to routers, servers, and interactive panels designed for modern enterprises, educational institutions, and data-driven organizations.
                </FeatureCard>
                <FeatureCard icon={BadgeCheck} title="100% Genuine Products">
                  Every item listed on Firewall-Store.com comes directly from authorized distributors or OEM partners, ensuring authenticity and full warranty coverage.
                </FeatureCard>
                <FeatureCard icon={Briefcase} title="Business-Ready Solutions">
                  We cater to startups, mid-size companies, and large enterprises — offering scalable solutions for every scale and budget, ensuring your technology grows with you.
                </FeatureCard>
                <FeatureCard icon={Lock} title="Secure Shopping Experience">
                  Our site uses the latest encryption and payment security standards to ensure a smooth, safe, and trustworthy purchase journey, protecting your data every step of the way.
                </FeatureCard>
              </div>
            </motion.div>

            {/* Mission & Vision Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="mt-16 grid grid-cols-1 gap-8 border-t border-gray-200 pt-12 md:grid-cols-2"
            >
              <motion.div variants={itemVariants} className="flex flex-col items-start p-6 rounded-lg bg-blue-50 shadow-md">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Target className="h-8 w-8" />
                </span>
                <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
                <p className="mt-3 text-lg text-gray-700 leading-relaxed">
                  To empower businesses and institutions with reliable IT infrastructure solutions that strengthen security, boost connectivity, and drive digital transformation across India.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col items-start p-6 rounded-lg bg-green-50 shadow-md">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                  <Eye className="h-8 w-8" />
                </span>
                <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
                <p className="mt-3 text-lg text-gray-700 leading-relaxed">
                  To become India’s most trusted online platform for enterprise-grade IT hardware — a place where cutting-edge technology truly meets unwavering trust and delightful simplicity.
                </p>
              </motion.div>
            </motion.div>

            {/* Why Choose Us Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              id='advantages'
              className="mt-16 border-t border-gray-200 pt-12"
            >
              <motion.h2 variants={itemVariants} className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-10">Why Choose Firewall-Store.com</motion.h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <motion.div variants={itemVariants} className="text-center p-6 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <Award className="mx-auto h-14 w-14 text-blue-600 mb-4" />
                  <h3 className="mt-4 text-xl font-bold text-gray-900">Curated Enterprise Selection</h3>
                  <p className="mt-2 text-gray-600">We partner exclusively with globally recognized tech giants to ensure every appliance you purchase meets the rigorous demands of modern enterprise architecture and cybersecurity.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="text-center p-6 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <Truck className="mx-auto h-14 w-14 text-blue-600 mb-4" />
                  <h3 className="mt-4 text-xl font-bold text-gray-900">Lightning-Fast Delivery</h3>
                  <p className="mt-2 text-gray-600">Time is critical in enterprise IT. Enjoy rapid, insured, and secure Pan-India shipping directly to your data centers or branch offices, minimizing deployment downtime.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="text-center p-6 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <Headset className="mx-auto h-14 w-14 text-blue-600 mb-4" />
                  <h3 className="mt-4 text-xl font-bold text-gray-900">Unmatched Expert Support</h3>
                  <p className="mt-2 text-gray-600">Our team consists of certified networking and security specialists ready to assist you. From pre-sales consultation to architecture guidance, we're with you at every step.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="text-center p-6 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <BadgeCheck className="mx-auto h-14 w-14 text-blue-600 mb-4" />
                  <h3 className="mt-4 text-xl font-bold text-gray-900">100% Genuine & Warranty Backed</h3>
                  <p className="mt-2 text-gray-600">As authorized partners, we guarantee that every piece of hardware is factory-sealed, 100% authentic, and fully backed by the manufacturer's comprehensive warranty.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="text-center p-6 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <Lock className="mx-auto h-14 w-14 text-blue-600 mb-4" />
                  <h3 className="mt-4 text-xl font-bold text-gray-900">Secure & Transparent Procurement</h3>
                  <p className="mt-2 text-gray-600">Experience a seamless B2B purchasing process with bank-grade encryption, straightforward pricing, and absolute transparency, giving you complete peace of mind.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="text-center p-6 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <Briefcase className="mx-auto h-14 w-14 text-blue-600 mb-4" />
                  <h3 className="mt-4 text-xl font-bold text-gray-900">Tailored Bulk & Custom Quotes</h3>
                  <p className="mt-2 text-gray-600">Procuring for a large-scale project? We offer specialized bulk pricing, flexible engagement, and personalized quotes tailored to fit your specific scaling requirements.</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Get in Touch Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="mt-16 border-t border-gray-200 pt-12 text-center"
            >
              <motion.h2 variants={itemVariants} className="text-4xl font-bold tracking-tight text-gray-900 mb-6">Get in Touch</motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
                For product inquiries, bulk purchases, or partnership opportunities, our team is ready to assist. Reach out to us:
              </motion.p>
              <motion.div
                variants={containerVariants}
                className="mt-8 flex flex-col items-center justify-center space-y-5 md:flex-row md:space-x-10 md:space-y-0"
              >
                <motion.a
                  variants={itemVariants}
                  href="mailto:sales@firewall-store.com"
                  className="inline-flex items-center text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Mail className="mr-3 h-6 w-6" />
                  sales@firewall-store.com
                </motion.a>
                <motion.a
                  variants={itemVariants}
                  href="tel:+917032224513"
                  className="inline-flex items-center text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Phone className="mr-3 h-6 w-6" />
                  +91-7032224513
                </motion.a>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};