import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-4xl font-bold">Business Not Found</h1>
      <p className="mb-8 text-center text-neutral-600 dark:text-neutral-400">
        The business you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Link href="/">
        <Button variant="primary">Go to Home</Button>
      </Link>
    </div>
  );
}
