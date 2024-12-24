import home from "../assets/home.svg";
import category from "../assets/category.svg";
import subcategory from "../assets/subcategory.svg";
import products from "../assets/products.svg";
import { IoCaretForward } from "react-icons/io5";
import { setActiveTab } from "../redux/tabAndFormSlice";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";


const Sidebar = () => {

    const dispatch = useAppDispatch();
    const activeTab = useAppSelector((state) => state.tabAndFormReducer.activeTab);

    const handleTabChange = (tab: string) => {
        dispatch(setActiveTab(tab));
    }

    const options = [
        {
            icon: home,
            title: "Dashboard"
        },
        {
            icon: category,
            title: "Category"
        },
        {
            icon: subcategory,
            title: "Subcategory"
        },
        {
            icon: products,
            title: "Products"
        }
    ];

    return(
        <div className="bg-[#F4F4F4] pt-8">
            <ul className="space-y-2">
                {
                    options.map((option, idx) => (
                        <li key={idx} onClick={() => handleTabChange(option.title)} className={`cursor-pointer flex items-center justify-between gap-16 py-2 ${activeTab === option.title && "bg-[#F4EDAF]"}`}>
                            <div className="flex pl-6 gap-5">
                                <img src={option.icon} className="h-8" alt="Dashboard" />
                                <span className="text-xl">{option.title}</span>
                            </div>
                            <IoCaretForward className={`text-xl mr-2 ${activeTab !== option.title && "text-[#c4c4c4]"}`} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Sidebar;