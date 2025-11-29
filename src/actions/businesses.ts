"use server";

import { db } from "~/server/db";
import { businesses, type services } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

export type Business = InferSelectModel<typeof businesses>;
export type Service = InferSelectModel<typeof services>;

export type BusinessWithServices = Business & {
  services: Service[];
};

export const getBusinessById = async (
  businessId: string,
): Promise<BusinessWithServices | null> => {
  try {
    const business = await db.query.businesses.findFirst({
      where: eq(businesses.userId, businessId),
      with: {
        services: {
          orderBy: (services, { desc }) => [desc(services.createdAt)],
        },
      },
    });

    return business ?? null;
  } catch (error) {
    console.error("Error fetching business:", error);
    return null;
  }
};

export const getAllBusinesses = async (): Promise<Business[]> => {
  try {
    const allBusinesses = await db.query.businesses.findMany({
      orderBy: (businesses, { desc }) => [desc(businesses.createdAt)],
    });

    return allBusinesses;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return [];
  }
};
