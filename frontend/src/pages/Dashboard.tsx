import CategoryForm from "../components/CategoryForm";
import SubcategoryForm from "../components/SubcategoryForm";
import ProductForm from "../components/ProductForm";
import AdminView from "../components/AdminView";
import Category from "../components/Category";
import Subcategory from "../components/Subcategory";
import Products from "../components/Products";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DeleteModal from "../components/DeleteModal";
import LogoutModal from "../components/LogoutModal";
import { useAppSelector, useAppDispatch } from "../redux/reduxHooks";
import { fetchCategories } from "../redux/categorySlice";
import { fetchSubcategories } from "../redux/subcategorySlice";
import { useEffect } from "react";



const Dashboard = () => {
    const dispatch = useAppDispatch();

    const activeTab = useAppSelector((state) => state.tabAndFormReducer.activeTab);
    const openForm = useAppSelector((state) => state.tabAndFormReducer.openForm);
    const editCategoryId = useAppSelector((state) => state.tabAndFormReducer.editCategoryId);
    const editSubCategoryId = useAppSelector((state) => state.tabAndFormReducer.editSubCategoryId);
    const editProductId = useAppSelector((state) => state.tabAndFormReducer.editProductId);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchSubcategories());
    }, [])
    return(
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    { (activeTab === "Dashboard" && !openForm) && <AdminView /> }
                    { (activeTab === "Category" && !openForm && !editCategoryId) && <Category /> }
                    { (activeTab === "Subcategory" && !openForm && !editSubCategoryId) && <Subcategory /> }
                    { (activeTab === "Products" && !openForm && !editProductId) && <Products /> }

                    { ((openForm === "Add Category" && activeTab === "Category") || (editCategoryId && activeTab === "Category")) && <CategoryForm />}
                    { ((openForm === "Add Subcategory" && activeTab === "Subcategory") || (editSubCategoryId && activeTab === "Subcategory")) && <SubcategoryForm /> }
                    { ((openForm === "Add Products" && activeTab === "Products") || (editProductId && activeTab === "Products")) && <ProductForm /> }
                    <DeleteModal />
                    <LogoutModal />
                </div>
            </div>
            
        </div>
    )
};

export default Dashboard;