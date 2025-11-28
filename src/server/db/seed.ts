import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import bcrypt from "bcrypt";
import {
  businesses,
  rentals,
  services,
  serviceUnavailableDates,
  users,
} from "./schema/application";

// Load environment variables
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config();

// Helper to get random item from array
function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// Helper to get random int between min and max
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get random date
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function main() {
  const db = drizzle(process.env.DATABASE_URL);

  console.log("🌱 Starting database seed...");

  // Hash password for test users
  const hashedPassword = await bcrypt.hash("password", 10);

  // Create customer and business users
  const customerUsers = Array.from({ length: 60 }, () => ({
    id: crypto.randomUUID(),
    name: `Customer ${randomInt(1000, 9999)}`,
    email: `customer${randomInt(1000, 9999)}@example.com`,
    password: hashedPassword,
    role: "customer" as const,
    emailVerified: new Date(),
  }));

  const businessUsers = Array.from({ length: 40 }, () => ({
    id: crypto.randomUUID(),
    name: `Business Owner ${randomInt(1000, 9999)}`,
    email: `business${randomInt(1000, 9999)}@example.com`,
    password: hashedPassword,
    role: "business" as const,
    emailVerified: new Date(),
  }));

  // Insert test accounts
  const testCustomer = {
    id: crypto.randomUUID(),
    name: "Customer User",
    email: "customer@email.com",
    password: hashedPassword,
    role: "customer" as const,
    emailVerified: new Date(),
  };

  const testBusiness = {
    id: crypto.randomUUID(),
    name: "Business User",
    email: "business@email.com",
    password: hashedPassword,
    role: "business" as const,
    emailVerified: new Date(),
  };

  await db
    .insert(users)
    .values([testCustomer, testBusiness, ...customerUsers, ...businessUsers]);
  console.log("✅ Created users");

  // Create businesses for business users
  const allBusinessUsers = [testBusiness, ...businessUsers];
  const businessRecords = allBusinessUsers.map((user) => ({
    userId: user.id,
    name: `${user.name}'s Company`,
    address: `${randomInt(100, 9999)} Main St, City, ST ${randomInt(10000, 99999)}`,
    phoneNumber: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
    email: user.email,
  }));

  await db.insert(businesses).values(businessRecords);
  console.log("✅ Created businesses");

  // Create services
  const serviceNames = [
    "Kayak",
    "Paddleboard",
    "Bicycle",
    "Tent",
    "Camping Gear",
    "Photography Equipment",
    "Party Supplies",
    "Sound System",
    "Projector",
    "Conference Room",
    "Power Tools",
    "Lawn Equipment",
    "Car",
    "Van",
    "Truck",
    "Motorcycle",
    "Scooter",
    "E-Bike",
  ];

  const serviceDescriptions = [
    "Perfect for outdoor adventures",
    "High quality equipment for rent",
    "Well-maintained and ready to use",
    "Professional grade gear",
    "Ideal for events and parties",
    "Top condition equipment",
    "Great for beginners and experts alike",
    "Affordable and reliable",
  ];

  const serviceRecords = Array.from({ length: 200 }, () => ({
    id: crypto.randomUUID(),
    businessId: random(allBusinessUsers).id,
    name: random(serviceNames),
    description: random(serviceDescriptions),
    costPerDay: randomInt(1000, 50000),
    totalQuantity: randomInt(1, 20),
    images: [],
  }));

  await db.insert(services).values(serviceRecords);
  console.log("✅ Created services");

  // Create service unavailable dates
  const unavailableReasons = [
    "maintenance",
    "business_needs",
    "reserved",
    "repair",
  ];
  const unavailableDatesRecords = Array.from({ length: 100 }, () => {
    const startDate = randomDate(
      new Date("2025-01-01"),
      new Date("2025-12-31"),
    );
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + randomInt(1, 14));

    return {
      id: crypto.randomUUID(),
      serviceId: random(serviceRecords).id,
      startDate,
      endDate,
      reason: random(unavailableReasons),
      quantityUnavailable: randomInt(1, 5),
    };
  });

  await db.insert(serviceUnavailableDates).values(unavailableDatesRecords);
  console.log("✅ Created service unavailable dates");

  // Create rentals
  const rentalStatuses = ["pending", "active", "completed", "cancelled"];
  const allCustomers = [testCustomer, ...customerUsers];
  const rentalRecords = Array.from({ length: 300 }, () => {
    const startDate = randomDate(
      new Date("2025-01-01"),
      new Date("2025-12-31"),
    );
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + randomInt(1, 30));
    const quantity = randomInt(1, 5);
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      customerId: random(allCustomers).id,
      serviceId: random(serviceRecords).id,
      quantity,
      startDate,
      endDate,
      status: random(rentalStatuses) as
        | "pending"
        | "active"
        | "completed"
        | "cancelled",
      totalCost: randomInt(5000, 200000),
      notes: `Rental for ${days} days`,
    };
  });

  // Filter out duplicates (same customer + service combination)
  const uniqueRentals = rentalRecords.filter(
    (rental, index, self) =>
      index ===
      self.findIndex(
        (r) =>
          r.customerId === rental.customerId &&
          r.serviceId === rental.serviceId,
      ),
  );

  await db.insert(rentals).values(uniqueRentals);
  console.log("✅ Created rentals");

  console.log("✅ Database seeded successfully!");
  console.log(`
📊 Summary:
  - Users: ${allCustomers.length + allBusinessUsers.length}
  - Businesses: ${businessRecords.length}
  - Services: ${serviceRecords.length}
  - Unavailable Dates: ${unavailableDatesRecords.length}
  - Rentals: ${uniqueRentals.length}
  
🔑 Test Accounts:
  - Customer: customer@email.com / password
  - Business: business@email.com / password
  `);
}

main().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
