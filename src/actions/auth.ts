"use server";
import { signIn, signOut } from "~/server/auth";
import { signup } from "~/server/auth/credentials";
import { z } from "zod/v4";
import { redirect } from "next/navigation";

const authSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  type: z.enum(["customer", "business"]),
  name: z.string(),
});

export const registerUser = async (prevState: unknown, formData: FormData) => {
  const data = authSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
    type: formData.get("type"),
    name: formData.get("name"),
  });

  if (data.password !== data.confirmPassword) {
    return { message: "Passwords do not match" };
  }

  try {
    await signup({
      email: data.email,
      password: data.password,
      name: data.name,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      return { message: error.message };
    } else {
      return { message: "Registration failed. Please try again." };
    }
  }

  try {
    await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    return { message: "Sign-in failed. Please try again." };
  }

  redirect("/");
};

export const signin = async (prevState: unknown, formData: FormData) => {
  const authSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string(),
  });

  const data = authSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  try {
    await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    return { message: "Sign-in failed. Please try again." };
  }

  redirect("/");
};

export const signout = async () => {
  await signOut();
};
