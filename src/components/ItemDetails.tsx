"use client";
import type { DateRange, Matcher } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import Link from "next/link";

const fakeData = {
  images: [],
  title: "Fender Stratocaster Electric Guitar",
  dayPrice: 25,
  amountAvailable: 3,
  businessName: "Music Central",
  details:
    "High-quality rental service with professional maintenance and care.",
  businessContact: {
    phone: "(555) 123-4567",
    email: "contact@musiccentral.com",
    address: "123 Music Lane, Harmony City, 98765",
  },
  availability: [
    { day: "Monday", hours: "9:00 AM - 6:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
    { day: "Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
};

const disabledDates: Matcher[] = [
  new Date("06/09/2025"),
  {
    from: new Date("07/20/2025"),
    to: new Date("07/26/2025"),
  },
];

export default function ItemDetails() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });

  const days = 3;
  const totalPrice = fakeData.dayPrice * days;
  return (
    <main className="mx-auto max-w-7xl p-12">
      <section className="gap-16 lg:flex">
        <div className="space-y-4 pb-4">
          <Skeleton className="h-[28rem] w-[28rem] rounded-lg bg-neutral-200" />
          <div className="flex gap-4">
            <Skeleton className="h-[6rem] w-[6rem] rounded-lg bg-neutral-200" />
            <Skeleton className="h-[6rem] w-[6rem] rounded-lg bg-neutral-200" />
            <Skeleton className="h-[6rem] w-[6rem] rounded-lg bg-neutral-200" />
          </div>
        </div>

        <form action="" className="space-y-4">
          <div className="flex items-end">
            <h1 className="text-4xl font-bold">{fakeData.title}</h1>
            <p className="rounded-full bg-green-500/20 px-2 whitespace-nowrap text-green-600/50">
              {fakeData.amountAvailable} available
            </p>
          </div>
          <Button variant="link" className="p-0 text-neutral-500" asChild>
            <Link href="/businesses/1">
              Provided by {fakeData.businessName}
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
              <Input name="start-date" required placeholder="11/23/2025" />
            </Field>

            <Field>
              <FieldLabel>End Date</FieldLabel>
              <Input name="end-date" required placeholder="11/24/2025" />
            </Field>
          </div>

          <div className="flex justify-between rounded-md bg-blue-500/10 px-6 py-4 text-lg">
            <p>Total for {days} days</p>
            <p className="text-2xl">${totalPrice}</p>
          </div>

          <Field>
            <Button type="submit" variant="primary">
              Rent now
            </Button>
          </Field>
        </form>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="mb-4 text-2xl font-bold">Details</h2>
        <p className="text-neutral-600">{fakeData.details}</p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">
              Hours of Availability
            </h3>
            <div className="space-y-2">
              {fakeData.availability.map((schedule) => (
                <div key={schedule.day} className="flex justify-between">
                  <span className="font-medium">{schedule.day}</span>
                  <span className="text-neutral-600">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Contact Owner</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-500">Phone</p>
                <p className="font-medium">{fakeData.businessContact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium">{fakeData.businessContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Address</p>
                <p className="font-medium">
                  {fakeData.businessContact.address}
                </p>
              </div>
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
