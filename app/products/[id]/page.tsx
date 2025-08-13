import ProductDetailsComponent from "@/components/productViewComponent";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ProductDetailsComponent productId={id} />;
}
