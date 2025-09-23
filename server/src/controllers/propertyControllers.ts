import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

// -------------------- GET ALL PROPERTIES --------------------
export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      availableFrom,
      latitude,
      longitude,
    } = req.query;

    const whereConditions: any[] = [];

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string).split(",").map(Number);
      whereConditions.push(
        prisma.$queryRaw`p.id IN (${prisma.$queryRaw`${favoriteIdsArray}`})`
      );
    }

    if (priceMin) whereConditions.push(prisma.$queryRaw`p."pricePerMonth" >= ${Number(priceMin)}`);
    if (priceMax) whereConditions.push(prisma.$queryRaw`p."pricePerMonth" <= ${Number(priceMax)}`);
    if (beds && beds !== "any") whereConditions.push(prisma.$queryRaw`p.beds >= ${Number(beds)}`);
    if (baths && baths !== "any") whereConditions.push(prisma.$queryRaw`p.baths >= ${Number(baths)}`);
    if (squareFeetMin) whereConditions.push(prisma.$queryRaw`p."squareFeet" >= ${Number(squareFeetMin)}`);
    if (squareFeetMax) whereConditions.push(prisma.$queryRaw`p."squareFeet" <= ${Number(squareFeetMax)}`);

    if (propertyType && propertyType !== "any") {
      whereConditions.push(prisma.$queryRaw`p."propertyType" = ${propertyType}::"PropertyType"`);
    }

    if (amenities && amenities !== "any") {
      const amenitiesArray = (amenities as string)
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      whereConditions.push(prisma.$queryRaw`p.amenities @> ${amenitiesArray}`);
    }

    if (availableFrom && availableFrom !== "any") {
      const date = new Date(availableFrom as string);
      if (!isNaN(date.getTime())) {
        whereConditions.push(prisma.$queryRaw`
          EXISTS (
            SELECT 1 FROM "Lease" l 
            WHERE l."propertyId" = p.id 
            AND l."startDate" <= ${date.toISOString()}
          )
        `);
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusInKm = 1000;

      // Use geography for accurate meter-based distance
      whereConditions.push(prisma.$queryRaw`
        ST_DWithin(
          l.coordinates::geography,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
          ${radiusInKm * 1000}
        )
      `);
    }

    const completeQuery = prisma.$queryRawUnsafe(`
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""}
    `);

    const properties = await completeQuery;
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving properties: ${error.message}` });
  }
};

// -------------------- GET SINGLE PROPERTY --------------------
export const getProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: { location: true },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const coordinates: { coordinates: string }[] =
      await prisma.$queryRaw`SELECT ST_AsText(coordinates) as coordinates FROM "Location" WHERE id = ${property.location.id}`;

    const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
    const longitude = geoJSON.coordinates[0];
    const latitude = geoJSON.coordinates[1];

    const propertyWithCoordinates = {
      ...property,
      location: {
        ...property.location,
        coordinates: { longitude, latitude },
      },
    };

    res.json(propertyWithCoordinates);
  } catch (err: any) {
    res.status(500).json({ message: `Error retrieving property: ${err.message}` });
  }
};

// -------------------- CREATE PROPERTY --------------------
export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const {
      address,
      city,
      state,
      country,
      postalCode,
      managerCognitoId,
      ...propertyData
    } = req.body;

    // Upload photos to S3
    const photoUrls = await Promise.all(
      files.map(async (file) => {
        try {
          const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `properties/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          };

          const uploadResult = await new Upload({
            client: s3Client,
            params: uploadParams,
          }).done();

          return uploadResult.Location;
        } catch (err) {
          console.error("S3 upload failed:", err);
          return null; // return null if one fails, don’t crash entire request
        }
      })
    );

    // Geocode address
    let longitude = 0;
    let latitude = 0;
    try {
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
        {
          street: address,
          city,
          country,
          postalcode: postalCode,
          format: "json",
          limit: "1",
        }
      ).toString()}`;

      const geocodingResponse = await axios.get(geocodingUrl, {
        headers: { "User-Agent": "RealEstateApp (support@example.com)" },
      });

      if (geocodingResponse.data[0]) {
        longitude = parseFloat(geocodingResponse.data[0].lon);
        latitude = parseFloat(geocodingResponse.data[0].lat);
      }
    } catch (geoErr) {
      console.warn("Geocoding failed:", geoErr);
    }

    // Create location
    const [location] = await prisma.$queryRaw<any[]>`
      INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
      RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `;

    // Create property
    const newProperty = await prisma.property.create({
      data: {
        ...propertyData,
        photoUrls: photoUrls.filter(Boolean), // remove failed uploads
        locationId: location.id,
        managerCognitoId,
        amenities: typeof propertyData.amenities === "string"
          ? propertyData.amenities.split(",").map((a: string) => a.trim())
          : [],
        highlights: typeof propertyData.highlights === "string"
          ? propertyData.highlights.split(",").map((h: string) => h.trim())
          : [],
        isPetsAllowed: propertyData.isPetsAllowed === "true",
        isParkingIncluded: propertyData.isParkingIncluded === "true",
        pricePerMonth: parseFloat(propertyData.pricePerMonth),
        securityDeposit: parseFloat(propertyData.securityDeposit),
        applicationFee: parseFloat(propertyData.applicationFee),
        beds: parseInt(propertyData.beds),
        baths: parseFloat(propertyData.baths),
        squareFeet: parseInt(propertyData.squareFeet),
      },
      include: { location: true, manager: true },
    });

    res.status(201).json(newProperty);
  } catch (err: any) {
    res.status(500).json({ message: `Error creating property: ${err.message}` });
  }
};
