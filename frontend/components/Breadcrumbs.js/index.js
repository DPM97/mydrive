import Link from "next/link"
import { FiChevronRight, FiHome } from "react-icons/fi"

const Breadcrumbs = ({ slug }) => {
  if (!slug) slug = []
  return (
    <nav className="flex bg-neutral-100 py-3 px-5 border-b-2 border-l-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center text-cyan-500 hover:text-cyan-600">
          <FiHome className="mr-2 " />
          <Link href="/">
            Files
          </Link>
        </li>
        {slug.map((e, i) => (
          <li className="inline-flex items-center text-cyan-500 hover:text-cyan-600">
            <FiChevronRight className="mr-2 text-gray-500 hover:text-gray-500" />
            <Link href={`/files/${slug.slice(0, i + 1).join('/')}`}>
              {e}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs