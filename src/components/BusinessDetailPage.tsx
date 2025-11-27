"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { MapPin, Phone, Mail, Globe, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import ToggleButtonGroup from "./ToggleButtonGroup";
import { Skeleton } from "./ui/skeleton";

export default function BusinessDetailPage() {
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Cameras" | "Audio" | "Lighting" | "Drones"
  >("All");

  const rentals = [
    {
      id: 1,
      name: "Cinema Camera Package",
      description: "Full kit for professional shoots",
      price: 350,
      period: "day",
      image: "/api/placeholder/400/300",
    },
    {
      id: 2,
      name: "Pro Audio Kit",
      description: "Shotgun mic, boom pole, and recorder",
      price: 150,
      period: "day",
      image: "/api/placeholder/400/300",
    },
    {
      id: 3,
      name: "LED Lighting Panel",
      description: "Bi-color dimmable with stand",
      price: 75,
      period: "day",
      image: "/api/placeholder/400/300",
    },
    {
      id: 4,
      name: "DSLR Camera Body",
      description: "Canon 5D Mark IV or similar",
      price: 120,
      period: "day",
      image: "/api/placeholder/400/300",
    },
    {
      id: 5,
      name: "Aerial Drone",
      description: "4K video, 30 min flight time",
      price: 200,
      period: "day",
      image: "/api/placeholder/400/300",
    },
    {
      id: 6,
      name: "Gimbal Stabilizer",
      description: "For DSLR and mirrorless cameras",
      price: 60,
      period: "day",
      image: "/api/placeholder/400/300",
    },
  ];

  return (
    <div>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-4 lg:gap-y-16">
        {/* Hero Section */}
        <Skeleton className="col-span-full flex h-64 items-end bg-neutral-300 p-12">
          <div className="ml-20">
            <h1 className="text-3xl font-bold text-neutral-800">
              ProGear Rentals
            </h1>
            <p className="text-neutral-500">
              Your one-stop shop for professional equipment rentals.
            </p>
          </div>
        </Skeleton>
        {/* Left Sidebar - Contact & Location */}
        <aside className="space-y-8 gap-y-4 lg:col-span-1">
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-lg font-semibold">Contact & Location</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 size-5 text-neutral-600 dark:text-neutral-400" />
                <div className="text-sm">
                  <p className="font-medium">123 Equipment Lane, Techville,</p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    98765
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-neutral-600 dark:text-neutral-400" />
                <p className="text-sm">(123) 456-7890</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-neutral-600 dark:text-neutral-400" />
                <p className="text-sm">contact@progear.com</p>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="size-5 text-neutral-600 dark:text-neutral-400" />
                <p className="text-sm">www.progearrentals.com</p>
              </div>
            </div>

            <Button className="mt-6 w-full" variant="primary">
              Send Message
            </Button>
          </div>

          {/* Map */}
          <Skeleton className="flex size-full h-64 items-center justify-center bg-neutral-300 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500">
            Map View
          </Skeleton>
        </aside>

        {/* Right Content - Rental Services */}
        <section className="rounded-lg border bg-white p-6 shadow-sm lg:col-span-3 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-2 text-2xl font-bold">Our Rental Services</h2>
          <p className="mb-6 text-neutral-600 dark:text-neutral-400">
            Browse our wide selection of high-quality rental equipment.
          </p>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            <InputGroup className="ml-auto max-w-lg">
              <InputGroupInput placeholder="Search" />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>

            <ToggleButtonGroup
              options={[
                { value: "All", label: "All" },
                { value: "Cameras", label: "Cameras" },
                { value: "Audio", label: "Audio" },
                { value: "Lighting", label: "Lighting" },
                { value: "Drones", label: "Drones" },
              ]}
              value={activeFilter}
              onChange={setActiveFilter}
            />
          </div>

          {/* Rental Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rentals.map((rental) => (
              <div
                key={rental.id}
                className="overflow-hidden rounded-lg border bg-neutral-50 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
              >
                {/* Placeholder for rental image */}
                <Skeleton className="flex size-full h-48 items-center justify-center bg-neutral-300 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500">
                  Image
                </Skeleton>

                <div className="p-4">
                  <h3 className="mb-1 font-semibold">{rental.name}</h3>
                  <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                    {rental.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold">${rental.price}</span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        /{rental.period}
                      </span>
                    </div>
                    <Button variant="primary">Book Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
