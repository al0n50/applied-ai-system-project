"use client";
import { signout } from "~/actions/auth";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

export default function DropdownSignOutItem() {
  return <DropdownMenuItem onClick={() => signout()}>Signout</DropdownMenuItem>;
}
