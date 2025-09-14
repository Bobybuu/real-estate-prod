"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CallToActionSection = () => {
  return (
    <div className="relative py-24">
      <Image
        src="/landing-call-to-action.jpg"
        alt="Real Estate Call to Action Background"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
          Looking to Rent, Buy or Sell Property?
        </h2>
        <p className="mt-4 text-lg text-gray-200 max-w-3xl mx-auto">
          Whether you’re searching for your dream home, a piece of land, or you’re 
          an agent, landlord or broker wanting to list properties, we’ve got you covered.  
          Join our platform today to rent, buy or sell property with ease.
        </p>

        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="inline-block bg-secondary-500 text-white rounded-lg px-8 py-3 font-semibold hover:bg-secondary-600 transition"
          >
            I Want to Rent or Buy
          </Link>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary-700 rounded-lg px-8 py-3 font-semibold hover:bg-primary-500 hover:text-white transition"
          >
            I’m an Agent / Landlord – List Property
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToActionSection;
