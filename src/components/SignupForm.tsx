"use client";

import { registerUser } from "~/actions/auth";
import Link from "next/link";
import Submit from "~/components/SubmitButton";
import { useActionState } from "react";

const initState = { message: null };

const SignupForm = () => {
  const [formState, action] = useActionState<{ message: string | null }>(
    registerUser,
    initState,
  );

  return (
    <form
      action={action}
      className="bg-content1 border-default-100 flex flex-col gap-2 rounded-md border p-3 shadow-lg"
    >
      <h3 className="my-4">Sign up</h3>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-md border px-3 py-2 text-lg"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full rounded-md border px-3 py-2 text-lg"
      />
      <input
        name="name"
        type="text"
        placeholder="Name"
        required
        className="w-full rounded-md border px-3 py-2 text-lg"
      />
      <Submit label={"signup"} />
      <div>
        <Link href="/signin">{`Already have an account?`}</Link>
      </div>
      {formState?.message && <p>{formState.message}</p>}
    </form>
  );
};

export default SignupForm;
