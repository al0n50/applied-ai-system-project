"use client";
import type { DateRange, Matcher } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import Link from "next/link";
import { createRental } from "~/actions/rentals";
import { useActionState } from "react";
import SubmitButton from "./SubmitButton";

type Service = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  costPerDay: number;
  totalQuantity: number;
  images: string[] | null;
  business: {
    name: string;
    email: string | null;
    phoneNumber: string | null;
    address: string | null;
  };
};

type UnavailableDate = {
  startDate: Date;
  endDate: Date;
};

type Rental = {
  startDate: Date;
  endDate: Date;
  quantity: number;
};

type ItemDetailsProps = {
  service: Service;
  unavailableDates: UnavailableDate[];
  activeRentals: Rental[];
};

export default function ItemDetails({
  service,
  unavailableDates,
  activeRentals,
}: ItemDetailsProps) {
  const [state, formAction] = useActionState(createRental, { message: "" });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Helper function to get all dates in a range (inclusive)
  const getDatesInRange = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Build disabled dates array
  const disabledDates: Matcher[] = [
    { before: new Date() }, // Disable past dates
  ];

  // Add unavailable date ranges
  unavailableDates.forEach((unavailable) => {
    disabledDates.push({
      from: new Date(unavailable.startDate),
      to: new Date(unavailable.endDate),
    });
  });

  // Group rentals by date to track booked quantities
  const rentalsByDate = new Map<string, number>();

  activeRentals.forEach((rental) => {
    const dates = getDatesInRange(
      new Date(rental.startDate),
      new Date(rental.endDate),
    );

    dates.forEach((date) => {
      const dateKey = date.toISOString().split("T")[0];
      if (dateKey) {
        rentalsByDate.set(
          dateKey,
          (rentalsByDate.get(dateKey) ?? 0) + rental.quantity,
        );
      }
    });
  });

  // Disable dates where quantity is fully booked
  rentalsByDate.forEach((bookedQty, dateKey) => {
    if (bookedQty >= service.totalQuantity) {
      disabledDates.push(new Date(dateKey));
    }
  });

  // Calculate available quantity for the selected date range
  const getAvailableQuantity = (): number => {
    if (!dateRange?.from || !dateRange?.to) {
      return service.totalQuantity;
    }

    const datesInRange = getDatesInRange(dateRange.from, dateRange.to);
    let maxBookedInRange = 0;

    // Find the maximum booked quantity across all dates in the range
    datesInRange.forEach((date) => {
      const dateKey = date.toISOString().split("T")[0];
      const bookedQty = rentalsByDate.get(dateKey ?? "") ?? 0;
      maxBookedInRange = Math.max(maxBookedInRange, bookedQty);
    });

    return service.totalQuantity - maxBookedInRange;
  };

  const availableQuantity = getAvailableQuantity();

  // Calculate days and total price
  const days =
    dateRange?.from && dateRange?.to
      ? Math.ceil(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
  const totalPrice = (service.costPerDay / 100) * days; // Convert from cents to dollars

  // Format date for input field
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };
  return (
    <main className="mx-auto max-w-7xl p-12">
      <section className="justify-center gap-16 lg:flex">
        <div className="space-y-4 pb-4">
          <Skeleton className="flex h-[28rem] w-[28rem] items-center justify-center rounded-lg bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500">
            <div className="text-center">
              <svg
                className="mx-auto h-20 w-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm">No Image Available</p>
            </div>
          </Skeleton>
          <div className="flex gap-4">
            <Skeleton className="flex h-[6rem] w-[6rem] items-center justify-center rounded-lg bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </Skeleton>
            <Skeleton className="flex h-[6rem] w-[6rem] items-center justify-center rounded-lg bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </Skeleton>
            <Skeleton className="flex h-[6rem] w-[6rem] items-center justify-center rounded-lg bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </Skeleton>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="serviceId" value={service.id} />
          <input type="hidden" name="quantity" value="1" />

          <div className="flex items-end gap-2">
            <h1 className="text-4xl font-bold">{service.name}</h1>
            <p
              className={`rounded-full px-2 whitespace-nowrap ${
                availableQuantity === 0
                  ? "bg-red-500/20 text-red-600/70"
                  : availableQuantity < service.totalQuantity / 2
                    ? "bg-yellow-500/20 text-yellow-600/70"
                    : "bg-green-500/20 text-green-600/70"
              }`}
            >
              {availableQuantity} available
              {dateRange?.from && dateRange?.to ? " for selected dates" : ""}
            </p>
          </div>
          <Button variant="link" className="p-0 text-neutral-500" asChild>
            <Link href={`/businesses/${service.business.name}`}>
              Provided by {service.business.name}
            </Link>
          </Button>

          {/* Calendar */}
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="w-full max-w-2xl self-center rounded-lg border shadow-sm"
            disabled={disabledDates}
          />

          <div className="flex gap-8">
            <Field>
              <FieldLabel>Start Date</FieldLabel>
              <Input
                name="startDate"
                type="date"
                required
                value={formatDate(dateRange?.from)}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setDateRange((prev) => ({ from: newDate, to: prev?.to }));
                }}
              />
            </Field>

            <Field>
              <FieldLabel>End Date</FieldLabel>
              <Input
                name="endDate"
                type="date"
                required
                value={formatDate(dateRange?.to)}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setDateRange((prev) => ({ from: prev?.from, to: newDate }));
                }}
              />
            </Field>
          </div>

          {state?.message && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}

          <div className="flex justify-between rounded-md bg-blue-500/10 px-6 py-4 text-lg">
            <p>
              Total for {days} {days === 1 ? "day" : "days"}
            </p>
            <p className="text-2xl">${totalPrice.toFixed(2)}</p>
          </div>

          <Field>
            <SubmitButton
              label={
                availableQuantity === 0
                  ? "Not available for selected dates"
                  : "Rent now"
              }
              disabled={
                !dateRange?.from || !dateRange?.to || availableQuantity === 0
              }
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
            />
          </Field>
        </form>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="mb-4 text-2xl font-bold">Details</h2>
        <p className="text-neutral-600">
          {service.description ?? "No description available."}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Service Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-500">Category</p>
                <p className="font-medium capitalize">{service.category}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Daily Rate</p>
                <p className="font-medium">
                  ${(service.costPerDay / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Available Quantity</p>
                <p className="font-medium">{service.totalQuantity}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Contact Owner</h3>
            <div className="space-y-3">
              {service.business.phoneNumber && (
                <div>
                  <p className="text-sm text-neutral-500">Phone</p>
                  <p className="font-medium">{service.business.phoneNumber}</p>
                </div>
              )}
              {service.business.email && (
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="font-medium">{service.business.email}</p>
                </div>
              )}
              {service.business.address && (
                <div>
                  <p className="text-sm text-neutral-500">Address</p>
                  <p className="font-medium">{service.business.address}</p>
                </div>
              )}
              <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
