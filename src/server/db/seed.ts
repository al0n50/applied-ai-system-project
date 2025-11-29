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

  // Business images
  const businessLogos = [
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599305446868-59e861548a8c?w=200&h=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&auto=format&fit=crop",
  ];

  const businessBackgrounds = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop",
  ];

  const businessRecords = allBusinessUsers.map((user) => ({
    userId: user.id,
    name: `${user.name}'s Company`,
    address: `${randomInt(100, 9999)} Main St, City, ST ${randomInt(10000, 99999)}`,
    phoneNumber: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
    email: user.email,
    logo: random(businessLogos),
    backgroundImage: random(businessBackgrounds),
  }));

  await db.insert(businesses).values(businessRecords);
  console.log("✅ Created businesses");

  // Create services
  const servicesByCategory = {
    vehicles: [
      "Car",
      "Van",
      "Truck",
      "Motorcycle",
      "Scooter",
      "E-Bike",
      "Bicycle",
      "Kayak",
    ],
    equipment: [
      "Paddleboard",
      "Tent",
      "Camping Gear",
      "Photography Equipment",
      "Party Supplies",
      "Sound System",
      "Projector",
      "Power Tools",
      "Lawn Equipment",
    ],
    spaces: [
      "Conference Room",
      "Event Space",
      "Meeting Room",
      "Workshop Space",
      "Studio Space",
    ],
  };

  // Images for each service type
  const serviceImages = {
    vehicles: {
      Car: [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop",
      ],
      Van: [
        "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop",
      ],
      Truck: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506836467174-27f1042aa48c?w=800&auto=format&fit=crop",
      ],
      Motorcycle: [
        "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop",
      ],
      Scooter: [
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600677572515-4a6a5e46be8e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1613231147055-e1e0e5a4a2f3?w=800&auto=format&fit=crop",
      ],
      "E-Bike": [
        "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1617646773810-3f5c3f583b88?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611857680934-f1c9d8b7e0c5?w=800&auto=format&fit=crop",
      ],
      Bicycle: [
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&auto=format&fit=crop",
      ],
      Kayak: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600698645440-5b80fdcf17e7?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=800&auto=format&fit=crop",
      ],
    },
    equipment: {
      Paddleboard: [
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1621964342398-eb3ef5a4d7c0?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop",
      ],
      Tent: [
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=800&auto=format&fit=crop",
      ],
      "Camping Gear": [
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1537565732439-e3cd6e0cab1b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=800&auto=format&fit=crop",
      ],
      "Photography Equipment": [
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606810195680-74e16a78e51b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop",
      ],
      "Party Supplies": [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
      ],
      "Sound System": [
        "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop",
      ],
      Projector: [
        "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1602524206684-76b7beb48c43?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop",
      ],
      "Power Tools": [
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&auto=format&fit=crop",
      ],
      "Lawn Equipment": [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1599629954294-1cde951f7e3e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
      ],
    },
    spaces: {
      "Conference Room": [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&auto=format&fit=crop",
      ],
      "Event Space": [
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop",
      ],
      "Meeting Room": [
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&auto=format&fit=crop",
      ],
      "Workshop Space": [
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop",
      ],
      "Studio Space": [
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1493932484895-752d1471eab5?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop",
      ],
    },
  };

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

  const serviceRecords = Array.from({ length: 200 }, () => {
    const categories = Object.keys(servicesByCategory) as Array<
      keyof typeof servicesByCategory
    >;
    const category = random(categories);
    const name = random(servicesByCategory[category]);

    // Get images for this specific service type
    const imagesForService =
      serviceImages[category][
        name as keyof (typeof serviceImages)[typeof category]
      ] || [];

    return {
      id: crypto.randomUUID(),
      businessId: random(allBusinessUsers).id,
      name,
      category,
      description: random(serviceDescriptions),
      costPerDay: randomInt(1000, 50000),
      totalQuantity: randomInt(1, 20),
      images: imagesForService,
    };
  });

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
