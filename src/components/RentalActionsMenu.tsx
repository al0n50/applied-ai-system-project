"use client";

import { useTransition } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { cancelRental } from "~/actions/rentals";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RentalActionsMenuProps {
  rentalId: string;
  status: string;
  businessId: string;
}

export function RentalActionsMenu({
  rentalId,
  status,
  businessId,
}: RentalActionsMenuProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const canCancel = status === "Upcoming" || status === "Pending";

  const handleCancel = () => {
    if (!confirm("Are you sure you want to cancel this rental?")) {
      return;
    }

    startTransition(async () => {
      const result = await cancelRental(rentalId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={isPending}
        >
          <MoreVertical className="size-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/businesses/${businessId}`}>View Business</Link>
        </DropdownMenuItem>
        {canCancel && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleCancel}
              disabled={isPending}
            >
              {isPending ? "Cancelling..." : "Cancel Rental"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
