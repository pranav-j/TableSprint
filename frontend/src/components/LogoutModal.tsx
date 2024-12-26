import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import { toggleLogoutModal } from '../redux/tabAndFormSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import warning from "../assets/warning.svg";

const LogoutModal = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const showLogoutModal = useAppSelector((state) => state.tabAndFormReducer.showLogoutModal);

    const onCancel = () => {
        dispatch(toggleLogoutModal());
    };

    const onConfirm = async () => {
        try {
            await axios.post('http://localhost:3000/api/auth/logout', {}, {
                withCredentials: true
            });
            dispatch(toggleLogoutModal());
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if(!showLogoutModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <div className="flex flex-col items-center gap-4">
                    <div className='flex items-center'>
                        <img src={warning} alt="warning" />
                        <h2 className="text-xl font-semibold pl-2">Delete</h2>
                    </div>
                    
                    <p className="text-gray-500 text-center">
                        Are you sure you want to log out?
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
                            className="flex-1 px-4 py-2 rounded-full bg-primary text-white hover:bg-purple-700 transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;