import { useEffect } from "react";
import { useAppSelector } from "../redux/reduxHooks";
import CategoryTable from "./CategoryTable";
import TopBar from "./TopBar";


const Category = () => {
    const editCategoryId = useAppSelector((state) => state.tabAndFormReducer.editCategoryId);

    useEffect(() => {
        console.log({ editCategoryId });
    }, [editCategoryId])

    return(
        <div className="p-3 h-full">
            <TopBar />
            <CategoryTable />
        </div>
    )
};

export default Category;