import BusinessDetailPage from "~/components/BusinessDetailPage";
import { getBusinessById } from "~/actions/businesses";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const business = await getBusinessById(id);

  if (!business) {
    notFound();
  }

  return <BusinessDetailPage business={business} />;
}
