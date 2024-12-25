import CategoryForm from "../components/AddOrEditCategory";
import SubcategoryForm from "../components/SubcategoryForm";
import AdminView from "../components/AdminView";
import Category from "../components/Category";
import Subcategory from "../components/Subcategory";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAppSelector, useAppDispatch } from "../redux/reduxHooks";
import { fetchCategories } from "../redux/categorySlice";
import { fetchSubcategories } from "../redux/subcategorySlice";
import { useEffect } from "react";


const Dashboard = () => {
    const dispatch = useAppDispatch();

    const activeTab = useAppSelector((state) => state.tabAndFormReducer.activeTab);
    const openForm = useAppSelector((state) => state.tabAndFormReducer.openForm);

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
                    { (activeTab === "Category" && !openForm) && <Category /> }
                    { (activeTab === "Subcategory" && !openForm) && <Subcategory /> }

                    { (openForm === "Add Category" && activeTab === "Category") && <CategoryForm />}
                    { (openForm === "Add Subcategory" && activeTab === "Subcategory") && <SubcategoryForm /> }
                </div>
            </div>
            
        </div>
    )
};

export default Dashboard;