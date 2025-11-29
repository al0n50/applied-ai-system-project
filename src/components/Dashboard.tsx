import { DataTable } from "~/components/data-table";
import { SectionCards } from "~/components/section-cards";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getDashboardData } from "~/actions/rentals";

export default async function Dashboard({
  businessUserId,
}: {
  businessUserId: string;
}) {
  const services = await getDashboardData(businessUserId);

  // Transform services data to match the expected DataTable format
  // Using a counter for unique IDs since the schema expects number IDs
  let idCounter = 1;
  const tableData = services.map((service) => ({
    id: idCounter++,
    header: service.name,
    type:
      (service.category as string).charAt(0).toUpperCase() +
      (service.category as string).slice(1),
    status: service.rentals.some((r) => r.status === "active")
      ? "Booked"
      : "Available",
    target: `$${(service.costPerDay / 100).toFixed(0)}`,
    limit: `$${((service.costPerDay / 100) * 1.5).toFixed(0)}`, // Weekend rate is 1.5x
    reviewer: "Business Owner",
  }));

  // Calculate summary statistics from all rentals across all services
  const allRentals = services.flatMap((s) => s.rentals);
  const activeRentals = allRentals.filter((r) => r.status === "active").length;
  const pendingRentals = allRentals.filter(
    (r) => r.status === "pending",
  ).length;
  const totalRevenue = allRentals
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.totalCost / 100, 0);
  const totalServices = services.length;

  return (
    <>
      <div className="flex justify-between p-8 pb-0">
        <h1 className="text-4xl font-semibold">Dashboard</h1>
        <Button variant="primary" className="px-6 py-3 text-xl" asChild>
          <Link href="/my-rentals/new">
            <Plus />
            Add New Service
          </Link>
        </Button>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              activeRentals={activeRentals}
              pendingRentals={pendingRentals}
              totalRevenue={totalRevenue}
              totalServices={totalServices}
            />
            <DataTable data={tableData} />
          </div>
        </div>
      </div>
    </>
  );
}
