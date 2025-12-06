import ProductManagementHeader from "@/components/modules/Admin/ProductManagement/ProductManagementHeader";
import { getAllCategories } from "@/services/admin/categoryManagement";



const ProductsManagementPage = async() => {

    const categories = await getAllCategories();

    return (
        <div>
            <ProductManagementHeader
            categories={categories.data}
            />
        </div>
    );
};

export default ProductsManagementPage;