import "server-only";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { users, type UserRole } from "~/server/db/schema";
import bcrypt from "bcrypt";

/**
 * Sign in a user with email and password
 * Used by NextAuth CredentialsProvider
 * Sessions are managed by NextAuth with database strategy
 * Custom Logic was needed as NextAuth does not support Database sessions with CredentialsProvider
 * @see /config.ts for implementation information
 */
export const signin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const match = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!match?.password) {
    throw new Error("Invalid credentials");
  }

  const correctPW = await bcrypt.compare(password, match.password);

  if (!correctPW) {
    throw new Error("Invalid credentials");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...user } = match;

  return { user };
};

/**
 * Sign up a new user with email and password
 * Sessions are managed by NextAuth after sign-up
 */
export const signup = async ({
  email,
  password,
  name,
  role,
}: {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}) => {
  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPW = await bcrypt.hash(password, 10);
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: hashedPW,
      name: name ?? null,
      role: role ?? "customer",
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    });

  return { user: newUser };
};
