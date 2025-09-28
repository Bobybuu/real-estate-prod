"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverSection = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch ALL properties
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`);
        const data = await res.json();

        // The backend might return {properties: [...]}, or just [...]
        const allProperties = data.properties || data || [];

        // Randomize and pick 3
        const shuffled = [...allProperties].sort(() => Math.random() - 0.5);
        const randomThree = shuffled.slice(0, 3);

        setProperties(randomThree);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="py-12 bg-white mb-16"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Title */}
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800">
            Featured Properties
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A glimpse of our homes, apartments, and land listings.
          </p>
        </motion.div>

        {/* Property Cards */}
        {loading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
            {properties.map((property: any) => (
              <motion.div key={property.id} variants={itemVariants}>
                <PropertyCard
                  property={property}
                  isExpanded={expandedId === property.id}
                  onExpand={() =>
                    setExpandedId(
                      expandedId === property.id ? null : property.id
                    )
                  }
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No properties found.</p>
        )}

        {/* Explore More */}
        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-block px-6 py-3 bg-primary-700 text-white rounded hover:bg-primary-800"
          >
            Explore More Properties
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const PropertyCard = ({
  property,
  isExpanded,
  onExpand,
}: {
  property: any;
  isExpanded: boolean;
  onExpand: () => void;
}) => (
  <div className="shadow-lg rounded-lg overflow-hidden bg-white">
    {/* Image */}
    <div className="relative h-56 w-full">
      <Image
        src={property.photoUrls?.[0] || "/placeholder.jpg"}
        alt={property.name}
        fill
        className="object-cover"
      />
    </div>

    {/* Content */}
    <div className="p-4">
      <h3 className="text-lg font-semibold">{property.name}</h3>
      <p className="text-primary-700 font-bold">
        KES {property.pricePerMonth?.toLocaleString() ?? "N/A"}
      </p>
      <p className="text-gray-500 text-sm">
        {property.beds} Beds • {property.baths} Baths •{" "}
        {property.location?.city || property.location?.address || "Unknown"}
      </p>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-3 text-sm text-gray-600">
          <p>
            {property.description ||
              "This property offers great amenities and a prime location."}
          </p>
        </div>
      )}

      {/* Button */}
      <button
        onClick={onExpand}
        className="mt-4 inline-block px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
      >
        {isExpanded ? "Hide Details" : "View Details"}
      </button>
    </div>
  </div>
);

export default DiscoverSection;
