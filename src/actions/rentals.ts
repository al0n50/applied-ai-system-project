"use server";

import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { rentals, services } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
