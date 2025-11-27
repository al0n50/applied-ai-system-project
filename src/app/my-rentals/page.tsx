import Dashboard from "~/components/Dashboard";
import CustomerRentals from "~/components/CustomerRentals";
import { auth } from "~/server/auth";

export default async function MyRentalsPage() {
  const session = await auth();
  const userRole = session?.user?.role;

  // Show business dashboard for business owners, customer rentals for customers
  if (userRole === "business") {
    return <Dashboard />;
  }

  return <CustomerRentals />;
}
