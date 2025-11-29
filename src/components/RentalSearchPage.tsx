"use client";

import React from "react";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Skeleton } from "./ui/skeleton";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import Link from "next/link";
import Image from "next/image";
import type { DateRange } from "react-day-picker";
import { Calendar } from "./ui/calendar";
import type { businesses, services } from "~/server/db/schema/application";

type Service = typeof services.$inferSelect & {
  business: typeof businesses.$inferSelect;
};

type RentalSearchPageProps = {
  services: Service[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export default function RentalSearchPage({
  services,
  currentPage,
  totalPages,
  totalItems,
}: RentalSearchPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) ?? [],
  );

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    startDateParam && endDateParam
      ? {
          from: new Date(startDateParam),
          to: new Date(endDateParam),
        }
      : undefined,
  );

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.set("search", searchTerm);
    }

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }

    if (dateRange?.from) {
      params.set("startDate", dateRange.from.toISOString().split("T")[0]!);
    }

    if (dateRange?.to) {
      params.set("endDate", dateRange.to.toISOString().split("T")[0]!);
    }

    router.push(`/?${params.toString()}`);
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // Auto-apply filters when both dates are selected
    if (range?.from && range?.to) {
      const params = new URLSearchParams();

      if (searchTerm) {
        params.set("search", searchTerm);
      }

      if (selectedCategories.length > 0) {
        params.set("categories", selectedCategories.join(","));
      }

      params.set("startDate", range.from.toISOString().split("T")[0]!);
      params.set("endDate", range.to.toISOString().split("T")[0]!);

      router.push(`/?${params.toString()}`);
    }
  };

  return (
    <main className="flex flex-col justify-center gap-8 p-8 lg:flex-row lg:items-start">
      <aside className="rounded-md bg-white p-4">
        <form onSubmit={handleApplyFilters} className="flex flex-col gap-4">
          <h2>Filter Your Search</h2>
          <InputGroup className="">
            <InputGroupInput
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>

          <FieldGroup className="gap-4">
            <FieldLabel>Categories</FieldLabel>

            <Field orientation="horizontal">
              <Checkbox
                id="vehicles"
                className="accent-blue-500"
                checked={selectedCategories.includes("vehicles")}
                onCheckedChange={() => handleCategoryToggle("vehicles")}
              />
              <Label htmlFor="vehicles" className="font-light text-neutral-500">
                Vehicles
              </Label>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="equipment"
                className="accent-blue-500"
                checked={selectedCategories.includes("equipment")}
                onCheckedChange={() => handleCategoryToggle("equipment")}
              />
              <Label
                htmlFor="equipment"
                className="font-light text-neutral-500"
              >
                Equipment
              </Label>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="spaces"
                className="accent-blue-500"
                checked={selectedCategories.includes("spaces")}
                onCheckedChange={() => handleCategoryToggle("spaces")}
              />
              <Label htmlFor="spaces" className="font-light text-neutral-500">
                Spaces
              </Label>
            </Field>
          </FieldGroup>

          <Button type="submit" variant="primary">
            Apply Filters
          </Button>
        </form>
      </aside>

      <section className="flex w-full max-w-6xl flex-col gap-8">
        <div>
          <h1 className="text-4xl font-semibold">Find Available Rentals</h1>
          <p className="text-neutral-500">
            Browse and book services that fit your schedule.
          </p>
        </div>

        {/* Calendar */}
        {/* <Skeleton className="h-[24rem] rounded-lg bg-neutral-200" /> */}
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateRangeChange}
          numberOfMonths={2}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          className="w-full max-w-7xl self-center rounded-lg border shadow-sm"
        />

        {/* Search Results */}
        <span className="text-sm text-neutral-500">
          Showing {services.length} of {totalItems} results
        </span>

        <div className="grid grid-cols-4 gap-8">
          {services.map((service) => (
            <SmallItemDetail key={service.id} service={service} />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={
                    currentPage > 1
                      ? `/?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(currentPage - 1) }).toString()}`
                      : "#"
                  }
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1]! < page - 1 && (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href={`/?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(page) }).toString()}`}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}
              <PaginationItem>
                <PaginationNext
                  href={
                    currentPage < totalPages
                      ? `/?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(currentPage + 1) }).toString()}`
                      : "#"
                  }
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>
    </main>
  );
}

const SmallItemDetail = ({ service }: { service: Service }) => (
  <div className="rounded-md shadow">
    {service.images && service.images.length > 0 && service.images[0] ? (
      <div className="relative h-36 w-full">
        <Image
          src={service.images[0]}
          alt={service.name}
          fill
          className="rounded-none rounded-t-md object-cover"
        />
      </div>
    ) : (
      <Skeleton className="h-36 rounded-none rounded-t-md bg-neutral-200" />
    )}
    <div className="flex flex-col gap-1 p-4">
      <h3>{service.name}</h3>
      <Button
        variant="link"
        asChild
        className="justify-start p-0 text-neutral-500"
      >
        <Link href={`/businesses/${service.business.userId}`}>
          {service.business.name}
        </Link>
      </Button>
      <p className="text-neutral-500">
        ${(service.costPerDay / 100).toFixed(2)}/day
      </p>

      <Button
        asChild
        className="bg-teal-500/60 text-neutral-950 hover:bg-teal-600/70"
      >
        <Link href={`/rentals/${service.id}`}>Book Now</Link>
      </Button>
    </div>
  </div>
);
