"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Star, MapPin, Car, PawPrint } from "lucide-react";

type Property = {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  photoUrls?: string[];
  rating?: number;
  reviews?: number;
  petsAllowed?: boolean;
  parkingAvailable?: boolean;
};

type CardProps = {
  property: Property;
};

export default function Card({ property }: CardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const images = property.photoUrls?.slice(0, 3) ?? ["/placeholder.jpg"];

  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition">
      {/* Image Collage */}
      <div className="grid grid-cols-2 gap-1 h-48 relative">
        {images.map((url, i) => (
          <div
            key={i}
            className={`relative ${i === 0 ? "col-span-2 row-span-2" : ""}`}
          >
            {!loaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
            )}
            <Image
              src={url}
              alt={`${property.name} ${i + 1}`}
              fill
              className={`object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
              unoptimized // better for S3 URLs
              onLoad={() => setLoaded(true)}
              onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
            />
          </div>
        ))}

        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Property Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{property.name}</h3>
        <p className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" /> {property.location}
        </p>

        <p className="text-xl font-bold text-blue-600">
          ${property.price.toLocaleString()}
        </p>

        <div className="flex justify-between text-sm text-gray-700">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.area} sqft</span>
        </div>

        {/* Rating */}
        {property.rating && (
          <div className="flex items-center text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            {property.rating} ({property.reviews} reviews)
          </div>
        )}

        {/* Badges */}
        <div className="flex gap-2 mt-2">
          {property.petsAllowed && (
            <span className="flex items-center px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
              <PawPrint className="w-3 h-3 mr-1" /> Pets Allowed
            </span>
          )}
          {property.parkingAvailable && (
            <span className="flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
              <Car className="w-3 h-3 mr-1" /> Parking
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
