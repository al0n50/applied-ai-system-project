import Link from "next/link";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { auth } from "~/server/auth";
import DropdownSignOutItem from "~/app/DropdownSignOutItem";

export default async function Navbar() {
  const user = await auth();
  return (
    <nav className="flex gap-4 bg-white px-6 py-2 shadow-md dark:bg-neutral-950">
      <Button asChild variant="link">
        <Link href="/">Rentability</Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/my-rentals">My Rentals</Link>
      </Button>

      <InputGroup className="ml-auto max-w-lg">
        <InputGroupInput placeholder="Search" />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={user.user?.image ?? ""} alt="User Avatar" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={8} align="end" className="w-44">
            <div className="px-2 py-2 text-sm">
              <div className="text-muted-foreground">Signed in as</div>
              <div className="font-medium">
                {user.user?.email ?? user.user?.name}
              </div>
              <div className="text-muted-foreground">Role</div>
              <div className="font-medium capitalize">{user.user?.role}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownSignOutItem />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button variant="primary" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </nav>
  );
}
