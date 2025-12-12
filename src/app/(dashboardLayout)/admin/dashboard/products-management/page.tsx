import ProductManagementHeader from "@/components/modules/Admin/ProductManagement/ProductManagementHeader";
import ProductFilters from "@/components/modules/Admin/ProductManagement/ProductsFilters";
import ProductsTable from "@/components/modules/Admin/ProductManagement/ProductTable";
import TablePagination from "@/components/shared/TablePagination";
import { getAllCategories } from "@/services/admin/categoryManagement";
import { getProducts } from "@/services/admin/productManagement";
import { Suspense } from "react";

const ProductsManagementPage = async () => {
  const categories = await getAllCategories();

  const productsResults = await getProducts();
  console.log(productsResults.meta)
  const totalPages = Math.ceil((productsResults.meta?.total || 1) / (productsResults.meta?.limit || 1));
    
  return (
    <div>
      <ProductManagementHeader categories={categories.data} />

    <ProductFilters categories={categories?.data || []}/>
      <Suspense>
        <ProductsTable
          products={productsResults.data}
          categories={categories.data}
        />
        <TablePagination
          currentPage={productsResults.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default ProductsManagementPage;
