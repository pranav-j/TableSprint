import tableSprint from "../assets/tablesprint.svg";
import profile from "../assets/profile.svg";

const Header = () => {
  return (
    <div className="flex justify-between items-center py-3 px-5 bg-[#662671] text-white">
      <div className="flex items-center gap-3">
        <img src={tableSprint} className="h-9" alt="TableSprint" />
        <h1 className="text-2xl">TableSprint</h1>
      </div>
      <img src={profile} alt="profile" />
    </div>
  );
};

export default Header;
