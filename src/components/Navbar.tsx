import Link from "next/link";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Navbar() {
  const user = false; // Replace with actual user authentication logic
  return (
    <nav className="flex gap-4 bg-white px-6 py-2 shadow-md dark:bg-neutral-950">
      <Button asChild variant="link">
        <Link href="/">Rentiability</Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/categories">Categories</Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/my-rentals">My Rentals</Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/help">Help</Link>
      </Button>

      <InputGroup className="ml-auto max-w-lg">
        <InputGroupInput placeholder="Search" />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {user ? (
        <Avatar>
          <AvatarImage src="" alt="User Avatar" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      ) : (
        <>
          <Button className="bg-blue-500">Login</Button>
          <Button variant="secondary">Sign Up</Button>
        </>
      )}
    </nav>
  );
}
