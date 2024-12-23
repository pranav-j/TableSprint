import home from "../assets/home.svg";
import category from "../assets/category.svg";
import subcategory from "../assets/subcategory.svg";
import products from "../assets/products.svg";
import { IoCaretForward } from "react-icons/io5";

const Sidebar = () => {
    return(
        <div className="max-w-[253px] bg-[#F4F4F4] pt-8">
            <ul className="space-y-2">
                <li className="flex items-center justify-between py-2 bg-[#F4EDAF]">
                    <div className="flex pl-6 gap-3">
                        <img src={home} className="h-8" alt="Dashboard" />
                        <span className="text-xl">Dashboard</span>
                    </div>
                    <IoCaretForward className="text-xl mr-2" />
                </li>
                <li className="flex items-center justify-between py-2">
                    <div className="flex pl-6 gap-3">
                        <img src={category} className="h-8" alt="Category" />
                        <span className="text-xl">Category</span>
                    </div>
                    <IoCaretForward className="text-xl mr-2 text-[#d4d4d4]" />
                </li>
                <li className="flex items-center justify-between py-2">
                    <div className="flex pl-6 gap-3">
                        <img src={subcategory} className="h-8" alt="Subcategory" />
                        <span className="text-xl">Subcategory</span>
                    </div>
                    <IoCaretForward className="text-xl mr-2 text-[#d4d4d4]" />
                </li>
                <li className="flex items-center justify-between py-2">
                    <div className="flex pl-6 gap-3">
                        <img src={products} className="h-8" alt="Products" />
                        <span className="text-xl">Products</span>
                    </div>
                    <IoCaretForward className="text-xl mr-2 text-[#d4d4d4]" />
                </li>
            </ul>
        </div>
    )
}

export default Sidebar;