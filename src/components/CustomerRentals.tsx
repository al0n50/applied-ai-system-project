"use client";

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

// Mock data for customer rentals
const mockRentals = [
  {
    id: "1",
    serviceName: "Professional DSLR Camera",
    businessName: "Camera Rentals Inc.",
    businessId: "1",
    startDate: "2025-06-15",
    endDate: "2025-06-18",
    totalPrice: 150,
    status: "Active",
    imageUrl: "",
  },
  {
    id: "2",
    serviceName: "Mountain Bike",
    businessName: "Adventure Gear Co.",
    businessId: "2",
    startDate: "2025-07-01",
    endDate: "2025-07-05",
    totalPrice: 175,
    status: "Upcoming",
    imageUrl: "",
  },
  {
    id: "3",
    serviceName: "Wedding Venue - Garden Estate",
    businessName: "Premier Events",
    businessId: "3",
    startDate: "2025-05-10",
    endDate: "2025-05-10",
    totalPrice: 2500,
    status: "Completed",
    imageUrl: "",
  },
  {
    id: "4",
    serviceName: "Power Tools Kit",
    businessName: "Tool Rental Hub",
    businessId: "4",
    startDate: "2025-06-20",
    endDate: "2025-06-22",
    totalPrice: 90,
    status: "Active",
    imageUrl: "",
  },
];

export default function CustomerRentals() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-4xl font-semibold">My Rentals</h1>
        <p className="text-neutral-500">
          View and manage your rental bookings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Active Rentals</CardDescription>
            <CardTitle className="text-2xl">
              {mockRentals.filter((r) => r.status === "Active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Upcoming Rentals</CardDescription>
            <CardTitle className="text-2xl">
              {mockRentals.filter((r) => r.status === "Upcoming").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-2xl">
              ${mockRentals.reduce((sum, r) => sum + r.totalPrice, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Rentals List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Rentals</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {mockRentals.map((rental) => (
            <Card key={rental.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{rental.serviceName}</CardTitle>
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
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/rentals/${rental.id}`}>View Details</Link>
                  </Button>
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
      </div>
    </div>
  );
}
