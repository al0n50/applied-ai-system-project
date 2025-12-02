"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { registerUser } from "~/actions/auth";
import { useActionState, useState } from "react";
import { ButtonGroup } from "./ui/button-group";
import Link from "next/link";

const initState = { message: null };

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [formState, action] = useActionState<{ message: string | null }>(
    // @ts-expect-error Server Action
    registerUser,
    initState,
  );
  const [tab, setTab] = useState<"customer" | "business">("customer");

  function CustomerSignupForm() {
    return (
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>

        <FieldError
          errors={
            formState
              ? [{ message: formState.message ?? undefined }]
              : undefined
          }
        />
        <FieldGroup>
          <Field>
            <Button type="submit" variant="primary">
              Create Account
            </Button>
            <FieldDescription className="px-6 text-center">
              Already have an account? <Link href="/signin">Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    );
  }

  function BusinessSignupForm() {
    return (
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Business Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your Business Name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>

        <FieldError
          errors={
            formState
              ? [{ message: formState.message ?? undefined }]
              : undefined
          }
        />
        <FieldGroup>
          <Field>
            <Button type="submit" variant="primary">
              Create Account
            </Button>
            <FieldDescription className="px-6 text-center">
              Already have an account? <Link href="/signin">Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    );
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup className="mx-auto mb-5 w-max">
          <Button
            onClick={() => setTab("customer")}
            variant={tab === "customer" ? "primary" : "ghost"}
          >
            Customer
          </Button>

          <Button
            onClick={() => setTab("business")}
            variant={tab === "business" ? "primary" : "ghost"}
          >
            Business
          </Button>
        </ButtonGroup>

        <form action={action}>
          {/* Pass the tab (customer | business) to the server action via a hidden input */}
          <input type="hidden" name="tab" value={tab} />
          {tab === "customer" ? <CustomerSignupForm /> : <BusinessSignupForm />}
        </form>
      </CardContent>
    </Card>
  );
}
