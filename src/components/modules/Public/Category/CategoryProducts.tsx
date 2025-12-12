/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/modules/Public/Home/ProductCard";
import { getProducts } from "@/services/admin/productManagement";
import { useParams } from "next/navigation";

export default function CategoryProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const slug = params?.slug; 

  useEffect(() => {
    async function fetchData() {
      const res = await getProducts();
      setProducts(res?.data || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  // Filter by category slug
  const slugString = Array.isArray(slug) ? slug[0] : slug;
  const filteredProducts = products.filter((item: any) =>
    item?.productCategory?.some(
      (cat: any) =>
        cat?.category?.slug?.toLowerCase() === slugString?.toLowerCase()
    )
  );

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-5 p-5">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((item: any) => (
          <ProductCard key={item.id} product={item} />
        ))
      ) : (
        <div className="col-span-3 text-center text-gray-500">
          No products found for {slug}
        </div>
      )}
    </div>
  );
}
