import RentalSearchPage from "~/components/RentalSearchPage";
import { db } from "~/server/db";
import { services } from "~/server/db/schema/application";
import { and, eq, ilike, or } from "drizzle-orm";
import type { ServiceCategory } from "~/server/db/schema/application";

type SearchParams = Promise<{
  search?: string;
  categories?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

export default async function CategoriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const searchTerm = params.search;
  const categoriesParam = params.categories;
  const startDateParam = params.startDate;
  const endDateParam = params.endDate;
  const pageParam = params.page;

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const itemsPerPage = 8;

  // Build filter conditions
  const conditions = [];

  if (searchTerm) {
    conditions.push(ilike(services.name, `%${searchTerm}%`));
  }

  if (categoriesParam) {
    const categoryArray = categoriesParam.split(",") as ServiceCategory[];
    const categoryConditions = categoryArray.map((cat) =>
      eq(services.category, cat),
    );
    conditions.push(or(...categoryConditions));
  }

  let allServices = await db.query.services.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      business: true,
      rentals: true,
      unavailableDates: true,
    },
  });

  // Filter by date availability if date range is provided
  if (startDateParam && endDateParam) {
    const requestedStart = new Date(startDateParam);
    const requestedEnd = new Date(endDateParam);

    allServices = allServices.filter((service) => {
      // Calculate total quantity booked during the requested period
      const bookedQuantity = service.rentals
        .filter((rental) => {
          // Check if rental overlaps with requested dates
          const rentalStart = new Date(rental.startDate);
          const rentalEnd = new Date(rental.endDate);

          return (
            rental.status !== "cancelled" &&
            rentalStart <= requestedEnd &&
            rentalEnd >= requestedStart
          );
        })
        .reduce((sum, rental) => sum + rental.quantity, 0);

      // Calculate total quantity unavailable during the requested period
      const unavailableQuantity = service.unavailableDates
        .filter((block) => {
          const blockStart = new Date(block.startDate);
          const blockEnd = new Date(block.endDate);

          return blockStart <= requestedEnd && blockEnd >= requestedStart;
        })
        .reduce((sum, block) => sum + block.quantityUnavailable, 0);

      // Service is available if total quantity minus booked and unavailable is greater than 0
      const availableQuantity =
        service.totalQuantity - bookedQuantity - unavailableQuantity;

      return availableQuantity > 0;
    });
  }

  // Calculate pagination
  const totalItems = allServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = allServices.slice(startIndex, endIndex);

  return (
    <RentalSearchPage
      services={paginatedServices}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
    />
  );
}
