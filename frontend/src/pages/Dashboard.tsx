import CategoryForm from "../components/AddOrEditCategory";
import AdminView from "../components/AdminView";
import Category from "../components/Category";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";


const Dashboard = () => {
    return(
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    {/* <AdminView /> */}
                    {/* <Category /> */}
                    <CategoryForm />
                </div>
            </div>
            
        </div>
    )
};

export default Dashboard;