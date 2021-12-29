import { FiSearch } from "react-icons/fi"

const SearchBar = () => (
  <div>
    <div className="container h-10 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="relative"> <input type="text" className="h-10 w-75 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none" placeholder="Search anything..." />
        <div className="absolute top-4 right-3">
          <FiSearch className="text-xl fa fa-search text-gray-400 z-20 hover:text-gray-500 pb-2" />
        </div>
      </div>
    </div>
  </div>
)

export default SearchBar