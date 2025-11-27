import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `rentability_${name}`);

// * Application Tables
// * Business Table
export const businesses = createTable("business", (d) => ({
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }), // userId is now the primary key for one-to-one relationship
  name: d.varchar({ length: 255 }).notNull(),
  address: d.varchar({ length: 500 }),
  logo: d.varchar({ length: 500 }),
  backgroundImage: d.varchar({ length: 500 }),
  phoneNumber: d.varchar({ length: 50 }),
  email: d.varchar({ length: 255 }),
  website: d.varchar({ length: 255 }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  user: one(users, { fields: [businesses.userId], references: [users.id] }),
  services: many(services),
}));

// * Service Table
export const services = createTable(
  "service",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => businesses.userId, { onDelete: "cascade" }),
    name: d.varchar({ length: 255 }).notNull(),
    description: d.text(),
    costPerDay: d.integer().notNull(), // Store in cents to avoid decimal issues
    totalQuantity: d.integer().notNull().default(1), // Total available quantity
    images: d.varchar({ length: 500 }).array(), // Array of image URLs
    createdAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("svc_biz_idx").on(t.businessId)],
);

export const servicesRelations = relations(services, ({ one, many }) => ({
  business: one(businesses, {
    fields: [services.businessId],
    references: [businesses.userId],
  }),
  rentals: many(rentals),
  unavailableDates: many(serviceUnavailableDates),
}));

// * Service Unavailable Dates Table
export const serviceUnavailableDates = createTable(
  "svc_block",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    serviceId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    startDate: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
    endDate: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
    reason: d.varchar({ length: 255 }), // e.g., "maintenance", "business_needs"
    quantityUnavailable: d.integer().notNull().default(1), // How many units are unavailable
    createdAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("svc_blk_svc_idx").on(t.serviceId),
    index("svc_blk_dates_idx").on(t.startDate, t.endDate),
  ],
);

export const serviceUnavailableDatesRelations = relations(
  serviceUnavailableDates,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceUnavailableDates.serviceId],
      references: [services.id],
    }),
  }),
);

// * Rental Table
export type RentalStatus = "pending" | "active" | "completed" | "cancelled";

export const rentals = createTable(
  "rental",
  (d) => ({
    customerId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    serviceId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    quantity: d.integer().notNull().default(1), // How many units are being rented
    startDate: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
    endDate: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
    status: d
      .varchar({ length: 32 })
      .$type<RentalStatus>()
      .default(sql`'pending'`)
      .notNull(),
    totalCost: d.integer().notNull(), // Store in cents
    notes: d.text(),
    createdAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.customerId, t.serviceId] }), // Composite primary key
    index("rnt_dt_idx").on(t.startDate, t.endDate),
    index("rnt_st_idx").on(t.status),
  ],
);

export const rentalsRelations = relations(rentals, ({ one }) => ({
  customer: one(users, {
    fields: [rentals.customerId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [rentals.serviceId],
    references: [services.id],
  }),
}));

// * User Table
export type UserRole = "customer" | "business";
export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  role: d
    .varchar({ length: 32 })
    .$type<UserRole>()
    .default(sql`'customer'`)
    .notNull(),
  password: d.varchar({ length: 255 }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

// * Auth Related Tables
export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
