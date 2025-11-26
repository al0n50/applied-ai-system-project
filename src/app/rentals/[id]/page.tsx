import ItemDetails from "~/components/ItemDetails";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RentalDetailPage({ params }: Props) {
  const { id } = await params;
  // TODO: Fetch rental data using the id
  return <ItemDetails />;
}
