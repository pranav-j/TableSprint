import ProductsTable from "./ProductsTable";
import TopBar from "./TopBar";

const Products = () => {
  return (
    <div className="p-3 h-full">
      <TopBar />
      <ProductsTable />
    </div>
  );
};

export default Products;
