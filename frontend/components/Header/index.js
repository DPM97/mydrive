import axios from "axios"
import Router from "next/router"
import { FiHardDrive, FiLogOut } from "react-icons/fi"
import API_URI from "../../functions/uri"

const Header = ({ setFiles, setAuth }) => {

  const onLogout = async () => {
    await axios.get(`${API_URI}/logout`, { withCredentials: true })
    Router.push('/files')
    setAuth(false)
    setFiles([])
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-0">
        <FiHardDrive className="text-xl" />
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