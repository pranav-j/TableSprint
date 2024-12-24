import CategoryForm from "../components/AddOrEditCategory";
import AdminView from "../components/AdminView";
import Category from "../components/Category";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAppSelector } from "../redux/reduxHooks";


const Dashboard = () => {

    const activeTab = useAppSelector((state) => state.tabAndFormReducer.activeTab);

    return(
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    { activeTab === "Dashboard" && <AdminView /> }
                    { activeTab === "Category" && <Category /> }
                    <CategoryForm />
                </div>
            </div>
            
        </div>
    )
};

export default Dashboard;