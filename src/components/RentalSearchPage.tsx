"use client";

import { Search, Grid2X2, Table } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Skeleton } from "./ui/skeleton";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ToggleButtonGroup from "./ToggleButtonGroup";
import { useState } from "react";
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
import type { DateRange } from "react-day-picker";
import { Calendar } from "./ui/calendar";

export default function RentalSearchPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });

  return (
    <main className="flex flex-col justify-center gap-8 p-8 lg:flex-row lg:items-start">
      <aside className="rounded-md bg-white p-4">
        <form action="" className="flex flex-col gap-4">
          <h2>Filter Your Search</h2>
          <InputGroup className="">
            <InputGroupInput placeholder="Search" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>

          <FieldGroup className="gap-4">
            <FieldLabel>Categories</FieldLabel>

            <Field orientation="horizontal">
              <Checkbox id="vehicles" className="accent-blue-500" />
              <Label htmlFor="vehicles" className="font-light text-neutral-500">
                Vehicles
              </Label>
            </Field>

            <Field orientation="horizontal">
              <Label
                htmlFor="equipment"
                className="font-light text-neutral-500"
              >
                <Checkbox id="equipment" className="accent-blue-500" />
                Equipment
              </Label>
            </Field>

            <Field orientation="horizontal">
              <Checkbox id="spaces" className="accent-blue-500" />
              <Label htmlFor="spaces" className="font-light text-neutral-500">
                Spaces
              </Label>
            </Field>
          </FieldGroup>

          <FieldGroup className="gap-0">
            <FieldLabel htmlFor="price-range" className="mb-2">
              Date
            </FieldLabel>
            <Input type="date" id="price-range" />
          </FieldGroup>

          <Button type="submit" className="bg-blue-500/90">
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
          onSelect={setDateRange}
          numberOfMonths={2}
          className="w-full max-w-7xl self-center rounded-lg border shadow-sm"
        />

        {/* Search Results */}
        <div className="flex justify-between">
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <ToggleButtonGroup
            options={[
              { value: "grid", icon: Grid2X2 },
              { value: "table", icon: Table },
            ]}
            value={viewMode}
            onChange={setViewMode}
          />
        </div>

        <div className="grid grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_) => (
            <SmallItemDetail key={_} />
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </main>
  );
}

const SmallItemDetail = () => (
  <div className="rounded-md shadow">
    <Skeleton className="h-36 rounded-none rounded-t-md bg-neutral-200" />
    <div className="flex flex-col gap-1 p-4">
      <h3>Professional DSLR Camera</h3>
      <Button
        variant="link"
        asChild
        className="justify-start p-0 text-neutral-500"
      >
        <Link href="/businesses/1">Camera Rentals Inc.</Link>
      </Button>
      <p className="text-neutral-500">$50/day • 4.8 ⭐</p>

      <Button
        asChild
        className="bg-teal-500/60 text-neutral-950 hover:bg-teal-600/70"
      >
        <Link href="/rentals/1">Book Now</Link>
      </Button>
    </div>
  </div>
);
