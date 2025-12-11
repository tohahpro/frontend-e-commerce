import ProductManagementHeader from "@/components/modules/Admin/ProductManagement/ProductManagementHeader";
import ProductsTable from "@/components/modules/Admin/ProductManagement/ProductTable";
import { getAllCategories } from "@/services/admin/categoryManagement";
import { getProducts } from "@/services/admin/productManagement";
import { Suspense } from "react";

const ProductsManagementPage = async () => {
  const categories = await getAllCategories();

  const productsResults= await getProducts()
  return (
    <div>
      <ProductManagementHeader categories={categories.data} />

      <Suspense>
        <ProductsTable
          products={productsResults}
          categories={categories.data}
        />
      </Suspense>
    </div>
  );
};

export default ProductsManagementPage;
