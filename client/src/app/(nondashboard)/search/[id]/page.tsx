"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import ImagePreviews from "./ImagePreviews";
import PropertyOverview from "./PropertyOverview";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import ContactWidget from "./ContactWidget";
import ApplicationModal from "./ApplicationModal";
import { useGetAuthUserQuery } from "@/state/api";

const SingleListing = () => {
  const { id } = useParams();
  const propertyId = Number(id);

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: authUser } = useGetAuthUserQuery();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        if (!res.ok) throw new Error("Failed to fetch property");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) return <p className="text-center mt-10">Loading property...</p>;
  if (!property) return <p className="text-center mt-10">Property not found.</p>;

  return (
    <div>
      {/* ✅ Use real photoUrls from backend */}
      {property.photoUrls?.length > 0 && (
        <ImagePreviews images={property.photoUrls} />
      )}

      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>

        <div className="order-1 md:order-2">
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>

      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
        />
      )}
    </div>
  );
};

export default SingleListing;
