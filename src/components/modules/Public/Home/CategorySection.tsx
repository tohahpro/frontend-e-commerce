import ProductCard, { Product } from "./ProductCard";
import Link from "next/link";

export default function CategorySection({
  title,
  slug,
  products,
}: {
  title: string;
  slug: string;
  products: Product[];
}) {
  return (
    <section className="space-y-4 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>

        <Link
          href={`/category/${slug}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
