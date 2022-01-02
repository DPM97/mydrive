import axios from "axios"
import { FiHardDrive, FiLogOut } from "react-icons/fi"

const Header = ({ setFiles, setAuth }) => {

  const onLogout = async () => {
    await axios.get('http://localhost:8080/logout', { withCredentials: true })
    setFiles([])
    setAuth(false)
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-0">
        {/* <FiHardDrive className="text-xl m-2" /> */}
        <span className="font-semibold text-xl tracking-tight"><FiHardDrive /></span>
      </div>
      <div className="block text-white text-xl">
        <a onClick={onLogout} className="hover:cursor-pointer">
          <FiLogOut />
        </a>
      </div>
    </nav>

  )
}

export default Header