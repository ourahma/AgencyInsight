import {
  AiOutlineDashboard,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineEye,
} from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FiActivity } from "react-icons/fi";
import { IoMdHand } from "react-icons/io";

// React Icons version using same names for consts
export const DashboardIcon = ({ className = "w-6 h-6" }) => (
  <AiOutlineDashboard className={className} />
);
export const BuildingIcon = ({ className = "w-6 h-6" }) => (
  <AiOutlineHome className={className} />
);
export const UsersIcon = ({ className = "w-6 h-6" }) => (
  <AiOutlineUser className={className} />
);
export const ChevronLeftIcon = ({ className = "w-6 h-6" }) => (
  <BiChevronLeft className={className} />
);
export const ChevronRightIcon = ({ className = "w-6 h-6" }) => (
  <BiChevronRight className={className} />
);
export const EyeIcon = ({ className = "w-6 h-6" }) => (
  <AiOutlineEye className={className} />
);
export const WaveIcon = ({ className = "w-6 h-6" }) => (
  <IoMdHand className={className} />
);
export const StatsIcon = ({ className = "w-6 h-6" }) => (
  <FiActivity className={className} />
);
