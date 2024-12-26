import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import { resetDeleteId } from '../redux/tabAndFormSlice';
import { deleteCategory } from '../redux/categorySlice';
import { deleteSubcategory } from '../redux/subcategorySlice';
import { deleteProduct } from '../redux/productSlice';
import warning from "../assets/warning.svg";


const DeleteModal = () => {
    const dispatch = useAppDispatch();
    const deleteId = useAppSelector((state) => state.tabAndFormReducer.deleteId);
    const activeTab = useAppSelector((state) => state.tabAndFormReducer.activeTab);

    const onCancel = () => {
        dispatch(resetDeleteId());
    };

    const onConfirm = () => {
        if(activeTab === "Category" && deleteId) {
            dispatch(deleteCategory(deleteId));
        }
        if(activeTab === "Subcategory" && deleteId) {
            dispatch(deleteSubcategory(deleteId));
        }
        if(activeTab === "Products" && deleteId) {
            dispatch(deleteProduct(deleteId));
        }
        dispatch(resetDeleteId());
    }

    if(!deleteId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className='flex items-center'>
            <img src={warning} alt="warning" />
            <h2 className="text-xl font-semibold pl-2">Delete</h2>
          </div>
          
          <p className="text-gray-500 text-center">
            Are you sure you want to delete?
          </p>
          
          <div className="flex gap-4 w-full mt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-full bg-[#662671] text-white hover:bg-purple-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;