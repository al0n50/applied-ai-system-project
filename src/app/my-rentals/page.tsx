import Dashboard from "~/components/Dashboard";
import CustomerRentals from "~/components/CustomerRentals";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function MyRentalsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  // Show business dashboard for business owners, customer rentals for customers
  if (userRole === "business") {
    return <Dashboard businessUserId={userId} />;
  }

  return <CustomerRentals customerId={userId} />;
}
