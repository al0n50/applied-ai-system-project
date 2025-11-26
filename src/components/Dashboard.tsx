import { DataTable } from "~/components/data-table";
import { SectionCards } from "~/components/section-cards";

import data from "~/components/data.json";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <div className="flex justify-between p-8 pb-0">
        <h1 className="text-4xl font-semibold">Dashboard</h1>
        <Button variant="primary" className="px-6 py-3 text-xl" asChild>
          <Link href="/my-rentals/new">
            <Plus />
            Add New Service
          </Link>
        </Button>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
