"use server";

import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { rentals, services } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

const createRentalSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").default(1),
});

export const createRental = async (prevState: unknown, formData: FormData) => {
  // Get current user session
  const session = await auth();

  if (!session?.user?.id) {
    return { message: "You must be signed in to create a rental" };
  }

  // Parse and validate form data
  const { data, success, error } = createRentalSchema.safeParse({
    serviceId: formData.get("serviceId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    quantity: formData.get("quantity") ?? "1",
  });

  if (!success) {
    const message = error.issues.map((issue) => issue.message).join(", ");
    return { message };
  }

  // Parse dates
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { message: "Invalid date format" };
  }

  if (startDate >= endDate) {
    return { message: "End date must be after start date" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate < today) {
    return { message: "Start date cannot be in the past" };
  }

  try {
    // Fetch service to calculate cost
    const service = await db.query.services.findFirst({
      where: eq(services.id, data.serviceId),
    });

    if (!service) {
      return { message: "Service not found" };
    }

    // Calculate number of days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate total cost (costPerDay is in cents)
    const totalCost = service.costPerDay * diffDays * data.quantity;

    // Create rental
    await db.insert(rentals).values({
      customerId: session.user.id,
      serviceId: data.serviceId,
      quantity: data.quantity,
      startDate,
      endDate,
      totalCost,
      status: "pending",
    });

    console.log("Rental created successfully");
  } catch (error) {
    console.error("Error creating rental:", error);
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "Failed to create rental. Please try again." };
  }

  redirect("/my-rentals");
};

export type CustomerRental = InferSelectModel<typeof rentals> & {
  service: InferSelectModel<typeof services> & {
    business: {
      userId: string;
      name: string;
      address: string | null;
      logo: string | null;
      backgroundImage: string | null;
      phoneNumber: string | null;
      email: string | null;
      website: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  };
};

export const getCustomerRentals = async (
  customerId: string,
): Promise<CustomerRental[]> => {
  try {
    const customerRentals = await db.query.rentals.findMany({
      where: eq(rentals.customerId, customerId),
      with: {
        service: {
          with: {
            business: true,
          },
        },
      },
      orderBy: (rentals, { desc }) => [desc(rentals.createdAt)],
    });

    return customerRentals;
  } catch (error) {
    console.error("Error fetching customer rentals:", error);
    return [];
  }
};

export type BusinessService = InferSelectModel<typeof services> & {
  rentals: Array<
    InferSelectModel<typeof rentals> & {
      customer: {
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
        role: "customer" | "business";
        password: string | null;
        createdAt: Date;
      };
    }
  >;
};

export const getDashboardData = async (
  businessUserId: string,
): Promise<BusinessService[]> => {
  try {
    // Get all services for this business
    const businessServices = await db.query.services.findMany({
      where: eq(services.businessId, businessUserId),
      with: {
        rentals: {
          with: {
            customer: true,
          },
          orderBy: (rentals, { desc }) => [desc(rentals.createdAt)],
        },
      },
      orderBy: (services, { desc }) => [desc(services.createdAt)],
    });

    return businessServices;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return [];
  }
};

export const cancelRental = async (rentalId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in to cancel a rental",
    };
  }

  try {
    // First, verify the rental belongs to the current user
    const rental = await db.query.rentals.findFirst({
      where: eq(rentals.id, rentalId),
    });

    if (!rental) {
      return { success: false, message: "Rental not found" };
    }

    if (rental.customerId !== session.user.id) {
      return {
        success: false,
        message: "Unauthorized: This rental does not belong to you",
      };
    }

    // Check if rental has already started (active)
    const now = new Date();
    if (now >= rental.startDate && now <= rental.endDate) {
      return { success: false, message: "Cannot cancel an active rental" };
    }

    // Check if rental is already completed or cancelled
    if (rental.status === "completed" || rental.status === "cancelled") {
      return {
        success: false,
        message: "This rental is already " + rental.status,
      };
    }

    // Update rental status to cancelled
    await db
      .update(rentals)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(rentals.id, rentalId));

    return { success: true, message: "Rental cancelled successfully" };
  } catch (error) {
    console.error("Error cancelling rental:", error);
    return {
      success: false,
      message: "Failed to cancel rental. Please try again.",
    };
  }
};
