"use client";
import { useState, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { MapPin, Phone, Mail, Globe, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import ToggleButtonGroup from "./ToggleButtonGroup";
import { Skeleton } from "./ui/skeleton";
import type { BusinessWithServices } from "~/actions/businesses";
import Link from "next/link";
import Image from "next/image";

type BusinessDetailPageProps = {
  business: BusinessWithServices;
};

type FilterType = "all" | "vehicles" | "equipment" | "spaces";

export default function BusinessDetailPage({
  business,
}: BusinessDetailPageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and search services
  const filteredServices = useMemo(() => {
    let filtered = business.services;

    // Apply category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (service) => service.category === activeFilter,
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [business.services, activeFilter, searchQuery]);

  // Get unique categories from services
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      business.services.map((s) => s.category as FilterType),
    );
    return Array.from(uniqueCategories).filter(
      (cat): cat is Exclude<FilterType, "all"> => cat !== "all",
    );
  }, [business.services]);

  // Format price from cents to dollars
  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-4 lg:gap-y-16">
        {/* Hero Section */}
        <div
          className="col-span-full flex h-64 items-end bg-neutral-300 bg-cover bg-center p-12"
          style={{
            backgroundImage: business.backgroundImage
              ? `url(${business.backgroundImage})`
              : undefined,
          }}
        >
          <div className="ml-20">
            <div className="flex items-center gap-4">
              {business.logo && (
                <Image
                  src={business.logo}
                  alt={`${business.name} logo`}
                  width={64}
                  height={64}
                  className="size-16 rounded-full bg-white object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
                  {business.name}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-300">
                  Your trusted partner for quality rentals.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Left Sidebar - Contact & Location */}
        <aside className="space-y-8 gap-y-4 lg:col-span-1">
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-lg font-semibold">Contact & Location</h2>
            <div className="space-y-4">
              {business.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5 text-neutral-600 dark:text-neutral-400" />
                  <div className="text-sm">
                    <p className="font-medium">{business.address}</p>
                  </div>
                </div>
              )}
              {business.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-neutral-600 dark:text-neutral-400" />
                  <p className="text-sm">{business.phoneNumber}</p>
                </div>
              )}
              {business.email && (
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-neutral-600 dark:text-neutral-400" />
                  <p className="text-sm">{business.email}</p>
                </div>
              )}
              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe className="size-5 text-neutral-600 dark:text-neutral-400" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {business.website}
                  </a>
                </div>
              )}
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
              <InputGroupInput
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>

            <ToggleButtonGroup
              options={[
                { value: "all", label: "All" },
                ...categories.map((cat) => ({
                  value: cat,
                  label: cat.charAt(0).toUpperCase() + cat.slice(1),
                })),
              ]}
              value={activeFilter}
              onChange={setActiveFilter}
            />
          </div>

          {/* Rental Cards Grid */}
          {filteredServices.length === 0 ? (
            <div className="col-span-full py-12 text-center text-neutral-500">
              {searchQuery
                ? "No services found matching your search."
                : "No services available in this category."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-lg border bg-neutral-50 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
                >
                  {/* Service image */}
                  {service.images &&
                  service.images.length > 0 &&
                  service.images[0] ? (
                    <Image
                      src={service.images[0]}
                      alt={service.name}
                      width={400}
                      height={192}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <Skeleton className="flex size-full h-48 items-center justify-center bg-neutral-300 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500">
                      No Image
                    </Skeleton>
                  )}

                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold">{service.name}</h3>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {service.category}
                      </span>
                    </div>
                    <p className="mb-4 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                      {service.description ?? "No description available"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold">
                          ${formatPrice(service.costPerDay)}
                        </span>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          /day
                        </span>
                      </div>
                      <Link href={`/rentals/${service.id}`}>
                        <Button variant="primary">Book Now</Button>
                      </Link>
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">
                      {service.totalQuantity} available
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
