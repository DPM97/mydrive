import { FiHardDrive } from "react-icons/fi"
import SearchBar from "../SearchBar"

const Header = () => (
  <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
    <div className="flex items-center flex-shrink-0 text-white mr-0">
      <FiHardDrive className="text-xl m-2" />
      <span className="font-semibold text-xl tracking-tight">MyDrive</span>
    </div>
    <div className="block lg:hidden">
      { /* <SearchBar /> */}
    </div>
  </nav>
)

export default Header