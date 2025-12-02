import { notFound } from "next/navigation";
import ItemDetails from "~/components/ItemDetails";
import { db } from "~/server/db";
import { services, rentals, serviceUnavailableDates } from "~/server/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RentalDetailPage({ params }: Props) {
  const { id } = await params;

  // Fetch service data with business information
  const service = await db.query.services.findFirst({
    where: eq(services.id, id),
    with: {
      business: true,
    },
  });

  if (!service) {
    notFound();
  }

  // Fetch unavailable dates for this service
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const unavailableDates = await db.query.serviceUnavailableDates.findMany({
    where: eq(serviceUnavailableDates.serviceId, id),
  });

  // Fetch active/pending rentals for this service to block those dates
  // Exclude cancelled rentals as they don't block availability
  const allRentals = await db.query.rentals.findMany({
    where: eq(rentals.serviceId, id),
  });

  const activeRentals = allRentals.filter(
    (rental) => rental.status !== "cancelled",
  );

  return (
    <ItemDetails
      service={service}
      unavailableDates={unavailableDates}
      activeRentals={activeRentals}
    />
  );
}
