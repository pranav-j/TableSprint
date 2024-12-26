import tableSprint from "../assets/tablesprint.svg";
import profile from "../assets/profile.svg";
import { useAppDispatch } from "../redux/reduxHooks";
import { toggleLogoutModal } from "../redux/tabAndFormSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex justify-between items-center py-3 px-5 bg-primary text-white">
      <div className="flex items-center gap-3">
        <img src={tableSprint} className="h-9" alt="TableSprint" />
        <h1 className="text-2xl">TableSprint</h1>
      </div>
      <img onClick={() => dispatch(toggleLogoutModal())} src={profile} alt="profile" />
    </div>
  );
};

export default Header;
