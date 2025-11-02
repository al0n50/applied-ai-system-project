"use client";
import { signout } from "~/actions/auth";

export function SignoutButton() {
  return (
    <button
      type="button"
      className="col-span-2 flex w-xs flex-col gap-4 justify-self-center rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
      onClick={() => signout()}
    >
      Sign out
    </button>
  );
}
