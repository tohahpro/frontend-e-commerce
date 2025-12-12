/* eslint-disable @typescript-eslint/no-explicit-any */
import CategorySection from "@/components/modules/Public/Home/CategorySection";
import { getAllCategories } from "@/services/admin/categoryManagement";
import { getProducts } from "@/services/admin/productManagement";

const HomePage = async () => {
  const productsResults = await getProducts();
  const categories = await getAllCategories();

  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-10 lg:px-20">
        <div className="p-4 space-y-10">
          {categories?.data?.map((cat: any) => {
            const catProducts = productsResults?.data?.filter(
              (p: any) => p.productCategory[0].category.slug === cat.slug
            );

            return (
              <CategorySection
                key={cat.slug}
                title={cat.name}
                slug={cat.slug}
                products={catProducts}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HomePage;
