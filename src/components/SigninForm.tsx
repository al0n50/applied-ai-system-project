"use client";

import { signin } from "~/actions/auth";
import Link from "next/link";
import Submit from "./SubmitButton";
import { useActionState } from "react";

const initState = { message: null };

const SigninForm = () => {
  const [formState, action] = useActionState<{ message: string | null }>(
    signin,
    initState,
  );

  return (
    <form
      action={action}
      className="bg-content1 border-default-100 flex flex-col gap-2 rounded-md border p-3 shadow-lg"
    >
      <h3 className="my-4">Sign in</h3>
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full rounded border p-2"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Password"
        className="w-full rounded border p-2"
      />
      <Submit label={"signin"} />
      <div>
        <Link href="/signup">{`Don't have an account?`}</Link>
      </div>
      {formState?.message && <p>{formState.message}</p>}
    </form>
  );
};

export default SigninForm;
