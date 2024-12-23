import TSlogo from "../assets/TSlogo.png";
const AdminView = () => {
    return (
      <div className="p-3 h-full">
        <div className="flex flex-col justify-center items-center shadow-lg h-full bg-white rounded-lg">
            <img src={TSlogo} alt="" />
            <span className="text-[24px]">Welcome to TableSprint admin</span>
        </div>
      </div>
    );
  };
  
  export default AdminView;