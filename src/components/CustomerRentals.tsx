import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { getCustomerRentals } from "~/actions/rentals";
import type { RentalStatus } from "~/server/db/schema/application";
import { RentalActionsMenu } from "~/components/RentalActionsMenu";

// Helper to map database status to display status
function getDisplayStatus(
  dbStatus: RentalStatus,
  startDate: Date,
  endDate: Date,
): string {
  const now = new Date();

  if (dbStatus === "cancelled") return "Cancelled";
  if (dbStatus === "completed") return "Completed";

  // For pending/active, check dates
  if (now < startDate) return "Upcoming";
  if (now >= startDate && now <= endDate) return "Active";
  if (now > endDate) return "Completed";

  return "Pending";
}

export default async function CustomerRentals({
  customerId,
}: {
  customerId: string;
}) {
  const rentalsData = await getCustomerRentals(customerId);

  // Transform data for display
  const rentals = rentalsData.map((rental) => {
    const displayStatus = getDisplayStatus(
      rental.status,
      rental.startDate,
      rental.endDate,
    );

    return {
      id: rental.id as string,
      serviceName: rental.service.name,
      businessName: rental.service.business.name,
      businessId: rental.service.businessId,
      startDate: rental.startDate,
      endDate: rental.endDate,
      totalPrice: rental.totalCost / 100, // Convert from cents to dollars
      status: displayStatus,
      quantity: rental.quantity,
    };
  });
  const activeCount = rentals.filter((r) => r.status === "Active").length;
  const upcomingCount = rentals.filter((r) => r.status === "Upcoming").length;
  const totalSpent = rentals.reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-4xl font-semibold">My Rentals</h1>
        <p className="text-neutral-500">View and manage your rental bookings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Active Rentals</CardDescription>
            <CardTitle className="text-2xl">{activeCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Upcoming Rentals</CardDescription>
            <CardTitle className="text-2xl">{upcomingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-2xl">${totalSpent.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Rentals List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Rentals</h2>
        {rentals.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-neutral-500">
              <p>
                No rentals found. Start exploring services to make your first
                rental!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {rentals.map((rental) => (
              <Card key={rental.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {rental.serviceName}
                      </CardTitle>
                      <CardDescription>
                        <Button
                          variant="link"
                          asChild
                          className="h-auto p-0 text-sm text-neutral-500"
                        >
                          <Link href={`/businesses/${rental.businessId}`}>
                            {rental.businessName}
                          </Link>
                        </Button>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        rental.status === "Active"
                          ? "default"
                          : rental.status === "Upcoming"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {rental.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Calendar className="size-4" />
                    <span>
                      {new Date(rental.startDate).toLocaleDateString()} -{" "}
                      {new Date(rental.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <DollarSign className="size-4" />
                    <span className="font-semibold">${rental.totalPrice}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <RentalActionsMenu
                      rentalId={rental.id}
                      status={rental.status}
                      businessId={rental.businessId}
                    />
                    {rental.status === "Active" && (
                      <Button variant="outline" size="sm" className="flex-1">
                        Contact Owner
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
