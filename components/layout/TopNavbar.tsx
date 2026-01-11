import BrandLogo from "../ui/common/BrandLogo";
import { FiUser } from "react-icons/fi";
export default function TopNavbar() {
  return (
    <header className="h-16 bg-white flex items-center justify-between px-6">
      {/* Left: Logo */}
      <BrandLogo isbrandLogoWhite={false} size="navbar" />

      {/* Right: Profile */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <FiUser className="text-gray-600 text-lg" />
        </div>

        {/* Name & Role */}
        <div className="text-sm text-right leading-tight">
          <p className="font-medium">Kartheek</p>
          <p className="text-gray-500 text-xs">Super Admin</p>
        </div>
      </div>
    </header>
  );
}
