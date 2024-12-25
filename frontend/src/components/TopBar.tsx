import category from "../assets/category.svg";
import { CiSearch } from "react-icons/ci";
import { useAppSelector, useAppDispatch } from "../redux/reduxHooks";
import { setOpenForm } from "../redux/tabAndFormSlice";

const TopBar = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(
    (state) => state.tabAndFormReducer.activeTab
  );

  const handleClick = () => {
    dispatch(setOpenForm(`Add ${activeTab}`));
  };

  return (
    <div className="px-5 py-2 flex justify-between items-center">
      <div className="flex gap-5 items-center">
        <img src={category} alt="Category" />
        <h2 className="font-bold text-xl">{activeTab}</h2>
        <div className="flex items-center px-5 h-[43px] w-[500px] border border-[#9D9D9D] rounded-[10px]">
          <CiSearch className="text-[24px]" />
          <input
            className="flex-grow bg-transparent border-none focus:outline-none px-2"
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>
      <button
        onClick={() => handleClick()}
        className="py-2 px-2 rounded-[10px] font-semibold bg-[#662671] text-white"
      >
        Add {activeTab}
      </button>
    </div>
  );
};

export default TopBar;
